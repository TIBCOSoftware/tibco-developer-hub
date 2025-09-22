#!/bin/bash
set -e
source 0-common-script-functions.sh

profile="${1:-initialProfile}"
version=v$(date +%s)
# Data Plane NAME
DP_NAME="${2:-Dataplane_$version}"
# Namespace Name
NAMESPACE="${3:-dataplane-ns-$version}"
# Developer Hub Name
DEVHUB_NAME="${4:-DEVHUB_$version}"
# FQDN for the Developer Hub
fqdn="${5:-$version.dev-hub.developer-experience.dataplanes.pro}"

DEV_HUB_RESOURCE_INSTANCE_NAME_STORAGE="${6:-StorageResourceDevHub_$version}"
DEV_HUB_RESOURCE_INSTANCE_NAME_INGRESS="${7:-IngressResourceDevHub_$version}"

# Storage Class for the Resource Instance
DEV_HUB_RESOURCE_INSTANCE_STORAGE_CLASS="${8:-gp2}"
# Ingress Class for the Resource Instance
DEV_HUB_RESOURCE_INSTANCE_INGRESS_CLASS="${9:-nginx}"
# Ingress Controller for the Resource Instance
DEV_HUB_RESOURCE_INSTANCE_INGRESS_CONTROLLER="${10:-nginx}"


echo "---------- Installing a The TIBCO Developer Hub  --------------------";
echo "-- Profile: $profile"
echo "---------------------------------------------------------------------";
tibcop refresh-token --profile "$profile"
echo "---- Settings: "
echo "-------------------------------------------------------------------------"
echo "----                     Dataplane Name: $DP_NAME"
echo "----                          Namespace: $NAMESPACE"
echo "----                      Developer Hub: $DEVHUB_NAME"
echo "----                 Developer Hub FQDN: $fqdn"
echo "---- Resource Instance Name for Storage: $DEV_HUB_RESOURCE_INSTANCE_NAME_STORAGE"
echo "----                      Storage Class: $DEV_HUB_RESOURCE_INSTANCE_STORAGE_CLASS"
echo "---- Resource Instance Name for Ingress: $DEV_HUB_RESOURCE_INSTANCE_NAME_INGRESS"
echo "----                      Ingress Class: $DEV_HUB_RESOURCE_INSTANCE_INGRESS_CLASS"
echo "----                 Ingress Controller: $DEV_HUB_RESOURCE_INSTANCE_INGRESS_CONTROLLER"

echo "-------------------------------------------------------------------------"

# Step 1] Validation of the environment
# List Dataplanes
echo "Current dataplanes:"
tibcop tplatform:list-dataplanes --profile "$profile"

# Validate that dataplane name exist to install the TIBCO Hub
echo "Checking if dataplane exists..."
tibcop tplatform:validate --type=dataplane -n "$DP_NAME" -s "exists" --profile "$profile"

# Step 2] Setup prerequisites
# Create Resource Instances
echo "Available Resources:"
# tibcop tplatform:list-resources --profile "PM CP"
tibcop tplatform:list-resources --profile "$profile"

echo "Creating resource for storage..."
# tibcop tplatform:create-storage-resource-instance --dataplane-name dpname --name ResourceName --storage-class-namee ResourceClassName --description Description
tibcop tplatform:create-storage-resource-instance --dataplane-name "$DP_NAME" --name "$DEV_HUB_RESOURCE_INSTANCE_NAME_STORAGE" --storage-class-name "$DEV_HUB_RESOURCE_INSTANCE_STORAGE_CLASS" --description Storage_For_DevHub --profile "$profile"
echo "Creating resource for ingress..."
# tibcop tplatform:create-ingress-resource-instance --dataplane-name dpname --name ResourceName --class-name ResourceClassName --description Description
tibcop tplatform:create-ingress-resource-instance --dataplane-name "$DP_NAME" --name "$DEV_HUB_RESOURCE_INSTANCE_NAME_INGRESS" --ingress-class-name "$DEV_HUB_RESOURCE_INSTANCE_INGRESS_CLASS" --ingress-controller "$DEV_HUB_RESOURCE_INSTANCE_INGRESS_CONTROLLER" --fqdn $fqdn --profile "$profile"
echo "New resources:"
tibcop tplatform:list-resource-instances --dataplane-name "$DP_NAME" --profile "$profile"

# Get resource instance ID's
STORAGE_RESOURCE_ID=$(tibcop tplatform:list-resource-instances --dataplane-name "$DP_NAME" --json --profile "$profile" | jq --arg NAME "$DEV_HUB_RESOURCE_INSTANCE_NAME_STORAGE" '.[] | select(.name == $NAME) | .id' | sed 's/"//g')
INGRESS_RESOURCE_ID=$(tibcop tplatform:list-resource-instances --dataplane-name "$DP_NAME" --json --profile "$profile" | jq --arg NAME "$DEV_HUB_RESOURCE_INSTANCE_NAME_INGRESS" '.[] | select(.name == $NAME) | .id' | sed 's/"//g')
echo "Storage Resource ID: $STORAGE_RESOURCE_ID"
echo "Ingress Resource ID: $INGRESS_RESOURCE_ID"

echo "Adding TIBCO Hub Secret..."
kubectl apply -f tibco-hub-secret.yaml -n "$NAMESPACE"

# Step 3] Install TIBCO Hub
# Install TIBCO Hub

#  $ tibcop tplatform:provision-capability
#  --dataplane-name dpname
#  --capability TIBCOHUB
#  --storage-resource-instance-id StorageResourceId
#  --ingress-resource-instance-id IngressResourceId
#  --database-resource-instance-id DatabaseResourceId
#  --developer-hub-name DeveloperHubName
tibcop tplatform:provision-capability --dataplane-name "$DP_NAME" --capability TIBCOHUB --storage-resource-instance-id  "$STORAGE_RESOURCE_ID" --ingress-resource-instance-id "$INGRESS_RESOURCE_ID" --developer-hub-name "$DEVHUB_NAME" --kubernetes-secret-object "tibco-hub-secrets" --profile "$profile" --debug

# Step 4] Wait for the TIBCO Hub to be up
echo "Linked Capabilities:"
tibcop tplatform:list-resource-instances --dataplane-name "$DP_NAME" --profile "$profile"
tibcop tplatform:list-resource-instances --dataplane-name "$DP_NAME" --profile "$profile" --json

DATAPLANE_ID=$(tibcop tplatform:list-dataplanes --json --profile "$profile" | jq --arg NAME "$DP_NAME" '.[] | select(.name == $NAME) | .id' | sed 's/"//g')
echo "Dataplane ID: $DATAPLANE_ID"

echo "Capability Instances:"
tibcop tplatform:list-capability-instances --dataplane-id="$DATAPLANE_ID" --profile "$profile"

CAPABILITY_ID=$(tibcop tplatform:list-capability-instances --dataplane-id="$DATAPLANE_ID" --json --profile "$profile" | jq --arg NAME "$DEVHUB_NAME" '.[] | select(.name == $NAME) | .id' | sed 's/"//g')
echo "Capability ID: $CAPABILITY_ID"

sleep 30
echo "Waiting for the developer hub to be up..."
counter=0
max_retry=120
until tibcop tplatform:validate --type capability --dataplane-id="$DATAPLANE_ID" --id "$CAPABILITY_ID" --state "green" --profile "$profile" --debug
do
   sleep 3
   [[ counter -eq $max_retry ]] && echo "Failed!" && exit 1
   echo "Trying to see if developer hub is up. Try #$counter"
   ((counter++))
done


# Timing
end_e2e=$(date +%s)
runtime_e2e=$((end_e2e-start_e2e))

# Calculate minutes
echo "-------------------------------------------------------------------------";
echo "-- It took $(convertsecs $runtime_e2e) to create the TIBCO Hub..."
echo "-------------------------------------------------------------------------";
echo "-------------------------------------------------------------------------"
echo "----        Dataplane Name: $DP_NAME"
echo "----             Namespace: $NAMESPACE"
echo "-------------------------------------------------------------------------"
echo "-- You can find the Developer Hub here: https://$fqdn/tibco/hub/"

