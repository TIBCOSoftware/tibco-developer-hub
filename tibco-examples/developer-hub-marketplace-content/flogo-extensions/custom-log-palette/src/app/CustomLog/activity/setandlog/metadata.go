package customlog

import (
	"github.com/project-flogo/core/data/coerce"
)

type Input struct {
	LogLevel      string      `md:"Log Level"`
	FlowInfo      bool        `md:"flowInfo"`
	Header        interface{} `md:"Header"`
	ContextParams interface{} `md:"contextParams"`
	InputParams   interface{} `md:"Input"`
	AdditionalLog interface{} `md:"additionalLogParams"`
}

const (
	ivLogLevel      = "Log Level"
	ivFlowInfo      = "flowInfo"
	ivHeader        = "Header"
	ivContextParams = "contextParams"
	ivInputParams   = "Input"
	ivAdditionalLog = "additionalLogParams"
)

func (i *Input) ToMap() map[string]interface{} {
	return map[string]interface{}{
		ivLogLevel: i.LogLevel,
		ivFlowInfo: i.FlowInfo,
	}
}

func (i *Input) FromMap(values map[string]interface{}) error {
	i.LogLevel, _ = coerce.ToString(values[ivLogLevel])
	if i.LogLevel == "" {
		i.LogLevel = "INFO"
	}
	i.FlowInfo, _ = coerce.ToBool(values[ivFlowInfo])
	i.Header = values[ivHeader]
	i.ContextParams = values[ivContextParams]
	i.InputParams = values[ivInputParams]
	i.AdditionalLog = values[ivAdditionalLog]
	return nil
}
