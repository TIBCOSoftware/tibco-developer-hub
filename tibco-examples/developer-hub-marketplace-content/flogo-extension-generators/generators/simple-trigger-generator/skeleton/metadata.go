package ${{values.trigger.triggerName}}

import (
	"github.com/project-flogo/core/data/coerce"
)

type Settings struct {
{% for o in values.trigger.settings %}	
	{% if o.fieldType == "string" %}
    ${{o.fieldName | capitalize }} string `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "number" %}
    ${{o.fieldName | capitalize }} float64 `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "boolean" %}
    ${{o.fieldName | capitalize }} bool `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "int" %}
    ${{o.fieldName | capitalize }} int64 `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "datetime" %}
    ${{o.fieldName | capitalize }} string `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "object" %}
    ${{o.fieldName | capitalize }} map[string]interface{} `md:"${{ o.fieldName }},required"`
	{% else %}
    ${{o.fieldName | capitalize }} map[string]interface{} `md:"${{ o.fieldName }},required"`
	{% endif %}
{%- endfor %}
}
type HandlerSettings struct {
{% for o in values.trigger.handler %}	
	{% if o.fieldType == "string" %}
    ${{o.fieldName | capitalize }} string `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "number" %}
    ${{o.fieldName | capitalize }} float64 `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "boolean" %}
    ${{o.fieldName | capitalize }} bool `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "int" %}
    ${{o.fieldName | capitalize }} int64 `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "datetime" %}
    ${{o.fieldName | capitalize }} string `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "object" %}
    ${{o.fieldName | capitalize }} map[string]interface{} `md:"${{ o.fieldName }},required"`
	{% else %}
    ${{o.fieldName | capitalize }} map[string]interface{} `md:"${{ o.fieldName }},required"`
	{% endif %}
{%- endfor %}
}

type Output struct {
{% for o in values.trigger.output %}	
	{% if o.fieldType == "string" %}
    ${{o.fieldName | capitalize }} string `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "number" %}
    ${{o.fieldName | capitalize }} float64 `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "boolean" %}
    ${{o.fieldName | capitalize }} bool `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "int" %}
    ${{o.fieldName | capitalize }} int64 `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "datetime" %}
    ${{o.fieldName | capitalize }} string `md:"${{ o.fieldName }},required"`
	{% elif o.fieldType == "object" %}
    ${{o.fieldName | capitalize }} map[string]interface{} `md:"${{ o.fieldName }},required"`
	{% else %}
    ${{o.fieldName | capitalize }} map[string]interface{} `md:"${{ o.fieldName }},required"`
	{% endif %}
{%- endfor %}
}

func (o *Output) ToMap() map[string]interface{} {
	
	return map[string]interface{}{
{% for o in values.trigger.output %}
		"${{o.fieldName}}": o.${{ o.fieldName | capitalize }},	
{%- endfor %}		
	}
}

func (o *Output) FromMap(values map[string]interface{}) error {
	var err error

{% for o in values.trigger.output %}
	// ${{o.fieldName}} ${{o.fieldType}} 	
	{% if o.fieldType == "string" %}
	o. ${{o.fieldName | capitalize }}, err = coerce.ToString(values["${{ o.fieldName }}"])
	{% elif o.fieldType == "number" %}
	o.${{o.fieldName | capitalize }}, err = coerce.ToFloat64(values["${{ o.fieldName }}"])
	{% elif o.fieldType == "boolean" %}
	o.${{o.fieldName | capitalize }}, err = coerce.ToBool(values["${{ o.fieldName }}"])
	{% elif o.fieldType == "int" %}
	o.${{o.fieldName | capitalize }}, err = coerce.ToInt64(values["${{ o.fieldName }}"])
	{% elif o.fieldType == "datetime" %}
	o.${{o.fieldName | capitalize }}, err = coerce.ToString(values["${{ o.fieldName }}"])
	{% elif o.fieldType == "object" %}
	o.${{o.fieldName | capitalize }}, err = coerce.ToObject(values["${{ o.fieldName }}"])
	{% else %}
	o.${{o.fieldName | capitalize }}, err = coerce.ToObject(values["${{ o.fieldName }}"])
	{% endif %}
	if err != nil {
		return err
	}		
{%- endfor %}

	return nil
}
