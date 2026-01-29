package  ${{values.functionPackageName}}

import (
	"fmt"
	"github.com/project-flogo/core/data"
	"github.com/project-flogo/core/data/coerce"
	"github.com/project-flogo/core/data/expression/function"
	"github.com/project-flogo/core/support/log"
)

func init() {
	function.Register(&${{values.functionName}}Func{})
}

type ${{values.functionName}}Func struct {
}

// Name returns the name of the function
func (s *${{values.functionName}}Func) Name() string {
	return "${{values.functionName}}"
}


// GetCategory returns the function category
func (s *${{values.functionName}}Func) GetCategory() string {
	return "${{values.functionPackageName}}"
}

// Sig returns the function signature
func (s *${{values.functionName}}Func) Sig() (paramTypes []data.Type, isVariadic bool) {

	return []data.Type{ {%- for arg in values.arguments %}
        {%- if arg.argType == 'string' -%}
        data.TypeString
        {%- elif arg.argType == 'int' -%}
        data.TypeInt
        {%- elif arg.argType == 'number' -%}
        data.TypeFloat64
        {%- elif arg.argType == 'boolean' -%}
        data.TypeBool
        {%- elif arg.argType == 'datetime' -%}
        data.TypeDateTime
        {%- elif arg.argType == 'object' -%}
        data.TypeObject
        {%- elif arg.argType == 'any' -%}
        data.TypeAny
        {%- else -%}
        data.TypeAny
        {%- endif -%}
        {%- if not loop.last -%}, {%- endif %} {%- endfor %}}, false
}

// Eval executes the function
func (s *${{values.functionName}}Func) Eval(params ...interface{}) (interface{}, error) {

	log.RootLogger().Debug("Start of function ${{values.functionName}}")

    // Validate parameter count
    if len(params) != ${{ values.arguments | length }} {
        return nil, fmt.Errorf("expected ${{ values.arguments | length }} parameters, got %d", len(params))
    }

    // Parameter coercion and validation
{%- for arg in values.arguments %}
    // Coerce parameter ${{ loop.index0 }} (${{ arg.argName }}) to ${{ arg.argType }}
    {%- if arg.argType == 'string' %}
    ${{ arg.argName }}, err := coerce.ToString(params[${{ loop.index0 }}])
    if err != nil {
        return nil, fmt.Errorf("unable to coerce parameter ${{ loop.index0 }} (${{ arg.argName }}) to string: %s", err.Error())
    }
    {%- elif arg.argType == 'int' %}
    ${{ arg.argName }}, err := coerce.ToInt64(params[${{ loop.index0 }}])
    if err != nil {
        return nil, fmt.Errorf("unable to coerce parameter ${{ loop.index0 }} (${{ arg.argName }}) to int: %s", err.Error())
    }
    {%- elif arg.argType == 'number' %}
    ${{ arg.argName }}, err := coerce.ToFloat64(params[${{ loop.index0 }}])
    if err != nil {
        return nil, fmt.Errorf("unable to coerce parameter ${{ loop.index0 }} (${{ arg.argName }}) to float64: %s", err.Error())
    }
    {%- elif arg.argType == 'boolean' %}
    ${{ arg.argName }}, err := coerce.ToBool(params[${{ loop.index0 }}])
    if err != nil {
        return nil, fmt.Errorf("unable to coerce parameter ${{ loop.index0 }} (${{ arg.argName }}) to bool: %s", err.Error())
    }
    {%- elif arg.argType == 'datetime' %}
    ${{ arg.argName }}, err := coerce.ToDateTime(params[${{ loop.index0 }}])
    if err != nil {
        return nil, fmt.Errorf("unable to coerce parameter ${{ loop.index0 }} (${{ arg.argName }}) to datetime: %s", err.Error())
    }
    {%- elif arg.argType == 'object' %}
    ${{ arg.argName }}, err := coerce.ToObject(params[${{ loop.index0 }}])
    if err != nil {
        return nil, fmt.Errorf("unable to coerce parameter ${{ loop.index0 }} (${{ arg.argName }}) to object: %s", err.Error())
    }
    {%- else %}
    ${{ arg.argName }} := params[${{ loop.index0 }}] // any type
    {%- endif %}
{%- endfor %}

    ///////////////////////////////////////////////////////////////////////////
    // TODO: Implement your function logic here using the coerced parameters //
    // Example implementation - replace with your actual logic               //
    ///////////////////////////////////////////////////////////////////////////

{%- if values.returnType == 'string' %}
    result := "function result" // Replace with actual implementation
    return result, nil
{%- elif values.returnType == 'int' %}
    result := 42 // Replace with actual implementation
    return result, nil
{%- elif values.returnType == 'number' %}
    result := 3.14 // Replace with actual implementation
    return result, nil
{%- elif values.returnType == 'boolean' %}
    result := true // Replace with actual implementation
    return result, nil
{%- elif values.returnType == 'object' %}
    result := make(map[string]interface{}) // Replace with actual implementation
    return result, nil
{%- else %}
    result := "default result" // Replace with actual implementation
    return result, nil
{%- endif %}
}
