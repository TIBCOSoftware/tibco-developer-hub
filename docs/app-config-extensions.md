# App config extensions

This document describes TIBCO® Developer Hub custom extensions to the `packages/app/app-config.yaml` schema.

These are also described in the [`config.d.ts` file](../packages/app/config.d.ts) with more details about each field.

## Build Info

Show the build number at the bottom of the Home Page UI.

Example config:

```yaml
app:
  title: The TIBCO Hub
  baseUrl: http://localhost:3000
  showBuildVersion: true
```

The CI/CD pipeline automatically adds the build number to all docker images.

## Walk Through

Show the Walk-through card on home page if the config is present.

Example config:

```yaml
walkThrough:
  viewAllLink: 'http://www.some-external-link.com'
  items:
    - title: 'Walk Through 1'
      tags: ['Tag1', 'Tag2']
      text: 'Some description'
      link: 'http://www.some-external-link.com/walk-through1'
    - title: 'Walk Through 2'
      tags: ['Tag1', 'Tag2']
      text: 'Some description'
      link: 'http://www.some-external-link.com/walk-through2'
```

## Cp Link

Control plane link for the TIBCO® Developer Hub.

Example config:

```yaml
cpLink: 'https://control-plane.domain.com'
```

No need to provide this in configuration.
This is filled automatically while provisioning TIBCO® Developer Hub for a data plane.
