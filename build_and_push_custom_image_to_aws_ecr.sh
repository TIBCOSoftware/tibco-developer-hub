echo "Building and push The TIBCO DeveloperHub custom docker image to AWS ECR"

# ---- Configuration ---
# Local AWS profile to use
AWS_PROFILE="<AWS_PROFILE>"
# AWS Region of ECR
AWS_REGION="<AWS_REGION>"
# AWS Account number
AWS_ACCOUNT_NR="<AWS_ACCOUNT_NUMBER>"
# Name of the container image repository (in ECR)
CONTAINER_NAME="<ECR_CONTAINER_NAME>"


# Do the build & push to ECR
cd ./platform-scripts
./aws_build_and_push_devhub_container_to_ecr.sh "$AWS_PROFILE" "$AWS_REGION" "$AWS_ACCOUNT_NR" "$CONTAINER_NAME"
