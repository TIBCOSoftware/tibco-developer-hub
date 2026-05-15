package customlog

import (
	"github.com/project-flogo/core/data/coerce"
)

type Input struct {
	LogLevel      string      `md:"Log Level"`
	FlowInfo      bool        `md:"flowInfo"`
	LogInput      interface{} `md:"LogInput"`
	AdditionalLog interface{} `md:"additionalLogParams"`
}

const (
	ivLogLevel      = "Log Level"
	ivFlowInfo      = "flowInfo"
	ivLogInput      = "LogInput"
	ivAdditionalLog = "additionalLogParams"
)

func (i *Input) ToMap() map[string]interface{} {
	return map[string]interface{}{
		ivLogLevel: i.LogLevel,
		ivFlowInfo: i.FlowInfo,
		ivLogInput: i.LogInput,
		ivAdditionalLog: i.AdditionalLog,
	}
}

func (i *Input) FromMap(values map[string]interface{}) error {
	i.LogLevel, _ = coerce.ToString(values[ivLogLevel])
	if i.LogLevel == "" {
		i.LogLevel = "INFO"
	}
	i.FlowInfo, _ = coerce.ToBool(values[ivFlowInfo])
	i.LogInput = values[ivLogInput]
	i.AdditionalLog = values[ivAdditionalLog]
	return nil
}
