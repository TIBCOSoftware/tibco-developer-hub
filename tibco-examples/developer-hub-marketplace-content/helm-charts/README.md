# ⚠️ This content has moved

The TIBCO Developer Hub marketplace content now lives in its own repository:
**[TIBCOSoftware/tibco-developer-hub-marketplace](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace)**

**New location of this content:**
[`platform/helm-charts/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/platform/helm-charts)

## Why is this folder still here?

When a marketplace entry is installed, TIBCO Developer Hub stores the entry's
`catalog-info.yaml` URL as a `Location` in its own catalog and keeps re-fetching it.
Installs made **before** the migration still point at this path, so the files here are
kept **unchanged** to keep those installs working.

**Do not use this folder for new work.** It is frozen — all updates, fixes and new
entries happen in the repository above.
