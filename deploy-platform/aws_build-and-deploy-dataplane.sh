#!/bin/bash
set -e
echo "----------------------- Build & Deploy TIBCO Hub To Dataplane ---------------------------------";
start_deploy=$(date +%s)
version=v$(date +%s)
# version=v1679073350

kube_config_file=${1}
if test -z "$kube_config_file"
then
      echo "Error: No KUBE Config file found, please specify a kubernetes config file"
      exit 1
fi
export KUBECONFIG="$kube_config_file"

kubectl get ns

# Get Other variables
aws_profile=${2}
aws_region=${3}
aws_account_nr=${4}
container_name=${5}
tibco_hub_namespace=${6}
dataplane_id=${7}

echo "            aws_account_nr: |$aws_account_nr|";
echo "               aws_profile: |$aws_profile|";
echo "                aws_region: |$aws_region|";
echo "          kube_config_file: |$kube_config_file|";
echo "container image repository: |$container_name|"
echo "       tibco_hub_namespace: |$tibco_hub_namespace|"
echo "              dataplane ID: |$dataplane_id|"
echo "                   version: |$version|"

# Step 1] Build the code
cd ./../
yarn tsc
yarn build

#Step 2] Login for AWS CLI:
aws ecr get-login-password --region "$aws_region" --profile "$aws_profile" | docker login --username AWS --password-stdin "$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com"
#Step 3] Build container
echo "Building container: |$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:$version|"
docker build -f ./deploy-platform/resources/docker_file_aws_tibco_hub/Dockerfile -t "$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:$version" .
cd ./deploy-platform
#Step 4] Tag container
docker tag "$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:$version" "$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:latest"
#Step 5] Push container
docker push "$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:$version"
docker push "$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:latest"

echo "Now do the manual upgrade..."
echo "Container Image ULR: |$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:$version|"

# Use this part to automate the deployment (please note that control plane would be unaware of this deployment)
# echo "Updating Container Image on Deployment..."
# kubectl set image deployment/<deployment> <container>=<image>
# kubectl set image "deployment/tibco-developer-hub-${dataplane_id}" backstage-backend="$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:$version" -n "$tibco_hub_namespace"

# Command to SSH into the pod
# kubectl exec -n <namespace> --stdin --tty <pod-name> -- /bin/bash
# kubectl exec -n tibcopilot-ns --stdin --tty tibco-developer-hub-cn1tgq58el1deih7pkvg-f5c4b7594-7rpsj -- /bin/bash

# Command to tail the logs of the pod
# kubectl logs <pod-name> -n <namespace>
# kubectl logs tibco-developer-hub-cn1tgq58el1deih7pkvg-667b8d6469-rdc4k  -n tibcopilot-ns

kubectl get pods -n "$tibco_hub_namespace"

# Timing
end_deploy=$(date +%s)
runtime_deploy=$((end_deploy-start_deploy))

convertsecs() {
 ((h=${1}/3600))
 ((m=(${1}%3600)/60))
 ((s=${1}%60))
 printf "%02d Hour(s), %02d Minute(s) and %02d Second(s)\n" $h $m $s
}
# Calculate minutes
echo "-------------------------------------------------------------------------";
echo "     --------------------- DEPLOYMENT DONE !!----------------------";
echo "-------------------------------------------------------------------------";
echo "-- It took $(convertsecs $runtime_deploy) for the deployment of the TIBCO Hub into the Dataplane..."
echo "-------------------------------------------------------------------------";
echo "To see the deployment complete run |kubectl get pods -n $tibco_hub_namespace -w|"
