#!/bin/bash
set -e
source 0-common-script-functions.sh
start_e2e=$(date +%s)

profile="${1:-initialProfile}"
# use for standalone to remove a specific version
version=v$(date +%s)

# Data Plane NAME
DP_NAME="${2:-Dataplane_$version}"

echo "----------------- Un-Registering a Dataplane ----------------------------";
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

#USAGE
#  $ tibcop tplatform:unregister-dataplane [--json] [--no-warnings] [--config <value>] [--profile <value> | --cpurl <value> | --token <value>] [-n <value>] [-i <value>] [-o] [-d] [-f]
#
#FLAGS
#  -d, --debug
#  -f, --force             This will force the deletion of a dataplane in the control plane, USE WITH CAUTION
#  -i, --id=<value>        Dataplane id
#  -n, --name=<value>      Dataplane name
#  -o, --onlyPrintScripts  Only print the scripts
#      --config=<value>    Path to the local config file
#      --cpurl=<value>     Control plane url
#      --no-warnings       Disable warnings from command output
#      --profile=<value>   Select a profile
#      --token=<value>     OAuth token to interact with the TIBCO Platform

# tibcop tplatform:unregister-dataplane --name="Dataplane_CLI_v1749651291" --profile "PM CP"
tibcop tplatform:unregister-dataplane --name="$DP_NAME" --profile "$profile" --onlyPrintScripts > unregister-dp.sh
# Dataplane_CLI_v1749651291

chmod +x unregister-dp.sh

echo "Running helm commands..."
source unregister-dp.sh

echo "Dataplanes after removal:"
tibcop tplatform:list-dataplanes --profile "$profile"

# Timing
end_e2e=$(date +%s)
runtime_e2e=$((end_e2e-start_e2e))

# Calculate minutes
echo "-------------------------------------------------------------------------";
echo "-- It took $(convertsecs $runtime_e2e) to unregister the Dataplane..."
echo "-------------------------------------------------------------------------";
echo "-- Profile: $profile"
echo "-------------------------------------------------------------------------"
echo "----        Dataplane Name: $DP_NAME"
echo "-------------------------------------------------------------------------"
