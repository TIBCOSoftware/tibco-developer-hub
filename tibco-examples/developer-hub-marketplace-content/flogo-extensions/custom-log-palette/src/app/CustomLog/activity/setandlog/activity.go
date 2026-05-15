package customlog

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/project-flogo/core/activity"
	"github.com/project-flogo/core/engine"
	"github.com/project-flogo/core/support/log"
	"github.com/project-flogo/flow/instance"
	"github.com/extensions/customlogpalette/src/app/CustomLog/activity/logutil"
)

const loggerName = "flogo.CustomLog.activity.setandlog"

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

// Eval implements api.Activity.Eval - Logs the Message in custom log format
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

	msg := getInputParamString(input.InputParams, "message")
	if input.FlowInfo {
		msg = fmt.Sprintf("%s. FlowInstanceID [%s], Flow [%s], Activity [%s].", msg,
			context.ActivityHost().ID(), context.ActivityHost().Name(), activityName)
	}
	lLevel := strings.ToUpper(input.LogLevel)

	// Build log data in custom format and output
	logData := buildCustomLogData(input, context, msg, lLevel, activityName)
	logFormat := getInputParamString(input.InputParams, "logFormat")
	if logFormat == "" {
		if v := logData["logFormat"]; v != nil && fmt.Sprint(v) != "" {
			logFormat = fmt.Sprint(v)
		}
	}
	// Logger name: use Input.loggerName or build from app.flow.activity
	customLoggerName := getInputParamString(input.InputParams, "loggerName")
	if customLoggerName == "" {
		customLoggerName = fmt.Sprintf(loggerName+".%s.%s.%s",
			engine.GetAppName(), context.ActivityHost().Name(), activityName)
	}

	formatted := logutil.FormatCustomLog(logData, logFormat, lLevel, customLoggerName)
	fmt.Fprintln(os.Stdout, formatted)

	// Set flow-scoped variable customFlowInfo as map (Header + contextParams + message + loglevel)
	// Map is faster than JSON string: no marshaling/unmarshaling overhead when reading
	customFlowInfo := logutil.BuildCustomFlowInfoMap(input.Header, input.ContextParams)
	//fmt.Fprintf(os.Stdout, "*****************************customFlowInfo set in flow scope %+v\n", customFlowInfo)
	const flowScopeKey = "TIB_Flow:customFlowInfo"
	if scopeInst := context.ActivityHost().Scope(); scopeInst != nil {
		if inst, ok := scopeInst.(*instance.Instance); ok {
			_ = inst.GetMasterScope().SetValue(flowScopeKey, customFlowInfo)
		}
	}

	// Validate log level (used for error handling)
	switch lLevel {
	case "INFO", "DEBUG", "ERROR", "WARN":
		// valid
	default:
		return false, activity.NewActivityError(fmt.Sprintf("Invalid Log level [%s] configured. Valid values=[INFO, DEBUG, ERROR, WARN].", lLevel), "LOGMESSAGE-001", activity.ConfigError, nil)
	}
	return true, nil
}

// buildCustomLogData constructs the log data map in custom log format.
// Reusable for other log activities (Log, ExceptionLog, etc.)
func buildCustomLogData(input *Input, context activity.Context, msg string, level string, activityName string) map[string]interface{} {
	flowID := context.ActivityHost().ID()
	flowName := context.ActivityHost().Name()
	appName := engine.GetAppName()
	now := time.Now().Format("2006-01-02T15:04:05.000000")

	// Level in sample: "Info" (capital I), map from INFO -> Info
	levelDisplay := level
	if level == "INFO" {
		levelDisplay = "Info"
	} else if level == "DEBUG" {
		levelDisplay = "Debug"
	} else if level == "ERROR" {
		levelDisplay = "Error"
	} else if level == "WARN" {
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

	// Add Header fields (sessionId, correlationId, trackingId, sender, serviceScope)
	for k, v := range logutil.ExtractHeaderFields(input.Header) {
		logData[k] = v
	}

	// Add contextParams (separate input, keyValuePair)
	for k, v := range logutil.ExtractKeyValuePairs(input.ContextParams) {
		logData[k] = v
	}

	// Add Input params (loggerName, logFormat, targetSystem, message - message may override)
	params := logutil.ExtractParamsFromInput(input.InputParams)
	for k, v := range params {
		if k == "message" && v != nil && fmt.Sprint(v) != "" {
			logData["message"] = v
		} else if k != "message" {
			logData[k] = v
		}
	}

	// Add additionalLogParams
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

func getInputParamString(inputParams interface{}, key string) string {
	m := logutil.ExtractParamsFromInput(inputParams)
	if v, ok := m[key]; ok && v != nil {
		return fmt.Sprint(v)
	}
	return ""
}
