echo "Building and deploying The TIBCO Hub to a Dataplane"

# ---- Configuration ---
# Kubernetes config file to connect to the dataplane
KUBE_CONFIG_FILE="$PWD/KUBECONFIG.yaml"
# Local AWS profile to use
AWS_PROFILE="<AWS_PROFILE>"
# AWS Region of the dataplane
AWS_REGION="<AWS_REGION>"
# AWS Account number
AWS_ACCOUNT_NR="<AWS_ACCOUNT_NUMBER>"
# Name of the container image repository (in ECR)
CONTAINER_NAME="<ECR_CONTAINER_NAME>"
# Namespace in which the TIBCO Developer Hub runs
TIBCO_HUB_NAMESPACE="<TIBCO_HUB_KUBERNETES_NAMESPACE>"
# ID of the Dataplane
DATAPLANE_ID="<DATAPLANE_ID>"


# Do the deployment
cd ./deploy-platform
./aws_build-and-deploy-dataplane.sh "$KUBE_CONFIG_FILE" "$AWS_PROFILE" "$AWS_REGION" "$AWS_ACCOUNT_NR" "$CONTAINER_NAME" "$TIBCO_HUB_NAMESPACE" "$DATAPLANE_ID"
