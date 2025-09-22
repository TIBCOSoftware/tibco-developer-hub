# TIBCO Platform CLI to Use
# export PATH=/PlatformCLI/tibcop/bin:$PATH

# Kubeconfig file to use
# export KUBECONFIG=$PWD/cluster.yaml

convertsecs() {
 ((h=${1}/3600))
 ((m=(${1}%3600)/60))
 ((s=${1}%60))
 printf "%02d Hour(s), %02d Minute(s) and %02d Second(s)\n" $h $m $s
}
