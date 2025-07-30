# The TIBCO Helm Charts

**Documentation**

[https://github.com/TIBCOSoftware/tp-helm-charts/blob/main/README.md](https://github.com/TIBCOSoftware/tp-helm-charts/blob/main/README.md)

**GitHub Repository:**

[https://github.com/TIBCOSoftware/tp-helm-charts](https://github.com/TIBCOSoftware/tp-helm-charts)

# Helm Charts for TIBCO® Platform
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Helm Charts for TIBCO® Platform contains a list of Helm charts for TIBCO® Platform data plane components.

## Introduction
TIBCO Platform provides a single pane of glass for the management, monitoring, and observability of TIBCO applications and capabilities. It provides a unified view of all TIBCO applications and capabilities deployed across multiple Kubernetes clusters and cloud environments.

TIBCO Platform consists of two main components:
* TIBCO® Control Plane is the central monitoring and management interface for n-number of data planes running TIBCO applications and capabilities.
* Data Plane is the runtime environment for TIBCO applications and capabilities. It contains a set of helm charts that can be deployed on any Kubernetes cluster on-premises or in the cloud.

This repository contains Helm charts for Data Plane components that can be deployed on the customer's Kubernetes cluster.

## Installing

Most of the Helm charts in this repository will be installed by the TIBCO® Control Plane. In most cases, customers will not need to install these Helm charts manually.

There are some charts that can help customers set up cluster ingress, storage class, observability stack, etc. Customers can install these charts manually.

### Prerequisites
1. [x] Helm **v3 > 3.12.0** [installed](https://helm.sh/docs/using_helm/#installing-helm): `helm version`
2. [x] Chart repository: `helm repo add tibco-platform https://tibcosoftware.github.io/tp-helm-charts`

### Deploy Data Plane components

```bash
helm upgrade --install --create-namespace -n <namespace> <release name> tibco-platform/<ingress chart> -f <ingress values file>
```


