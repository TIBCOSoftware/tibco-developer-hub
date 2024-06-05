echo "Updating the secrets object..."
# Config
kube_config_file=${1}

if test -z "$kube_config_file"
then
      echo "Error: No KUBE Config file found, please specify a kubernetes config file"
      exit 1
fi
export KUBECONFIG="$kube_config_file"

# Namespace in which the TIBCO Developer Hub runs
TIBCO_HUB_NAMESPACE="<TIBCO_HUB_KUBERNETES_NAMESPACE>"
# Id of the dataplane (you can get this from the control plane)
DATAPLANE_ID="<DATAPLANE-ID>"

# Secrets file
tibco_hub_secret_file="tibco-hub-secret.yaml"

do_scale="YES"
# do_scale="NO"

# set deployment name
DEPLOYMENT="tibco-hub-$DATAPLANE_ID"
# Display Info
kubectl get nodes
kubectl get ns
# kubectl get pods -n klm-dev-hub
kubectl get pods -n "$TIBCO_HUB_NAMESPACE"
# kubectl get secrets -n klm-dev-hub
kubectl get secrets -n "$TIBCO_HUB_NAMESPACE"
# kubectl get deployments -n klm-dev-hub
kubectl get deployments -n "$TIBCO_HUB_NAMESPACE"

if [ "$do_scale" = "YES" ]; then
  echo "Scaling down the deployment..."
  # Scale down the deployment
  kubectl scale --replicas=0 "deployment.apps/$DEPLOYMENT" -n "$TIBCO_HUB_NAMESPACE"
  # Wait a bit
  sleep 60
fi


# Apply secrets object
kubectl apply -f "$tibco_hub_secret_file" -n "$TIBCO_HUB_NAMESPACE"
# Wait a bit
sleep 5

if [ "$do_scale" = "YES" ]; then
  echo "Scaling up the deployment..."

  # Scale up the deployment
  kubectl scale --replicas=1 "deployment.apps/$DEPLOYMENT" -n "$TIBCO_HUB_NAMESPACE"
fi

kubectl get secrets -n "$TIBCO_HUB_NAMESPACE"

# Tail logs
# kubectl -n <namespace> logs <pod>

# Get Shell
# kubectl -n <namespace> exec --stdin --tty <pod> -- /bin/bash
