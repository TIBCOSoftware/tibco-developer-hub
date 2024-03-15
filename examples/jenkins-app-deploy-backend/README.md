# Introduction
This document describes an example and the steps to run a template (bwce) which supports multiple secrets and uses the custom jenkins action to deploy the bwce application in the data plane.

# Steps
## Create a template

In the 'template' directory, we have placed an example bwce template, which has 2 secrets as 'db_pass' and 'app_pass' and the template also uses the custom jenkins action 'tibco:jenkins-trigger-ear-build'.

There is a sample bwce project template exists inside the 'template' directory named as 'test-secret' which is used in 'fetch:template' step of the template'.

In this 'test-secret' folder, in the below files, in place of the secret we have added the texts as  @@SECRET1@@ and @@SECRET2@@, which will be replaced by the input values 'db_pass' and 'app_pass', entered by user while running the template, in 'tibco:jenkins-trigger-ear-build' action while deploying the application.

Files:

/test-secret/TestSecret/META-INF/default.substvar
/test-secret/TestSecret.module/META-INF/default.substvar

We can crate our own template or modify the above template as per the requirement.

## Install custom jenkins action (tibco:jenkins-trigger-ear-build)

We have exported the custom jenkins action named as 'jenkins-app-deploy-backend', as a plugin which is inside the 'plugins' folder of the root of the project.

Go through the readme file inside the plugin to add the custom action.

## Set up jenkins

Install



