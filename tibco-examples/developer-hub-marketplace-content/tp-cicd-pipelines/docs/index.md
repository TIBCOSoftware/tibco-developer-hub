# TIBCO Platform CI/CD Pipelines

Three reusable Azure DevOps pipelines that automate the full build-and-deploy lifecycle of TIBCO BWCE applications across multi-cloud Kubernetes environments (AKS, EKS, GKE) using the TIBCO Platform Build & Deploy APIs.

Contributed by **Prowess** to the TIBCO Hackathon 2025.

---

## Architecture

The pipelines are designed to plug into a standard Azure DevOps environment with self-hosted agents that have network access to your TIBCO Platform Control Plane and target Kubernetes clusters.

```
Source Repo  ──►  Azure DevOps Pipeline  ──►  TIBCO Platform Build API  ──►  Container Image
                                                                                     │
                                                                                     ▼
                                          TIBCO Platform Deploy API  ──►  AKS / EKS / GKE
```

The three pipelines are independent in Azure DevOps but follow a logical execution order:

1. **Supplements** &mdash; build any reusable supplement artifacts (EMS, SAP, etc.) the application depends on.
2. **Build** &mdash; build the BWCE application image via the TP Build API, producing a `buildId`.
3. **Deploy** &mdash; deploy that `buildId` to the selected cloud target via the TP Deploy API and `kubectl set image`.

---

## The three pipelines

### `TP-Generic-Supplements-Pipeline`

Builds application supplements (EMS, SAP integrations, ...) that the main BWCE application depends on. Validates the EAR and `.substvar` files, constructs the JSON payload for the TIBCO Platform supplement build API, and registers a new supplement version. Run this only when supplement components change.

### `TP-Generic-Build-Pipeline`

Performs the primary application build. Clones the source repository, validates the build parameters, uploads the EAR + `.substvar`, ties them to the configured dependency and supplement information, and calls the TP Build API. Output: a new build in TIBCO Platform with a deployable container image and a `buildId` for the next stage.

### `TP-Generic-Deploy-Pipeline`

Takes the `buildId` from the Build Pipeline and deploys it. Constructs the TP Deploy API payload and selects the cloud-specific deployment job based on `cloudProvider` (`aks` / `eks` / `gke`). Each cloud job updates the Kubernetes Deployment using `kubectl set image` against the configured namespace and container.

---

## Pipeline parameters

All three pipelines share a common parameter vocabulary so you can compose them without surprises:

| Parameter | Used in | Role |
|---|---|---|
| `agentPoolName` | All | DevOps agent pool that runs the pipeline |
| `depName` | Build, Supplement | TP dependency name |
| `depVersion` | Build, Supplement | TP dependency version |
| `supplementName` | Build, Supplement | Supplement type (`ems`, `sap`, ...) |
| `buildName` | Build, Supplement | Friendly name visible in TIBCO Platform |
| `tags` | Build, Deploy, Supplement | Comma-separated, converted into a JSON tag array |
| `substvar` | Build, Supplement | `.substvar` filename used during the TP build |
| `ear` | Build, Supplement | EAR filename to upload to TP |
| `eardirectorypath` | Supplement | Repo-relative path to the EAR |
| `substvardirectorypath` | Supplement | Repo-relative path to the `.substvar` |
| `gitBranch` | Build | Branch to clone from the TCI repo (`TP_QA`, ...) |
| `profileEnv` | Build | Profile folder (`DEV` / `QA` / `PROD`) for substvar retrieval |
| `cloudProvider` | All deploy stages | Selects which deploy job runs (`aks` / `eks` / `gke`) |
| `tpBuildApiUrl` | Build | Base TIBCO Platform build endpoint |
| `tpDeployApiUrl` | Deploy | Base TIBCO Platform deploy endpoint |
| `tpNamespace` | Deploy | Namespace passed to `/deploy` |
| `baseVersion` | Build | `baseversion` query param to the TP build API |
| `baseImageTag` | Build | `baseimagetag` query param to the TP build API |
| `imageName` | All deploy stages | Container image to roll out via `kubectl set image` |
| `k8sNamespace` | All deploy stages | Kubernetes namespace where the Deployment lives |
| `k8sDeploymentName` | All deploy stages | Deployment name to patch |
| `k8sContainerName` | All deploy stages | Container inside the Deployment to update |
| `appName` | Deploy | Application name in the TP deploy JSON payload |
| `buildId` | Deploy | ID of the previously built image to deploy |
| `profile` | Deploy | TIBCO Platform deployment profile (`QA` / `DEV` / `PROD`) |
| `appProperties` | Deploy | `<profile>/properties.json` injected into the deploy payload |

---

## Files in this entry

| File | Purpose |
|---|---|
| `pipelines/TP-Generic-Build-Pipeline.yml` | Application build pipeline |
| `pipelines/TP-Generic-Deploy-Pipeline.yml` | Multi-cloud deployment pipeline |
| `pipelines/TP-Generic-Supplements-Pipeline.yml` | Supplement build pipeline |

Drop the three YAML files into your Azure DevOps repo under `azure-pipelines/`, register them as separate pipelines, and parameterize per environment.

---

## Benefits

- A **single set of pipelines** for AKS, EKS, and GKE &mdash; no per-cloud forks.
- **Fully parameterized** &mdash; one pipeline definition, many BWCE apps.
- **BWCE-agnostic** &mdash; works for any BWCE application that builds via the TP Build API.
- **Faster, repeatable deployments** with build/deploy artifacts traceable through Azure DevOps and TIBCO Platform.
