# The TIBCO Platform Provisioner

**Documentation**

[https://github.com/TIBCOSoftware/platform-provisioner/blob/main/README.md](https://github.com/TIBCOSoftware/platform-provisioner/blob/main/README.md)

**GitHub Repository:**

[https://github.com/TIBCOSoftware/platform-provisioner/](https://github.com/TIBCOSoftware/platform-provisioner/)

# Platform Provisioner by TIBCO®

Platform Provisioner by TIBCO® is a lightweight, extensible, and easy to use recipe based provisioning system for cloud native platforms.
It consists of the following components:

* Recipes: contains all the information to provision a platform infrastructure and applications.
* Pipelines: The script that run inside the Docker image to parse and run the recipe.
* A runtime Docker image: The Docker image that contains all the supporting tools to run a pipeline with given recipe.

## Why Platform Provisioner?

The Platform Provisioner is designed the best fit for the following use cases:

* Developer/DevOps engineer wants to provision a platform infrastructure and applications in both cloud and on-premises.
* SRE/DevOps engineer has code snippets to run every 3 month or so for the operation tasks.
* Platform team wants to provide a zero trust provisioning system for multi-cloud environment.
* Platform team wants to dynamically provision a platform infrastructure and applications on demand.
* Platform team wants to provide a self-service provisioning system for the developers.

The Platform Provisioner does not want to create another layer of abstraction on top of the existing tools. It provides 2 kinds of pipelines: generic-runner and helm-install.
The pipelines are focused on workflow orchestration and recipe parsing. So that the user can put their favorite tools in the docker image and use the recipe to manage their workflow.
The pipelines are designed to be extensible and easy to use.
