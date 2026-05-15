package exceptionlog

import (
	"testing"
	"github.com/project-flogo/core/activity"
	"github.com/stretchr/testify/assert"
)

func TestRegister(t *testing.T) {

	ref := activity.GetRef(&ExceptionLogActivity{})
	act := activity.Get(ref)
	assert.NotNil(t, act)
}
