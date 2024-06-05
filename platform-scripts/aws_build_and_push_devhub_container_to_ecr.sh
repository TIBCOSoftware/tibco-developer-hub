#!/bin/bash
set -e
echo "----------------------- Build & push TIBCO Developer Hub container To ECR ---------------------------------";
start_deploy=$(date +%s)
version=v$(date +%s)
# version=v1679073350

# Get Other variables
aws_profile=${1}
aws_region=${2}
aws_account_nr=${3}
container_name=${4}

echo "            aws_account_nr: |$aws_account_nr|";
echo "               aws_profile: |$aws_profile|";
echo "                aws_region: |$aws_region|";
echo "container image repository: |$container_name|"
echo "                   version: |$version|"

# Step 1] Build the code
cd ./../

#Step 2] Login for AWS CLI:
aws ecr get-login-password --region "$aws_region" --profile "$aws_profile" | docker login --username AWS --password-stdin "$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com"
#Step 3] Build container
echo "Building container: |$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:$version|"
docker build -f ./Dockerfile -t "$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:$version" .
cd ./platform-scripts
#Step 4] Tag container
docker tag "$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:$version" "$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:latest"
#Step 5] Push container
docker push "$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:$version"
docker push "$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:latest"

# Command to SSH into the pod
# kubectl exec -n <namespace> --stdin --tty <pod-name> -- /bin/bash

# Command to tail the logs of the pod
# kubectl logs <pod-name> -n <namespace>


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
echo "            ------  DOCKER CONTAINER IMAGE UPLOADED !! ------";
echo "-------------------------------------------------------------------------";
echo "-- It took $(convertsecs $runtime_deploy) for the building of the TIBCO Developer Hub custom docker image and pushing it to ECR..."
echo "-------------------------------------------------------------------------";
echo "Now install the custom version of the TIBCO Developer Hub in the control plane, using the following container URL..."
echo "Container Image URL: |$aws_account_nr.dkr.ecr.$aws_region.amazonaws.com/$container_name:$version|"
