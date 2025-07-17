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

## Developer Hub Version

Show developer hub version. Displays currently deployed version the left bottom of the Home Page UI

Example config:

```yaml
app:
  developerHubVersion: '1.9.0'
```

## Doc Url

Documentation url

```yaml
app:
  docUrl: 'https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview'
```

The CI/CD pipeline automatically adds the build number to all docker images.

## Secondary Control Planes

Configure multiple control planes

Example config:

```yaml
secondaryControlPlanes:
  - name: 'Control Plane 1'
    url: 'https://<link to cp1>'
    id: cp1
  - name: 'Control Plane 2'
    url: 'https://<link to cp2>'
    id: cp2
```

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

## Template Groups

Configuration for the template groups in template page when click on the Develop button

Example config:

```yaml
templateGroups:
  - name: templateGroup1
    tagFilters: ['bwce', 'recommended']
  - name: templateGroup2
    tagFilters: ['flogo']
```

## Import Flow Groups

Configuration for the import flow groups in import flow page when click on the Import Flow button

Example config:

```yaml
importFlowGroups:
  - name: importFlowGroup1
    tagFilters: ['bwce', 'recommended']
  - name: importFlowGroup2
    tagFilters: ['flogo']
```

## Marketplace Groups

Configuration for the marketplace groups in marketplace page when click on the Marketplace button

Example config:

```yaml
marketplaceGroups:
  - name: Documents
    tagFilters: ['mp-document']
  - name: Sample's
    tagFilters: ['mp-sample']
  - name: Templates
    tagFilters: ['mp-template']
  - name: Import Flows
    tagFilters: ['mp-import-flow']
```

## Cp Link

Control plane link for the TIBCO® Developer Hub.

Example config:

```yaml
cpLink: 'https://control-plane.domain.com'
```

No need to provide this in configuration.
This is filled automatically while provisioning TIBCO® Developer Hub for a data plane.
