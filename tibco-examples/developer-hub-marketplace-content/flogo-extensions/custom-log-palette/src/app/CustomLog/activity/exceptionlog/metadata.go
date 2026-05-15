package exceptionlog

import (
	"github.com/project-flogo/core/data/coerce"
)

type ExceptionLogInput struct {
	LogLevel          string      `md:"Log Level"`
	Message           string      `md:"message"`
	FlowInfo          bool        `md:"flowInfo"`
	ExceptionLogInput interface{} `md:"ExceptionLogInput"`
	AdditionalLog     interface{} `md:"additionalLogParams"`
}

const (
	ivLogLevel          = "Log Level"
	ivMessage           = "message"
	ivFlowInfo          = "flowInfo"
	ivExceptionLogInput = "ExceptionLogInput"
	ivAdditionalLog     = "additionalLogParams"
)

func (i *ExceptionLogInput) ToMap() map[string]interface{} {
	return map[string]interface{}{
		ivLogLevel:          i.LogLevel,
		ivMessage:           i.Message,
		ivFlowInfo:          i.FlowInfo,
		ivExceptionLogInput: i.ExceptionLogInput,
		ivAdditionalLog:     i.AdditionalLog,
	}
}

func (i *ExceptionLogInput) FromMap(values map[string]interface{}) error {
	i.LogLevel, _ = coerce.ToString(values[ivLogLevel])
	if i.LogLevel == "" {
		i.LogLevel = "ERROR"
	}
	i.Message, _ = coerce.ToString(values[ivMessage])
	i.FlowInfo, _ = coerce.ToBool(values[ivFlowInfo])
	i.ExceptionLogInput = values[ivExceptionLogInput]
	i.AdditionalLog = values[ivAdditionalLog]
	return nil
}
