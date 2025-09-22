# TIBCO Platform Commandline Interface(CLI) Example

**Documentation**

[https://docs.tibco.com/pub/platform-cp/1.10.0/doc/html/Default.htm#UserGuide/tibco-platform-cli-overview.htm](https://docs.tibco.com/pub/platform-cp/1.10.0/doc/html/Default.htm#UserGuide/tibco-platform-cli-overview.htm)

**GitHub Repository:**

[https://github.com/TIBCOSoftware/tibco-developer-hub/tree/main/tibco-examples/developer-hub-marketplace-content/platform-cli/platform-cli-provisioning-example/platform-cli-scripts](https://github.com/TIBCOSoftware/tibco-developer-hub/tree/main/tibco-examples/developer-hub-marketplace-content/platform-cli/platform-cli-provisioning-example/platform-cli-scripts)

## TIBCO Platform CLI
TIBCO Platform CLI is a command-line tool to interact with TIBCO Control Plane from command-line. You can manage data planes and capabilities from CLI. It allows the execution of commands through a terminal using interactive command-line prompts or a script.

## Benefits of TIBCO Platform CLI
- You can interact with the TIBCO Control Plane and data planes from a terminal.
- You can record the commands in a script. Then you can run repeatable tasks by running a script.
- The CLI for the TIBCO Platform enables you to create platform environments (Data plane, Capabilities, and Apps) automatically in a scripted and repeatable way.
- You can quickly regenerate TIBCO Control Plane environments if they are destroyed.

## Example Description
This example allows you to script out (any) of the following steps:

1. Register a dataplane
2. Install the Developer Hub
3. Install the Flogo Capability
4. Install the BWCE Capability
6. Remove the Developer Hub from a dataplane
7. Remove the Flogo Capability from a dataplane
8. Remove the BWCE Capability from a dataplane
9. Unregister a dataplane

In this way you can quickly setup environments on the TIBCO Platform

## Configuration

To get started open the file **run_tibco_platform_scripts.sh** and configure the following section 


```shell
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
```
Provide a use-case, your base URL and specify your CLI profile, for more information on profiles see: [Using Profiles](https://docs.tibco.com/pub/platform-cp/1.10.0/doc/html/Default.htm#CLI/authentication.htm?TocPath=TIBCO%2520Platform%2520CLI%257C_____5)

Optionally you can specify the platform cli to use and your kube config file in **0-common-script-functions.sh**

```shell
# TIBCO Platform CLI to Use
# export PATH=/PlatformCLI/tibcop/bin:$PATH

# Kubeconfig file to use
# export KUBECONFIG=$PWD/cluster.yaml
```

Speficy the steps you want to execute in **run_tibco_platform_scripts.sh**

```shell
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
```

When you install the TIBCO Developer hub and you want to provide a GitHub token, configure the file **tibco-hub-secret.yaml**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: tibco-hub-secrets
type: Opaque
data:
  GITHUB_TOKEN: <Put your base64 encoded GitHub token here>
```

Then run the script by executing **run_tibco_platform_scripts.sh**
