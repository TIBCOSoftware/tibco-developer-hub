# Integration Topology

Welcome to the integration-topology plugin!

The integration topology plugin is built on top of Backstage's catalog graph plugin. It customizes the node and edge labels to help visualize the relationships between entities, such as ownership, grouping, or API connections. Additionally, it provides detailed information about entities, including type, name, description, documentation, source code, deployment status, and more. This makes catalog exploration productive and efficient directly within the topology view.

The plugin offers the following features:

- **EntityIntegrationTopologyCard**: A card that displays the topology view of the current entity and its directly related entities. This card can be added to the entity cards page. It also includes a view switcher to toggle between topology view and graph view and a link to navigate `IntegrationTopologyPage`.

- **IntegrationTopologyPage**: A standalone page that can be added to your application. It provides a visualizer for your entities and their relationships. The viewer allows navigation through the catalog by selecting entity types/kinds, searching by entity name, or filtering for specific relationships.

## Getting Started

Create your Backstage application using the Backstage CLI as described here:
[Backstage Documentation - Create an App](https://backstage.io/docs/getting-started/create-an-app)

To configure the plugin in your frontend:

1. Add a dependency to your `packages/app/package.json`:

```bash
yarn --cwd packages/app add @internal/plugin-integration-topology
```

2. Add the `IntegrationTopologyPage` to your `packages/app/src/App.tsx`:

```tsx
<FlatRoutes>
  …
  <Route path="/integration-topology" element={<IntegrationTopologyPage />} />
</FlatRoutes>
```

3. Add `EntityIntegrationTopologyCard` to any entity page in your `packages/app/src/components/catalog/EntityPage.tsx`:

```tsx
<Grid item md={6} xs={12}>
  <EntityIntegrationTopologyCard variant="gridItem" height={400} />
</Grid>
```

## Customizing Entity Node UI

The Topology Entity Node UI offers theme customization, entity icon customization, and status icon customization. All three customizations are optional and can be provided individually or together.

To customize, update the catalog YAML for the entity as follows:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: 'component-name'
  description: 'A description'
  tibco.developer.hub/topology: # Optional
    theme: # Optional - Provide either name or colors. If both are provided, colors will override the chosen theme.
      name: 'purple' # Optional | Choose from the theme colors below or add custom colors using the `colors` property.
      colors: # Optional - Can provide either one or both.
        background: 'hsla(203, 100%, 78%, 1)' # Optional - Can use CSS color codes or named colors (https://developer.mozilla.org/en-US/docs/Web/CSS/named-color).
        iconColor: 'hsla(233, 100%, 33%, 1)' # Optional
    entityIcon: # Optional
      icon: 'cloud' OR 'path/to/link1/icon.svg' # Material v4 icon name OR custom image (requires URL - can be of type SVG, PNG, or JPEG).
      iconTooltip: 'Entity Icon' # Optional
    statusIcon: # Optional - List of icons.
      - icon: 'VerifiedUser' # Material v4 icon name OR custom image (requires URL - can be of type SVG, PNG, or JPEG).
        iconColor: 'hsla(101, 78%, 41%, 1)' # Optional
        iconTooltip: 'Security Scan Passed' # Optional
      - icon: 'path/to/status/icon.svg' # Material v4 icon name OR custom image (requires URL - can be of type SVG, PNG, or JPEG).
        iconColor: 'darkorange' # Optional
        iconTooltip: 'Status Icon' # Optional
  spec:
    type: service
    lifecycle: experimental
    owner: owner-name
```

### Provided Theme Colors

The following theme colors are available:

- `pink`
- `orange`
- `yellow`
- `green`
- `pastelGreen`
- `purple`
- `navy`
- `blue`
