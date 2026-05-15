package customlog

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/project-flogo/core/activity"
	"github.com/project-flogo/core/data"
	"github.com/project-flogo/core/engine"
	"github.com/project-flogo/core/support/log"
	"github.com/project-flogo/flow/instance"
	"github.com/extensions/customlogpalette/src/app/CustomLog/activity/logutil"
)

const loggerName = "flogo.CustomLog.activity.customlog"

var logger log.Logger

type Activity struct {
}

var activityMd = activity.ToMetadata(&Input{})

// Metadata returns the activity's metadata
func (a *Activity) Metadata() *activity.Metadata {
	return activityMd
}

func init() {
	_ = activity.Register(&Activity{}, New)

}

func New(ctx activity.InitContext) (activity.Activity, error) {
	return &Activity{}, nil
}

// Eval implements api.Activity.Eval - Logs the Message
func (a *Activity) Eval(context activity.Context) (done bool, err error) {
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
	input := &Input{}
	err = context.GetInputObject(input)
	if err != nil {
		return false, err
	}

	msg := getInputParamString(input.LogInput, "message")
	if input.FlowInfo {
		msg = fmt.Sprintf("%s. FlowInstanceID [%s], Flow [%s], Activity [%s].", msg,
			context.ActivityHost().ID(), context.ActivityHost().Name(), activityName)
	}
	lLevel := strings.ToUpper(input.LogLevel)

	// Header and contextParams from customFlowInfo (set by SetAndLog, flow scope)
	// LogInput and additionalLogParams from activity input
	logData := buildCustomLogDataCustomLog(input, context, msg, lLevel, activityName)
	logFormat := getInputParamString(input.LogInput, "logFormat")
	if logFormat == "" {
		if v := logData["logFormat"]; v != nil && fmt.Sprint(v) != "" {
			logFormat = fmt.Sprint(v)
		}
	}
	customLoggerName := getInputParamString(input.LogInput, "loggerName")
	if customLoggerName == "" {
		customLoggerName = fmt.Sprintf(loggerName+".%s.%s.%s",
			engine.GetAppName(), context.ActivityHost().Name(), activityName)
	}

	formatted := logutil.FormatCustomLog(logData, logFormat, lLevel, customLoggerName)
	fmt.Fprintln(os.Stdout, formatted)

	switch lLevel {
	case "INFO", "DEBUG", "ERROR", "WARN":
		// valid
	default:
		return false, activity.NewActivityError(fmt.Sprintf("Invalid Log level [%s] configured. Valid values=[INFO, DEBUG, ERROR, WARN].", lLevel), "LOGMESSAGE-001", activity.ConfigError, nil)
	}
	return true, nil
}

// buildCustomLogDataCustomLog builds log data for CustomLog: Header+contextParams from customFlowInfo (flow scope),
// LogInput and additionalLogParams from activity input.
func buildCustomLogDataCustomLog(input *Input, context activity.Context, msg string, level string, activityName string) map[string]interface{} {
	flowID := context.ActivityHost().ID()
	flowName := context.ActivityHost().Name()
	appName := engine.GetAppName()
	now := time.Now().Format("2006-01-02T15:04:05.000000")

	levelDisplay := level
	switch level {
	case "INFO":
		levelDisplay = "Info"
	case "DEBUG":
		levelDisplay = "Debug"
	case "ERROR":
		levelDisplay = "Error"
	case "WARN":
		levelDisplay = "Warn"
	}

	logData := map[string]interface{}{
		"applicationName":   appName,
		"processName":       flowName,
		"jobId":             flowID,
		"processInstanceId": flowID,
		"level":             levelDisplay,
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

	// LogInput params (loggerName, logFormat, targetSystem, message)
	params := logutil.ExtractParamsFromInput(input.LogInput)
	for k, v := range params {
		if k == "message" && v != nil && fmt.Sprint(v) != "" {
			logData["message"] = v
		} else if k != "message" {
			logData[k] = v
		}
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
