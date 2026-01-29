# TIBCO Flogo® Extension for ${{values.extensionName}} - ${{values.description}}

${{values.overview}}

## Activity ${{values.activity.activityName}}

${{values.activity.overview}}

${{values.activity.description}}


## Settings


The Settings tab has the following fields:

| Field	| Type | Required	| Description |
|-------|------|-----------|-------------|
{% for o in values.activity.settings %}| ${{ o.fieldName }} | ${{ o.fieldType }} | ${{o.isRequired }} | ${{o.description}} |
{% endfor %}

### Input Settings

The Input tab has the following fields:

| Field	| Type | Required	| Description |
|-------|------|-----------|-------------|
{% for o in values.activity.input %}| ${{ o.fieldName }} | ${{ o.fieldType }} | ${{o.isRequired }} | ${{o.description}} |
{% endfor %}



### Input

None


### Output Settings
The Output Settings tab has the following field:

| Field	| Type | Description |
|-------|-----------|-------------|
{% for o in values.activity.output %}| ${{ o.fieldName }} | ${{ o.fieldType }} | ${{o.description}} |
{% endfor %}


## Loop

Refer to the section on "Using the Loop Feature in an Activity" in the TIBCO Flogo® Enterprise User's Guide for information on the Loop tab.