echo "Building and push The TIBCO DeveloperHub custom docker image to DockerHub"

# ---- Configuration ---
# Local AWS profile to use
AWS_PROFILE="mleijdek"
# AWS Region of ECR
AWS_REGION="local"
# AWS Account number
AWS_ACCOUNT_NR="mleijdek"
# Name of the container image repository (in ECR)
CONTAINER_NAME="custdevhub"


# Do the build & push to ECR
cd ./platform-scripts
./local_build_and_push_devhub_container_to_docker.sh "$AWS_PROFILE" "$AWS_REGION" "$AWS_ACCOUNT_NR" "$CONTAINER_NAME"