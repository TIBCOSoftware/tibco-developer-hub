#!/bin/bash
set -e
echo "Started running the import flow..."

# Get Other variables
dev_hub_url=${1}
oauth2_token=${2}
import_flow_input_file=${3}

echo "               dev_hub_url: |$dev_hub_url|";
echo "         import_flow_input_file: |$import_flow_input_file|";

SCAFFOLDER_ENDPOINT="api/scaffolder/v2/tasks"

echo "Calling: $dev_hub_url$SCAFFOLDER_ENDPOINT"

response=$(curl -w '\n%{http_code}' -k -X POST \
  "$dev_hub_url$SCAFFOLDER_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $oauth2_token" \
  -d "@$import_flow_input_file" \
  )

http_code=$(tail -n1 <<< "$response")
content=$(sed '$ d' <<< "$response")

if [[ $http_code == 201 ]] ; then
  echo "Import flow started successfully with output: $content"
  id=$(echo $content | grep -o '"id":"[^"]*' | grep -o '[^"]*$')
  echo "Use the below URL to check the status of the import flow"
  status_url='create/tasks/'
  echo "$dev_hub_url$status_url$id"
else
  echo "Error while starting Import flow: $content"
fi


