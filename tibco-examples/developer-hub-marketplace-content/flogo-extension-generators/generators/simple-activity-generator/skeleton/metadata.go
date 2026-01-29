package  ${{values.activity.activityName}}

import "github.com/project-flogo/core/data/coerce"

type Settings struct {
{% for o in values.activity.settings %}	
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

type Input struct {
{% for o in values.activity.input %}	
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
{% for o in values.activity.output %}	
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


func (i *Input) FromMap(values map[string]interface{}) error {
	var err error

{% for o in values.activity.input %}
	// ${{o.fieldName}} ${{o.fieldType}} 
	{% if o.fieldType == "string" %}
	i. ${{o.fieldName | capitalize }}, err = coerce.ToString(values["${{ o.fieldName }}"])
	{% elif o.fieldType == "number" %}
	i.${{o.fieldName | capitalize }}, err = coerce.ToFloat64(values["${{ o.fieldName }}"])
	{% elif o.fieldType == "boolean" %}
	i.${{o.fieldName | capitalize }}, err = coerce.ToBool(values["${{ o.fieldName }}"])
	{% elif o.fieldType == "int" %}
	i.${{o.fieldName | capitalize }}, err = coerce.ToInt64(values["${{ o.fieldName }}"])
	{% elif o.fieldType == "datetime" %}
	i.${{o.fieldName | capitalize }}, err = coerce.ToString(values["${{ o.fieldName }}"])
	{% elif o.fieldType == "object" %}
	i.${{o.fieldName | capitalize }}, err = coerce.ToObject(values["${{ o.fieldName }}"])
	{% else %}
	i.${{o.fieldName | capitalize }}, err = coerce.ToObject(values["${{ o.fieldName }}"])
	{% endif %}
	if err != nil {
		return err
	}		
{%- endfor %}

	return nil
}

func (i *Input) ToMap() map[string]interface{} {

	return map[string]interface{}{
{% for o in values.activity.input %}
		"${{o.fieldName}}": i.${{ o.fieldName | capitalize }},	
{%- endfor %}
	}

}


func (o *Output) FromMap(values map[string]interface{}) error {
	var err error

{% for o in values.activity.output %}
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

func (o *Output) ToMap() map[string]interface{} {

	return map[string]interface{}{
{% for o in values.activity.output %}
		"${{o.fieldName}}": o.${{ o.fieldName | capitalize }},	
{%- endfor %}		
	}

}
