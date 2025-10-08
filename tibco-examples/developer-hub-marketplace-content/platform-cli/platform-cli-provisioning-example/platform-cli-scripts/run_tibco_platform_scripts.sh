#!/bin/bash
set -e
echo "--------------------- End To End Platform Script -----------------------";
start_e2e=$(date +%s)
source 0-common-script-functions.sh

# Run a login
# tibcop login --profile "<Your_CLI_Profile>"

# Script Variables
# Use Case (cant use _ in the name) (Name can be maximum 17 characters long)
use_case="Test"
version=v$(date +%s)
# Use a specific version, for example to uninstall an existing version
# version="v1750842261"
# Platform CLI Profile to use
platform_cli_profile="<Your_CLI_Profile>"

# Base FQDN for all services, e.g. mydomain.com
fqdn_base="<Your_EndPoint_URL>"

# Script configuration

# do_install_dataplane=true
do_install_dataplane=false

# do_install_dev_hub=true
do_install_dev_hub=false

# do_install_flogo=true
do_install_flogo=false

# do_install_bwce=true
do_install_bwce=false


# do_remove_dev_hub=true
do_remove_dev_hub=false

# do_remove_flogo=true
do_remove_flogo=false

# do_remove_bwce=true
do_remove_bwce=false

# do_remove_dataplane=true
do_remove_dataplane=false



echo "-------------------------------------------------------------------------";
echo "----- CONFIGURATION: Profile: $platform_cli_profile";
echo "-------------------------------------------------------------------------";
echo "---     do_install_dataplane: $do_install_dataplane";
echo "---       do_install_dev_hub: $do_install_dev_hub";
echo "---         do_install_flogo: $do_install_flogo";
echo "---          do_install_bwce: $do_install_bwce";
echo "---        do_remove_dev_hub: $do_remove_dev_hub";
echo "---          do_remove_flogo: $do_remove_flogo";
echo "---           do_remove_bwce: $do_remove_bwce";
echo "---      do_remove_dataplane: $do_remove_dataplane";
echo "-------------------------------------------------------------------------";
use_case_lower=$(echo "$use_case" | awk '{print tolower($0)}')

#################################
# Dataplane Configuration
#################################
# Dataplane Name (to create or remove)
dataplane_name="${use_case}_${version}"
# dataplane_name="TEST"
# Dataplane Description
dataplane_description="$use_case $version"
# Dataplane Namespace
dataplane_ns="$use_case_lower-ns-$version"
# Dataplane Service Account
dataplane_sa="$use_case_lower-sa-$version"

#################################
# Developer Hub Configuration
#################################
# Developer Hub FQDN
dev_hub_fqdn="$version-$use_case_lower-dev-hub.$fqdn_base"
# Developer Hub Name
dev_hub_name="DevHub_$use_case-$version"
# Developer Hub resource instance name for storage
dev_hub_ri_name_storage="StorageResourceDevHub_$version"
# Developer Hub resource instance name for ingress
dev_hub_ri_name_ingress="IngressResourceDevHub_$version"
# Developer Hub Storage Class Name
dev_hub_storage_class_name="gp2"
# Developer Hub Ingress Class Name
dev_hub_ingress_class_name="nginx"
# Developer Hub Ingress Controller
dev_hub_ingress_controller="nginx"

#################################
# Flogo Configuration
#################################
# Flogo resource instance name for storage
flogo_ri_name_storage="StorageResourceIntegration_$version"
# Flogo resource instance name for ingress
flogo_ri_name_ingress="IngressResourceFlogo_$version"
# Flogo Storage Class Name
flogo_storage_class_name="efs-sc"
# Flogo Ingress Class Name
flogo_ingress_class_name="nginx"
# Flogo Ingress Controller
flogo_ingress_controller="nginx"
# Flogo FQDN
flogo_fqdn="$version-$use_case_lower-flogo.$fqdn_base"
# Flogo Path Prefix
flogo_path_prefix="/tibco/flogo/$version"

#################################
# BWCE Configuration
#################################
# bwce resource instance name for storage
# Flogo and BWCE share the same storage resource, so we use the same name
bwce_ri_name_storage="$flogo_ri_name_storage"
# bwce_ri_name_storage="StorageResourceBWCE_$version"
# bwce resource instance name for ingress
bwce_ri_name_ingress="IngressResourceBWCE_$version"
# bwce Storage Class Name
bwce_storage_class_name="efs-sc"
# bwce Ingress Class Name
bwce_ingress_class_name="nginx"
# bwce Ingress Controller
bwce_ingress_controller="nginx"
# bwce FQDN
bwce_fqdn="$version-$use_case_lower-bwce.$fqdn_base"
# bwce Path Prefix
bwce_path_prefix="/tibco/bwce/$version"





if [ "$do_install_dataplane" = true ]; then
  echo "Installing Dataplane..."
  ./1-register-dataplane.sh "$platform_cli_profile" "$dataplane_name" "$dataplane_description" "$dataplane_ns" "$dataplane_sa"
fi

if [ "$do_install_dev_hub" = true ]; then
  echo "Installing TIBCO Developer Hub..."
  ./2-install-dev-hub.sh "$platform_cli_profile" "$dataplane_name" "$dataplane_ns" "$dev_hub_name" "$dev_hub_fqdn" "$dev_hub_ri_name_storage" "$dev_hub_ri_name_ingress" "$dev_hub_storage_class_name" "$dev_hub_ingress_class_name" "$dev_hub_ingress_controller"
fi

if [ "$do_install_flogo" = true ]; then
  echo "Installing Flogo..."
  ./3-install-flogo.sh "$platform_cli_profile" "$dataplane_name" "$flogo_path_prefix" "$flogo_fqdn" "$flogo_ri_name_storage" "$flogo_ri_name_ingress" "$flogo_storage_class_name" "$flogo_ingress_class_name" "$flogo_ingress_controller"
fi

if [ "$do_install_bwce" = true ]; then
  echo "Installing BWCE..."
  ./4-install-bwce.sh "$platform_cli_profile" "$dataplane_name" "$bwce_path_prefix" "$bwce_fqdn" "$bwce_ri_name_storage" "$bwce_ri_name_ingress" "$bwce_storage_class_name" "$bwce_ingress_class_name" "$bwce_ingress_controller"
fi



if [ "$do_remove_dev_hub" = true ]; then
  echo "Removing TIBCO Developer Hub..."
  ./6-remove-dev-hub-from-dataplane.sh "$platform_cli_profile" "$dataplane_name" "$dev_dev_hub_name"
fi

if [ "$do_remove_flogo" = true ]; then
  echo "Removing Flogo..."
  ./7-remove-flogo-from-dataplane.sh "$platform_cli_profile" "$dataplane_name"
fi

if [ "$do_remove_bwce" = true ]; then
  echo "Removing BWCE..."
  ./8-remove-bwce-from-dataplane.sh "$platform_cli_profile" "$dataplane_name"
fi

if [ "$do_remove_dataplane" = true ]; then
  echo "Removing Dataplane..."
  ./9-unregister-dataplane.sh "$platform_cli_profile" "$dataplane_name"
fi



# Timing
end_e2e=$(date +%s)
runtime_e2e=$((end_e2e-start_e2e))


# Calculate minutes
echo "-------------------------------------------------------------------------";
echo "--------------   END TO END PLATFORM SCRIPT SUCCESSFUL !!----------------";
echo "-------------------------------------------------------------------------";
echo "----- CONFIGURATION: Profile: $platform_cli_profile";
echo "-------------------------------------------------------------------------";
echo "---     do_install_dataplane: $do_install_dataplane";
echo "---       do_install_dev_hub: $do_install_dev_hub";
echo "---         do_install_flogo: $do_install_flogo";
echo "---          do_install_bwce: $do_install_bwce";
echo "---        do_remove_dev_hub: $do_remove_dev_hub";
echo "---          do_remove_flogo: $do_remove_flogo";
echo "---           do_remove_bwce: $do_remove_bwce";
echo "---      do_remove_dataplane: $do_remove_dataplane";
echo "-------------------------------------------------------------------------";


echo "-------------------------------------------------------------------------";
echo "-- It took $(convertsecs $runtime_e2e) to run the platform cli..."
echo "-------------------------------------------------------------------------";

