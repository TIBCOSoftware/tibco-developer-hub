# jenkins-app-deploy

Welcome to the jenkins-app-deploy backend plugin!

This contains a collection of actions:

- `tibco:trigger-jenkins-job`

## Getting started

Create your Backstage application using the Backstage CLI as described here:
https://backstage.io/docs/getting-started/create-an-app

> Note: If you are using this plugin in a Backstage monorepo that contains the code for `@backstage/plugin-scaffolder-backend`, you need to modify your internal build processes to transpile files from the `node_modules` folder as well.

You need to configure the action in your backend:

## From your Backstage root directory

```
yarn --cwd packages/backend add @internal/plugin-scaffolder-backend-module-trigger-jenkins-job@^1.4.0
```

Configure the action:
(you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

Import the action that you'd like to register to your backstage instance.

```typescript
// packages/backend/src/index.ts
import { triggerJenkinsJobAction } from '@internal/plugin-scaffolder-backend-module-trigger-jenkins-job';
import {coreServices} from '@backstage/backend-plugin-api';
...

const scaffolderModuleCustomExtensions = createBackendModule({
    pluginId: 'scaffolder', // name of the plugin that the module is targeting
    moduleId: 'custom-extensions',
    register(env) {
        env.registerInit({
            deps: {
                scaffolder: scaffolderActionsExtensionPoint,
                config: coreServices.rootConfig,
            },
            async init({ scaffolder, config }) {
                scaffolder.addActions(new (triggerJenkinsJobAction as any)(config));
                scaffolder.addActions(new (ExtractParametersAction as any)());
                scaffolder.addActions(new (createYamlAction as any)());
            },
        });
    },
});
```

# app-config

```yaml
jenkins:
  baseUrl: https://jenkins.example.com
  username: backstage-bot
  apiKey: xxxxxxxxxxxxx
  jenkinsActionSecretEncryptionKey: xxxxxxxxxxxxxx
  jenkinsActionJobAuthToken: BuildEARToken
```

# Template

```yaml
---
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: bwce-template-secret
  title: BWCE Template (TEST SECRET)
  description: Create a new BWCE project with Documentation, that exposes a configured database table with multiple secrets.
  tags:
    - tibco
    - bwce
spec:
  owner: ACME
  type: service

  parameters:
    - title: Provide Database Details
      required:
        - name
        - description
      properties:
        name:
          title: Name
          type: string
          description: Unique name of the BWCE-Database Project
          ui:field: EntityNamePicker
          ui:autofocus: true
        description:
          title: Description
          type: string
          description: A description for the BWCE-Database Project
        db_pass:
          title: Database Password
          type: string
          ui:field: Secret
        app_pass:
          title: Application Password
          type: string
          ui:field: Secret
        owner:
          title: Owner
          type: string
          description: Owner of the component
          ui:field: OwnerPicker
          ui:options:
            allowedKinds:
              - Group

    - title: Choose a location
      required:
        - repoUrl
      properties:
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - github.com

  # This template is meant to be used on top of an existing template.
  # By adding the following and fetching from an absolute URL you can
  # add in the docs template
  steps:
    - id: fetch
      name: BWCE Skeleton
      action: fetch:template
      input:
        url: ./test-secret
        values:
          name: ${{ parameters.name }}
          description: ${{ parameters.description }}
          destination: ${{ parameters.repoUrl | parseRepoUrl }}
          owner: ${{ parameters.owner }}

    - id: publish
      name: Publish
      action: publish:github
      input:
        allowedHosts: ['github.com']
        description: This is ${{ parameters.name }}
        repoUrl: ${{ parameters.repoUrl }}

    - id: register
      name: Register
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps.publish.output.repoContentsUrl }}
        catalogInfoPath: '/catalog-info.yaml'

    - id: jenkinsEarBuild
      name: Trigger Jenkins EAR Build & Platform Deployment
      action: tibco:trigger-jenkins-job
      input:
        repoUrl: ${{ parameters.repoUrl | parseRepoUrl}}
        job: Build_BWCE_EAR_Maven_Secret
        authToken: test
        secret:
          SECRET1: ${{ secrets.db_pass }}
          SECRET2: ${{ secrets.app_pass }}
        jenkinsInstructions: '&bw_project_folder=TestSecret'

  output:
    links:
      - title: Repository
        url: ${{ steps.publish.output.remoteUrl }}
      - title: Open in catalog
        icon: catalog
        entityRef: ${{ steps.register.output.entityRef }}
      - title: Open Jenkins Job
        icon: dashboard
        url: ${{ steps.jenkinsEarBuild.output.jobLink }}
```
