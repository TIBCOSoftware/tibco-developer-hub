# DevHub Portable

A self-contained build of the TIBCO® Developer Hub that runs the **frontend and
backend in a single process**, with **no Docker and no Postgres** required. Point it
at your own catalog YAMLs and pick a port from the command line.

This works because in production TIBCO Developer Hub already serves the UI and the API
from one backend process (the `@backstage/plugin-app-backend` plugin) on a single port.
The portable build bundles that backend into a single `index.js` (via esbuild) plus a
minimal `node_modules` (just the native modules and on-disk assets it loads at runtime),
an embedded Node runtime, and a launcher. The result is ~3,000 files, so the zip
extracts in seconds.

## Quick start — one command

The bootstrap script auto-detects your OS/arch, downloads the matching bundle from the
GitHub release, extracts it into the **current folder** (`./devhub-bundled-<os>-<arch>/`),
and starts the hub. Re-running just relaunches the extracted bundle, so it doubles as the
"run" command. (Override the location with `DEVHUB_DIR`.)

```bash
# macOS / Linux — starts on http://localhost:7007
curl -fsSL https://raw.githubusercontent.com/TIBCOSoftware/tibco-developer-hub/main/DevHub_Portable/install.sh | bash

# pass args through after `--` (port, extra config, …)
curl -fsSL https://raw.githubusercontent.com/TIBCOSoftware/tibco-developer-hub/main/DevHub_Portable/install.sh | bash -s -- --port 8088 --config ./my.yaml
```

```powershell
# Windows (PowerShell) — download, then run with the execution policy bypassed
# (downloaded .ps1 files are blocked by default). Run the two lines as-is; quote the
# path and DO NOT join them with `&` (that's the call operator, not a separator).
irm https://raw.githubusercontent.com/TIBCOSoftware/tibco-developer-hub/main/DevHub_Portable/install.ps1 -OutFile "$env:TEMP\devhub-install.ps1"
powershell -ExecutionPolicy Bypass -File "$env:TEMP\devhub-install.ps1" -Port 8088
```

Add `-Config .\my.yaml` to the second line only if that file exists.

Pin a specific release or point at a custom asset with env vars (see the top of
`install.sh`): `DEVHUB_VERSION=portable-v1.0.0`, `DEVHUB_REPO=owner/repo`,
`DEVHUB_URL=<zip url>`, `DEVHUB_DIR=<cache dir>`. Requires `curl` and `unzip`.

> Releases are published by the CI workflow when you push a `portable-v*` tag. Until a
> release exists, use the manual download below or set `DEVHUB_URL`.

## Running a bundle (manual download)

Download/extract a `devhub-bundled-<os>-<arch>.zip` and run the launcher from inside it:

```bash
# macOS / Linux
./devhub                       # http://localhost:7007
./devhub --port 8088           # custom port
./devhub --config ./my.yaml    # load extra app-config (repeatable)
```

```bat
:: Windows
devhub.cmd
devhub.cmd --port 8088
devhub.cmd --config .\my.yaml
```

| Flag | Default | Purpose |
|------|---------|---------|
| `--port <n>` | `7007` | Port the hub listens on (UI + API). URL is `http://localhost:<n>`. If the default `7007` is busy, the launcher automatically picks the next free port and prints it. |
| `--config <path>` | — | Extra app-config layered on top of the built-in portable config. Repeatable. Use it to add `catalog.locations`, integrations, auth, etc. |

### Loading your own catalog YAMLs

Create a small config file and pass it with `--config`:

```yaml
# my.yaml
catalog:
  locations:
    - type: file
      target: /absolute/path/to/my-component.yaml
    - type: url
      target: https://github.com/acme/repo/blob/main/catalog-info.yaml
```

```bash
./devhub --config ./my.yaml
```

### Data & persistence

State (a SQLite database per plugin, plus the scaffolder workspace) is stored under
`./data` next to the launcher and **persists across restarts**. Delete `./data` to
reset. Override the location with the `DEVHUB_DATA_DIR` environment variable.

### Notes / limitations

- Served at the **root path** (`http://localhost:<port>/`), unlike the production
  deployment which sits behind an ingress at `/tibco/hub`. Only host/port are dynamic
  at runtime (the base path is baked at build time). Auth defaults to **guest** sign-in.
- **TechDocs** page rendering needs Python 3 + `mkdocs-techdocs-core` on `PATH` (not
  bundled). The hub starts fine without it; only opening a docs page would fail.
- Set `GITHUB_TOKEN` in your environment before launching to enable GitHub-backed
  features (catalog imports, scaffolder publish, etc.).

## Building

Native modules (`isolated-vm`, `better-sqlite3`) are compiled C++ and **cannot be
cross-compiled**, so each OS/arch must be built on its own platform.

### Locally (current platform only)

Requires Node 22/24, Yarn (`corepack enable`), and a C++ toolchain + Python 3.

```bash
DevHub_Portable/scripts/build-bundled.sh           # macOS / Linux
DevHub_Portable/scripts/build-bundled.ps1          # Windows (PowerShell)
```

Output: `DevHub_Portable/dist/devhub-bundled-<os>-<arch>/` plus a matching `.zip`. The
embedded Node runtime matches your host's Node version (so the compiled native modules'
ABI matches).

### All platforms (CI)

`.github/workflows/devhub-portable.yml` builds all four targets on a runner matrix
(macOS arm64 + x64, Linux x64, Windows x64). Trigger it manually ("Run workflow") or
push a tag like `portable-v1.0.0` to also attach the zips to a GitHub release. Artifacts
are named `devhub-bundled-<target>`.

## How it's assembled

1. `yarn workspace app build` → builds the frontend static assets with a root base path.
2. **esbuild** bundles `packages/backend/src/index.ts` into a single `index.js`, marking
   native modules and a few packages that load their own on-disk assets as external.
3. A trace boot (`trace-requires.cjs`) records exactly which packages the bundle loads at
   runtime; `build-sidecar.cjs` copies just those into a minimal `node_modules` (native
   modules whole, the `@backstage/*` backend plugins reduced to `package.json` +
   `migrations/`), and prunes foreign-platform prebuilds.
4. Download the matching Node runtime from `nodejs.org` into `node/`, stripped to just the
   binary.
5. Add `app-config.portable.yaml`, the launcher (+ `find-free-port.cjs`), and `data/`.
6. Zip it.
