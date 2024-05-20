# tibco-platform-plugin

Welcome to the tibco-platform-plugin plugin!

This contains a component card which shows the deployed BWCE and Flogo applications in Tibco platform and the data planes.
On click on the applications link, will direct to control plane link where the application is deployed.

## Getting started

Create your Backstage application using the Backstage CLI as described here:
https://backstage.io/docs/getting-started/create-an-app

You need to configure the plugin in your frontend:

## From your Backstage root directory

```
yarn --cwd packages/app add @internal/plugin-tibco-platform-plugin@^0.1.0
```

Configure the plugin:

```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
import { PlatformApplicationDeploymentsCard } from '@internal/plugin-tibco-platform-plugin';
// You can add the card to any number of pages, the overviewContent is shown as an example here
const overviewContent = (
  <>
    <Grid container spacing={3} alignItems="stretch">
      {entityWarningContent}
      <Grid item md={6}>
        <EntityAboutCard variant="gridItem" />
      </Grid>
      <Grid item md={6} xs={12}>
        <EntityCatalogGraphCard variant="gridItem" height={400} />
      </Grid>

      <Grid item md={4} xs={12}>
        <EntityLinksCard />
      </Grid>
      <Grid item md={8} xs={12}>
        <EntityHasSubcomponentsCard variant="gridItem" />
      </Grid>
      <EntitySwitch>
        <EntitySwitch.Case if={isKind('component')}>
          <Grid item md={6} xs={12}>
            <PlatformApplicationDeploymentsCard />
          </Grid>
        </EntitySwitch.Case>
      </EntitySwitch>
    </Grid>
  </>
);
```

# Component

```yaml
---
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: 'your-component'
  description: 'a description'
  tags:
    - platform
  tibcoPlatformApps:
    - appType: BWCE
      appName: BWCE-app
      dataPlaneName: DP-dev
      dpId: demodpid1
      capabilityInstanceId: democapabilityInstanceid1
      appId: demoappid1
    - appType: BWCE
      appName: BWCE-app1
      dataPlaneName: DP-prod
      dpId: demodpid2
      capabilityInstanceId: democapabilityInstanceid2
      appId: demoappid2
spec:
  type: service
  lifecycle: experimental
  owner: your-name
```
