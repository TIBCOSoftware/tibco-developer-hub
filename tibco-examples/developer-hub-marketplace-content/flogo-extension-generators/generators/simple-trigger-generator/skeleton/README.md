# TIBCO Flogo® Extension for ${{values.extensionName}} - ${{values.description}}

${{values.overview}}

## Trigger ${{values.trigger.triggerName}}

${{values.trigger.overview}}

${{values.trigger.description}}


## Settings


The Settings tab has the following fields:

| Field	| Type | Required	| Description |
|-------|------|-----------|-------------|
{% for o in values.trigger.settings %}| ${{ o.fieldName }} | ${{ o.fieldType }} | ${{o.isRequired }} | ${{o.description}} |
{% endfor %}

### Handler


| Field	| Type | Required	| Description |
|-------|------|-----------|-------------|
{% for o in values.trigger.handler %}| ${{ o.fieldName }} | ${{ o.fieldType }} | ${{o.isRequired }} | ${{o.description}} |
{% endfor %}




### Output Settings
The Output Settings tab has the following field:

| Field	| Type | Description |
|-------|-----------|-------------|
{% for o in values.handler.output %}| ${{ o.fieldName }} | ${{ o.fieldType }} | ${{o.description}} |
{% endfor %}


