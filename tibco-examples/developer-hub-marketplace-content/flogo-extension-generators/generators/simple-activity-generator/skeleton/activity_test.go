package ${{values.activityName}}

import (
	"testing"

	"github.com/project-flogo/core/support/log"
	"github.com/project-flogo/core/support/test"

	"github.com/project-flogo/core/activity"
	"github.com/stretchr/testify/assert"
)


var myActivity = &Activity{logger: log.ChildLogger(log.RootLogger(), "Logger-anotherActivity"), activityName: "anotherActivity"}

func TestRegister(t *testing.T) {
	ref := activity.GetRef(&Activity{})
	act := activity.Get(ref)

	assert.NotNil(t, act)
}

func TestEval(t *testing.T) {

	tc := test.NewActivityContext(myActivity.Metadata())

	// TODO: Assign structure member values to Input
	aInput := &Input{AnInputString: "Hello, World"}
	tc.SetInputObject(aInput)
	ok, _ := myActivity.Eval(tc)
	assert.True(t, ok)
	aOutput := &Output{}
	err := tc.GetOutputObject(aOutput)
	assert.Nil(t, err)

	if err != nil {
		t.Errorf("%s", err.Error())
		t.Fail()
	}
}
