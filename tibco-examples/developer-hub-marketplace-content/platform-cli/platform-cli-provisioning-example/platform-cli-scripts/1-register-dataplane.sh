#!/bin/bash
set -e
source 0-common-script-functions.sh

profile="${1:-initialProfile}"
# profile="PM CP"

echo "-------------------- Installing a Dataplane -------------------------";
echo "-- Profile: $profile"
echo "---------------------------------------------------------------------";

start_e2e=$(date +%s)
version=v$(date +%s)

# Data Plane NAME
DP_NAME="${2:-Dataplane_$version}"

# Dataplane Description
DESCRIPTION="${3:-Dataplane_CLI_Generated_$version}"
# Namespace Name
NAMESPACE="${4:-dataplane-ns-$version}"
# Service Account Name
SERVICE_ACCOUNT_NAME="${5:-dataplane-sa-$version}"

echo "-------------------------------------------------------------------------"
echo "----        Dataplane Name: $DP_NAME"
echo "---- Dataplane Description: $DESCRIPTION"
echo "----             Namespace: $NAMESPACE"
echo "----  Service Account Name: $SERVICE_ACCOUNT_NAME"
echo "-------------------------------------------------------------------------"
echo "Refreshing token for profile: $profile"
tibcop refresh-token --profile "$profile"

echo "Current dataplanes:"
# tibcop tplatform:list-dataplanes --json --profile "PM CP"
# tibcop tplatform:list-dataplanes --profile "$profile" --json | jq -r '["ID","NAME"], ["--","------"], (.[] | [.id, .name]) | @tsv'
tibcop tplatform:list-dataplanes --profile "$profile"

#USAGE
# $ tibcop tplatform:register-k8s-dataplane -n <value> -s <value> -a <value> [--json] [--no-warnings] [--config <value>] [--profile <value> | --cpurl <value> | --token <value>] [-d <value>]
#    [--helm-repo-resource-instance-id <value>] [--helm-repo-resource <value>] [--cluster-scoped-permissions] [--fluent-bit] [--proxy-config <value>] [--container-registry <value>] [-o] [-d]
tibcop tplatform:register-k8s-dataplane --onlyPrintScripts --name="$DP_NAME"  --description="$DESCRIPTION" --namespace="$NAMESPACE"  --service-account-name="$SERVICE_ACCOUNT_NAME" --profile "$profile" > register-dp.sh
echo "New dataplanes:"

# Custom table:
#tibcop tplatform:list-dataplanes --profile "$profile" --json | jq -r '["ID","NAME"], ["--","------"], (.[] | [.dp_id, .name]) | @tsv'
tibcop tplatform:list-dataplanes --profile "$profile"

# Make the script executable
chmod +x register-dp.sh

echo "Running helm commands..."
source register-dp.sh

# Try till tunnel is ok and status is green
echo "Checking if dataplane exists..."
tibcop tplatform:validate --type=dataplane -n "$DP_NAME" -s "exists" --profile "$profile"

max_retry=120

echo "Waiting for the tunnel to be up..."
counter=0
until tibcop tplatform:validate --type=dataplane -n "$DP_NAME" -s "tunnel_ok" --profile "$profile"
do
   sleep 3
   [[ counter -eq $max_retry ]] && echo "Failed!" && exit 1
   echo "Trying to check tunnel again. Try #$counter"
   ((counter++))
done

echo "Waiting the monitoring status to be green..."
counter=0
until tibcop tplatform:validate --type=dataplane -n "$DP_NAME" -s "green" --profile "$profile"
do
   sleep 3
   [[ counter -eq $max_retry ]] && echo "Failed!" && exit 1
   echo "Trying checking status again. Try #$counter"
   ((counter++))
done

# Timing
end_e2e=$(date +%s)
runtime_e2e=$((end_e2e-start_e2e))

# Calculate minutes
echo "-------------------------------------------------------------------------";
echo "-- It took $(convertsecs $runtime_e2e) to create the Dataplane..."
echo "-------------------------------------------------------------------------";
echo "-------------------------------------------------------------------------"
echo "----        Dataplane Name: $DP_NAME"
echo "---- Dataplane Description: $DESCRIPTION"
echo "----             Namespace: $NAMESPACE"
echo "----  Service Account Name: $SERVICE_ACCOUNT_NAME"
echo "-------------------------------------------------------------------------"
