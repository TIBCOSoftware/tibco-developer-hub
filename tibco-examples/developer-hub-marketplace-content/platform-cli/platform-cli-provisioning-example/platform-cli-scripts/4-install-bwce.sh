#!/bin/bash
set -e
source 0-common-script-functions.sh

profile="${1:-initialProfile}"
version=v$(date +%s)

# Data Plane NAME
DP_NAME="${2:-Dataplane_$version}"
# Path Prefix for bwce
PATH_PREFIX="${3:-/bwce/$version}"
# FQDN for the BWCE Capability
fqdn="${4:-$version.bwce.developer-experience.dataplanes.pro}"

RESOURCE_INSTANCE_NAME_STORAGE="${5:-StorageResourceBWCE_$version}"
RESOURCE_INSTANCE_NAME_INGRESS="${6:-IngressResourceBWCE_$version}"

# Storage Class for the Resource Instance
RESOURCE_INSTANCE_STORAGE_CLASS="${7:-gp2}"
# Ingress Class for the Resource Instance
RESOURCE_INSTANCE_INGRESS_CLASS="${8:-nginx}"
# Ingress Controller for the Resource Instance
RESOURCE_INSTANCE_INGRESS_CONTROLLER="${9:-nginx}"


echo "---------- Installing a The BWCE capability  -----------------------";
echo "-- Profile: $profile"
echo "---------------------------------------------------------------------";
tibcop refresh-token --profile "$profile"
echo "---- Settings: "
echo "-------------------------------------------------------------------------"
echo "----                     Dataplane Name: $DP_NAME"
echo "----                        Path Prefix: $PATH_PREFIX"
echo "----                          BWCE FQDN: $fqdn"
echo "---- Resource Instance Name for Storage: $RESOURCE_INSTANCE_NAME_STORAGE"
echo "----                      Storage Class: $RESOURCE_INSTANCE_STORAGE_CLASS"
echo "---- Resource Instance Name for Ingress: $RESOURCE_INSTANCE_NAME_INGRESS"
echo "----                      Ingress Class: $RESOURCE_INSTANCE_INGRESS_CLASS"
echo "----                 Ingress Controller: $RESOURCE_INSTANCE_INGRESS_CONTROLLER"

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
tibcop tplatform:list-resources --profile "$profile"
echo "Current resources instance:"
tibcop tplatform:list-resource-instances --dataplane-name "$DP_NAME" --profile "$profile"

DATAPLANE_ID=$(tibcop tplatform:list-dataplanes --json --profile "$profile" | jq --arg NAME "$DP_NAME" '.[] | select(.name == $NAME) | .id' | sed 's/"//g')
echo "Dataplane ID: $DATAPLANE_ID"

# Flogo & BWCE Share the storage shared resource, so we need to check if they exist already, if they do we need to use them
echo "Checking on the for existing storage instance name $RESOURCE_INSTANCE_NAME_STORAGE"
STORAGE_RESOURCE_ID=$(tibcop tplatform:list-resource-instances --dataplane-name "$DP_NAME" --profile "$profile" --json | jq --arg NAME "$RESOURCE_INSTANCE_NAME_STORAGE" '.[] | select(.name == $NAME) | .id' | sed 's/"//g')
echo "STORAGE_RESOURCE_ID: $STORAGE_RESOURCE_ID"

if [ -z ${STORAGE_RESOURCE_ID+x} ] || [ "$STORAGE_RESOURCE_ID" = 'null' ] || [ "$STORAGE_RESOURCE_ID" = '' ]; then
    echo "STORAGE_RESOURCE_ID is unset"
    echo "Creating resource for storage..."
    # tibcop tplatform:create-storage-resource-instance --dataplane-name dpname --name ResourceName --storage-class-namee ResourceClassName --description Description
    tibcop tplatform:create-storage-resource-instance --dataplane-name "$DP_NAME" --name "$RESOURCE_INSTANCE_NAME_STORAGE" --storage-class-name $RESOURCE_INSTANCE_STORAGE_CLASS --description Storage_For_Integration --profile "$profile"
    STORAGE_RESOURCE_ID=$(tibcop tplatform:list-resource-instances --dataplane-name "$DP_NAME" --json --profile "$profile" | jq --arg NAME "$RESOURCE_INSTANCE_NAME_STORAGE" '.[] | select(.name == $NAME) | .id' | sed 's/"//g')
    echo "Storage Resource ID: $STORAGE_RESOURCE_ID"

  else
    echo "STORAGE_RESOURCE_ID is set to '$STORAGE_RESOURCE_ID'"
fi

echo "Creating resource for ingress..."
# tibcop tplatform:create-ingress-resource-instance --dataplane-name dpname --name ResourceName --class-name ResourceClassName --description Description
tibcop tplatform:create-ingress-resource-instance --dataplane-name "$DP_NAME" --name "$RESOURCE_INSTANCE_NAME_INGRESS" --ingress-class-name $RESOURCE_INSTANCE_INGRESS_CLASS --ingress-controller $RESOURCE_INSTANCE_INGRESS_CONTROLLER --fqdn $fqdn --profile "$profile"
echo "New resources:"
tibcop tplatform:list-resource-instances --dataplane-name "$DP_NAME" --profile "$profile"

# Get resource instance ID's
INGRESS_RESOURCE_ID=$(tibcop tplatform:list-resource-instances --dataplane-name "$DP_NAME" --json --profile "$profile" | jq --arg NAME "$RESOURCE_INSTANCE_NAME_INGRESS" '.[] | select(.name == $NAME) | .id' | sed 's/"//g')
echo "Storage Resource ID: $STORAGE_RESOURCE_ID"
echo "Ingress Resource ID: $INGRESS_RESOURCE_ID"

# Step 3] Install BWCE
#  $ tibcop tplatform:provision-capability
#  --dataplane-name dpname
#  --capability TIBCOHUB
#  --storage-resource-instance-id StorageResourceId
#  --ingress-resource-instance-id IngressResourceId
#  --database-resource-instance-id DatabaseResourceId
echo tibcop tplatform:provision-capability --dataplane-name "$DP_NAME" --capability BWCE  --storage-resource-instance-id "$STORAGE_RESOURCE_ID" --ingress-resource-instance-id "$INGRESS_RESOURCE_ID" --path-prefix "$PATH_PREFIX" --fluentbit-sidecar-enabled --profile "$profile" --debug
tibcop tplatform:provision-capability --dataplane-name "$DP_NAME" --capability BWCE  --storage-resource-instance-id "$STORAGE_RESOURCE_ID" --ingress-resource-instance-id "$INGRESS_RESOURCE_ID" --path-prefix "$PATH_PREFIX" --fluentbit-sidecar-enabled --profile "$profile" --debug


# Step 4] Wait for the BWCE Capability to be up
echo "Linked Capabilities:"
tibcop tplatform:list-resource-instances --dataplane-name "$DP_NAME" --profile "$profile"
tibcop tplatform:list-resource-instances --dataplane-name "$DP_NAME" --profile "$profile" --json

DATAPLANE_ID=$(tibcop tplatform:list-dataplanes --json --profile "$profile" | jq --arg NAME "$DP_NAME" '.[] | select(.name == $NAME) | .id' | sed 's/"//g')
echo "Dataplane ID: $DATAPLANE_ID"

echo "Capability Instances:"
tibcop tplatform:list-capability-instances --dataplane-id="$DATAPLANE_ID" --profile "$profile"
# The name is bwce here
CAPABILITY_ID=$(tibcop tplatform:list-capability-instances --dataplane-id="$DATAPLANE_ID" --json --profile "$profile" | jq --arg NAME "BWCE" '.[] | select(.capability == $NAME) | .id' | sed 's/"//g')
echo "Capability ID: $CAPABILITY_ID"

echo "Waiting for the bwce capability to be up..."
counter=0
max_retry=120
until tibcop tplatform:validate --type capability --dataplane-id="$DATAPLANE_ID" --id "$CAPABILITY_ID" --state "green" --profile "$profile"
do
   sleep 3
   [[ counter -eq $max_retry ]] && echo "Failed!" && exit 1
   echo "Trying to see if the BWCE Capability is up. Try #$counter"
   ((counter++))
done


# Timing
end_e2e=$(date +%s)
runtime_e2e=$((end_e2e-start_e2e))

# Calculate minutes
echo "-------------------------------------------------------------------------";
echo "-- It took $(convertsecs $runtime_e2e) to create the BWCE Capability..."
echo "-------------------------------------------------------------------------";
echo "-------------------------------------------------------------------------"
echo "----        Dataplane Name: $DP_NAME"
echo "----           Path Prefix: $PATH_PREFIX"
echo "-------------------------------------------------------------------------"
echo "-- You can find the BWCE API's here: https://$fqdn$PATH_PREFIX/public/dp/docs "

