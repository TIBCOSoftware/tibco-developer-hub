package ${{values.activity.activityName}}

import (
	"fmt"
	"github.com/project-flogo/core/activity"
	"github.com/project-flogo/core/data/metadata"
	"github.com/project-flogo/core/support/log"
)

func init() {
	
	//err := activity.Register(&Activity{}) 
	//err := activity.Register(&Activity{}, New) to create instances using factory method 'New'
	
	err := activity.Register(&Activity{}, New)
	if err != nil {
		log.RootLogger().Error(err)
	}
}

var activityMd = activity.ToMetadata(&Settings{}, &Input{}, &Output{})
var activityLog = log.ChildLogger(log.RootLogger(), "${{values.extensionName}}-${{values.activity.activityName}}")

//New optional factory method, should be used if one activity instance per configuration is desired
func New(ctx activity.InitContext) (activity.Activity, error) {

	s := &Settings{}
	err := metadata.MapToStruct(ctx.Settings(), s, true)
	if err != nil {
		return nil, err
	}

	{%- for o in values.activity.settings %}
	ctx.Logger().Debugf("Setting: %v", s.${{ o.fieldName | capitalize }})
	{%- endfor %}

	act := &Activity{logger: log.ChildLogger(ctx.Logger(), "${{values.extensionName}}-${{values.activity.activityName}}"), activityName: "${{values.activity.activityName}}"}

	return act, nil
}

// Activity is an sample Activity that can be used as a base to create a custom activity
type Activity struct {
	logger       log.Logger
	activityName string
}

// Metadata returns the activity's metadata
func (a *Activity) Metadata() *activity.Metadata {
	return activityMd
}

// Cleanup method
func (a *Activity) Cleanup() error {

	return nil
}

// Eval implements api.Activity.Eval - Logs the Message
func (a *Activity) Eval(ctx activity.Context) (done bool, err error) {

	activityLog.Debugf("Executing Activity [%s] ", ctx.Name())

	input := &Input{}
	err = ctx.GetInputObject(input)
	if err != nil {
		return false, fmt.Errorf("Error while getting input object: %s", err.Error())
	}

	{%- for o in values.activity.input %}
	ctx.Logger().Debugf("Input: %v", input.${{ o.fieldName | capitalize }})
	{%- endfor %}

    // TODO: Implement your activity logic here

	output := &Output{}

	{%- for o in values.activity.output %}
	ctx.Logger().Debugf("Output: %v", output.${{ o.fieldName | capitalize}})
	{%- endfor %}

	err = ctx.SetOutputObject(output)
	if err != nil {
		return true, err
	}

	activityLog.Debugf("Execution of Activity [%s] " + ctx.Name() + " completed")
	return true, nil
}