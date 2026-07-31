# ⚠️ This marketplace content has moved

All TIBCO Developer Hub marketplace content that used to live in this folder was migrated
(like-for-like) to its own repository:

**[TIBCOSoftware/tibco-developer-hub-marketplace](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace)**

## Why is this folder still here?

When a marketplace entry is installed, TIBCO Developer Hub stores the entry's
`catalog-info.yaml` URL as a `Location` in its own catalog and keeps re-fetching it.
Installs made **before** the migration still point at this path, so the files here are
kept **unchanged** to keep those installs working.

**Do not use this folder for new work.** It is frozen — all updates, fixes and new
entries happen in the repository above.

## Where did each folder go?

| Old location (this folder) | New location in `tibco-developer-hub-marketplace` |
| --- | --- |
| `business-works-ai/` | [`businessworks/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/businessworks) |
| `business-works-articles/` | [`businessworks/articles/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/businessworks/articles) |
| `bw-ai-generator/` | [`businessworks/bw-ai-generator/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/businessworks/bw-ai-generator) |
| `developer-hub-skills/` | [`developer-hub/skills/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/developer-hub/skills) |
| `developer-hub-tutorials/` | [`developer-hub/tutorials/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/developer-hub/tutorials) |
| `e-commerce-platform/` | [`developer-hub/e-commerce-platform/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/developer-hub/e-commerce-platform) |
| `flogo-ai-agents/` | [`flogo/ai-agents/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/flogo/ai-agents) |
| `flogo-extension-generators/` | [`flogo/extension-generators/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/flogo/extension-generators) |
| `flogo-extensions/` | [`flogo/extensions/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/flogo/extensions) |
| `flogo-samples/` | [`flogo/samples/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/flogo/samples) |
| `flogo-skills/` | [`flogo/skills/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/flogo/skills) |
| `flogo-templates/` | [`flogo/templates/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/flogo/templates) |
| `helm-charts/` | [`platform/helm-charts/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/platform/helm-charts) |
| `import-flows/` | [`developer-hub/import-flows/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/developer-hub/import-flows) |
| `platform-cli/` | [`platform/cli/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/platform/cli) |
| `platform-provisioner/` | [`platform/provisioner/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/platform/provisioner) |
| `self-service-flows/` | [`developer-hub/self-service-flows/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/developer-hub/self-service-flows) |
| `smart-routing/` | [`businessworks/smart-routing/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/businessworks/smart-routing) |
| `tibco-platform-apis/` | [`platform/apis/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/platform/apis) |
| `tp-cicd-pipelines/` | [`platform/cicd-pipelines/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/platform/cicd-pipelines) |

Sub-folders follow the same mapping — for example
`flogo-samples/mcp-customer-360/` is now
[`flogo/samples/mcp-customer-360/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/flogo/samples/mcp-customer-360),
and `tibco-platform-apis/version-118/` is now
[`platform/apis/version-118/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/platform/apis/version-118).

Each folder below also carries its own `README.md` with its exact new location.
