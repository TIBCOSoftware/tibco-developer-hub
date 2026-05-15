package exceptionlog

import (
	"fmt"
	"os"
	"time"
	"github.com/project-flogo/core/activity"
	"github.com/project-flogo/core/data"
	"github.com/project-flogo/core/engine"
	"github.com/project-flogo/core/support/log"
	"github.com/project-flogo/flow/instance"
	"github.com/extensions/customlogpalette/src/app/CustomLog/activity/logutil"
)

const loggerName = "flogo.CustomLog.activity.exceptionlog"

var logger log.Logger

type ExceptionLogActivity struct {
}

var activityMd = activity.ToMetadata(&ExceptionLogInput{})

// Metadata returns the activity's metadata
func (a *ExceptionLogActivity) Metadata() *activity.Metadata {
	return activityMd
}

func init() {
	_ = activity.Register(&ExceptionLogActivity{}, New)

}

func New(ctx activity.InitContext) (activity.Activity, error) {
	return &ExceptionLogActivity{}, nil
}

// Eval implements api.Activity.Eval - Logs the Message
func (a *ExceptionLogActivity) Eval(context activity.Context) (done bool, err error) {
	if logger == nil {
		if log.CtxLoggingEnabled() {
			var fields []log.Field
			fields = append(fields, log.FieldString("activity.name", context.Name()))
			fields = append(fields, log.FieldString("flow.name", context.ActivityHost().Name()))
			fields = append(fields, log.FieldString("flow.id", context.ActivityHost().ID()))
			fields = append(fields, log.FieldString("app.name", engine.GetAppName()))
			fields = append(fields, log.FieldString("app.version", engine.GetAppVersion()))
			if engine.GetEnvName() != "" {
				fields = append(fields, log.FieldString("deployment.environment", engine.GetEnvName()))
			}

			if context.GetTracingContext() != nil {
				fields = append(fields, log.FieldString("trace.id", context.GetTracingContext().TraceID()))
				fields = append(fields, log.FieldString("span.id", context.GetTracingContext().SpanID()))
			}
			logger = log.NewLoggerWithFields(loggerName, fields...)
		} else {
			logger = log.NewLogger(loggerName)
		}
		flogoLogActivityLogLevel := ""
		if v := os.Getenv("FLOGO_LOGACTIVITY_LOG_LEVEL"); v != "" {
			flogoLogActivityLogLevel = v
		}
		switch flogoLogActivityLogLevel {
		case "DEBUG":
			log.SetLogLevel(logger, log.DebugLevel)
		case "INFO":
			log.SetLogLevel(logger, log.InfoLevel)
		case "WARN":
			log.SetLogLevel(logger, log.WarnLevel)
		case "ERROR":
			log.SetLogLevel(logger, log.ErrorLevel)
		default:
			log.SetLogLevel(logger, log.DebugLevel)
		}
	}

	activityName := context.Name()
	input := &ExceptionLogInput{}
	err = context.GetInputObject(input)
	if err != nil {
		return false, err
	}

	msg := input.Message
	if input.FlowInfo {
		msg = fmt.Sprintf("%s. FlowInstanceID [%s], Flow [%s], Activity [%s].", msg,
			context.ActivityHost().ID(), context.ActivityHost().Name(), activityName)
	}
	// ExceptionLog: only ERROR level
	lLevel := "ERROR"

	// Header and contextParams from customFlowInfo (set by SetAndLog, flow scope)
	// ExceptionLogInput and additionalLogParams from activity input
	logData := buildCustomLogDataExceptionLog(input, context, msg, activityName)
	logFormat := getInputParamString(input.ExceptionLogInput, "logFormat")
	if logFormat == "" {
		if v := logData["logFormat"]; v != nil && fmt.Sprint(v) != "" {
			logFormat = fmt.Sprint(v)
		}
	}
	customLoggerName := getInputParamString(input.ExceptionLogInput, "loggerName")
	if customLoggerName == "" {
		customLoggerName = fmt.Sprintf(loggerName+".%s.%s.%s",
			engine.GetAppName(), context.ActivityHost().Name(), activityName)
	}

	formatted := logutil.FormatCustomLog(logData, logFormat, lLevel, customLoggerName)
	fmt.Fprintln(os.Stdout, formatted)

	return true, nil
}

// buildCustomLogDataExceptionLog builds log data for ExceptionLog: same as CustomLog but level=ERROR.
// Header+contextParams from customFlowInfo (flow scope), ExceptionLogInput and additionalLogParams from activity input.
func buildCustomLogDataExceptionLog(input *ExceptionLogInput, context activity.Context, msg string, activityName string) map[string]interface{} {
	flowID := context.ActivityHost().ID()
	flowName := context.ActivityHost().Name()
	appName := engine.GetAppName()
	now := time.Now().Format("2006-01-02T15:04:05.000000")

	logData := map[string]interface{}{
		"applicationName":   appName,
		"processName":       flowName,
		"jobId":             flowID,
		"processInstanceId": flowID,
		"level":             "Error",
		"activityName":      activityName,
		"timeStamp":         now,
		"message":           msg,
	}

	// Header + contextParams from customFlowInfo (flow scope, set by SetAndLog)
	customFlowInfo, exists := getFlowVariable(context, "customFlowInfo")
	if exists {
		if m, ok := customFlowInfo.(map[string]interface{}); ok {
			for k, v := range m {
				if k != "message" && k != "loglevel" && v != nil && v != "" {
					logData[k] = v
				}
			}
		}
	}

	// ExceptionLogInput params (loggerName, logFormat, errorCode, errorMessage, errorData)
	params := logutil.ExtractParamsFromInput(input.ExceptionLogInput)
	for k, v := range params {
		if k == "errorMessage" && v != nil && fmt.Sprint(v) != "" {
			logData["message"] = v
		}
		logData[k] = v
	}

	// additionalLogParams from input
	for k, v := range logutil.ExtractKeyValuePairs(input.AdditionalLog) {
		logData[k] = v
	}

	// traceID: OpenTelemetry/OpenTracing trace ID (e.g. Jaeger)
	if context.GetTracingContext() != nil {
		if traceID := context.GetTracingContext().TraceID(); traceID != "" {
			logData["traceID"] = traceID
		}
	}

	return logData
}

func getInputParamString(logInput interface{}, key string) string {
	m := logutil.ExtractParamsFromInput(logInput)
	if v, ok := m[key]; ok && v != nil {
		return fmt.Sprint(v)
	}
	return ""
}

// getFlowVariable legge una variabile dallo scope del flow (come in sharedData).
// key: nome logico della variabile (senza prefisso TIB_Flow:).
func getFlowVariable(ctx activity.Context, key string) (interface{}, bool) {
	const scopeFlow = "Flow"
	name := "TIB_" + scopeFlow + ":" + key
	scopeInst := ctx.ActivityHost().Scope()
	inst, ok := scopeInst.(*instance.Instance)
	if !ok {
		return nil, false
	}
	val, exist := inst.GetMasterScope().GetValue(name)
	if attr, ok := val.(*data.Attribute); ok {
		if attr != nil {
			return attr.Value(), exist
		}
		return nil, exist
	}
	return val, exist
}
