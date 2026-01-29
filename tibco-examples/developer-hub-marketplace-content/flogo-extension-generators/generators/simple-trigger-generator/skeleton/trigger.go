package ${{values.trigger.triggerName}}

import (
	"fmt"

	"github.com/project-flogo/core/data/metadata"
	"github.com/project-flogo/core/support/log"
	"github.com/project-flogo/core/trigger"
)

var triggerMd = trigger.NewMetadata(&HandlerSettings{})

func init() {
	_ = trigger.Register(&Trigger{}, &TriggerFactory{})
}

type Trigger struct {
	name   string
	logger log.Logger
}

// Trigger factory
type TriggerFactory struct {
}

// Metadata implements trigger.Trigger.Metadata
func (t *TriggerFactory) Metadata() *trigger.Metadata {
	return triggerMd
}

// New Creates a new trigger instance for a given id
func (t *TriggerFactory) New(config *trigger.Config) (trigger.Trigger, error) {
	s := &Settings{}

	err := metadata.MapToStruct(config.Settings, s, true)
	if err != nil {
		return nil, fmt.Errorf("error occurred in metadata.MapToStruct: [%s]", err.Error())
	}
	return &Trigger{name: config.Name}, nil
}

// Init implements ext.Trigger.Init
func (t *Trigger) Initialize(ctx trigger.InitContext) error {
	t.logger = ctx.Logger()

	t.logger.Debugf("Initializing %s", t.name)

	for _, handler := range ctx.GetHandlers() {

		handlerSettings := &HandlerSettings{}

		err := metadata.MapToStruct(handler.Settings(), handlerSettings, true)

		if err != nil {
			return fmt.Errorf("error - %s", err.Error())
		}

	}
	return nil
}

func (t *Trigger) Start() error {

	// Start the trigger
	t.logger.Infof("Starting %s...", t.name)

	return nil
}

// Stop implements ext.Trigger.Stop
func (t *Trigger) Stop() error {

	t.logger.Debugf("Stopping %s", t.name)

	return nil
}

//commenting pause resume since its not implemented completely for FlowLimit
// func (t *Trigger) Pause() error {
// 	return nil
// }

// func (t *Trigger) Resume() error {
// 	return nil
// }
