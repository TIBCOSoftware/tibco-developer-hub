#!/bin/bash
set -e
source 0-common-script-functions.sh
start_e2e=$(date +%s)

profile="${1:-initialProfile}"
# use for standalone to remove a specific version
version=v$(date +%s)

# Data Plane NAME
DP_NAME="${2:-Dataplane_$version}"

# Developer Hub Name
DEVHUB_NAME="${3:-DEVHUB_$version}"

echo "---------  Removing a Developer Hub from a Dataplane --------------------";
echo "-- Profile: $profile"
echo "-------------------------------------------------------------------------";
echo "---- Settings: "
echo "-------------------------------------------------------------------------"
echo "----        Dataplane Name: $DP_NAME"
echo "-------------------------------------------------------------------------"
echo "Refreshing token for profile: $profile"
tibcop refresh-token --profile "$profile"

echo "Current dataplanes:"
tibcop tplatform:list-dataplanes --profile "$profile"

echo "Current capability instances in the dataplane:"
# tibcop tplatform:list-capability-instances --dataplane-name="TEST_v1749810302" --profile "PM CP"
tibcop tplatform:list-capability-instances --dataplane-name="$DP_NAME" --profile "$profile"


# Delete a capability instance from a dataplane
#USAGE
#  $ tibcop tplatform:delete-capability-instance -n BWCE|TIBCOHUB|FLOGO|EMS|PULSAR [--no-warnings] [--config <value>] [--profile <value> | --cpurl <value> | --token <value>] [-i <value> | -n <value>] [-d]
#
#FLAGS
#  -d, --debug
#  -i, --dataplane-id=<value>    Dataplane id
#  -n, --dataplane-name=<value>  Dataplane name
#  -n, --id=<option>             (required) [default: TIBCOHUB] Capability id
#                                <options: BWCE|TIBCOHUB|FLOGO|EMS|PULSAR>
#      --config=<value>          Path to the local config file
#      --cpurl=<value>           Control plane url
#      --no-warnings             Disable warnings from command output
#      --profile=<value>         Select a profile
#      --token=<value>           OAuth token to interact with the TIBCO Platform
#
#DESCRIPTION

DATAPLANE_ID=$(tibcop tplatform:list-dataplanes --json --profile "$profile" | jq --arg NAME "$DP_NAME" '.[] | select(.name == $NAME) | .id' | sed 's/"//g')
echo "Dataplane ID: $DATAPLANE_ID"

CAPABILITY_ID=$(tibcop tplatform:list-capability-instances --dataplane-id="$DATAPLANE_ID" --json --profile "$profile" | jq --arg NAME "$DEVHUB_NAME" '.[] | select(.name == $NAME) | .id' | sed 's/"//g')
echo "Capability ID: $CAPABILITY_ID"

#

#  Delete a capability instance from a dataplane
# tibcop tplatform:delete-capability-instance --id "$CAPABILITY_ID" --dataplane-name="$DP_NAME" --debug --profile "$profile"
echo "Runnning command:|tibcop tplatform:delete-capability-instance --id TIBCOHUB --dataplane-name=\"$DP_NAME\" --debug --profile \"$profile\"|"
tibcop tplatform:delete-capability-instance --id TIBCOHUB --dataplane-name="$DP_NAME" --debug --profile "$profile"

echo "Capability instances in the dataplane (After removing Developer Hub):"
tibcop tplatform:list-capability-instances --dataplane-name="$DP_NAME" --profile "$profile"
