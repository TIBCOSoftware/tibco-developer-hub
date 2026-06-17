# Getting started with DevHub Portable

Run the **TIBCO® Developer Hub** on your own machine with a single command — no Docker,
no Postgres, no install wizard. It's a self-contained download that starts the full hub
(UI + API) on `http://localhost:7007`.

---

## 1. Install & run (one command)

Open a terminal in the folder where you want it to live, then run the line for your OS.
It downloads the right build for your machine, unpacks it, and starts the hub.

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/TIBCOSoftware/tibco-developer-hub/main/DevHub_Portable/install.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/TIBCOSoftware/tibco-developer-hub/main/DevHub_Portable/install.ps1 -OutFile "$env:TEMP\devhub-install.ps1"
powershell -ExecutionPolicy Bypass -File "$env:TEMP\devhub-install.ps1"
```

When it finishes you'll see `Listening on 127.0.0.1:7007`. Open **http://localhost:7007**
in your browser and sign in as **Guest**. 🎉

> First launch loads a small example catalog from GitHub, so give it a few seconds.

To stop the hub, press **Ctrl-C** in the terminal. To start it again later, just re-run
the same command — it relaunches the already-downloaded copy (no re-download).

---

## 2. Choosing a port

The hub uses port **7007** by default. If that port is busy it automatically picks the
next free one and tells you which. To set it yourself:

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/TIBCOSoftware/tibco-developer-hub/main/DevHub_Portable/install.sh | bash -s -- --port 8088
```

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File "$env:TEMP\devhub-install.ps1" -Port 8088
```

Already downloaded? Run the launcher inside the extracted folder directly:

```bash
# macOS / Linux  (folder: ./devhub-bundled-<os>-<arch>/)
./devhub --port 8088
```
```bat
:: Windows  (folder: .\devhub-bundled-win32-x64\)
devhub.cmd --port 8088
```

---

## 3. Load your own catalog

Create a small YAML file pointing at your entities, then pass it with `--config`. You can
pass `--config` more than once.

```yaml
# my.yaml
catalog:
  locations:
    - type: file
      target: /absolute/path/to/catalog-info.yaml
    - type: url
      target: https://github.com/acme/repo/blob/main/catalog-info.yaml
```

```bash
./devhub --config ./my.yaml
```

The same `--config` flag also lets you add integrations, auth providers, etc. — anything
that's valid Backstage `app-config`. It's layered on top of the built-in portable config.

---

## 4. Data & resetting

Everything you create (catalog database, scaffolder workspace) is stored in a **`data/`**
folder next to the launcher and **survives restarts**. To start completely fresh, delete
that `data/` folder.

---

## 5. Optional: a GitHub token

Without a token, GitHub features work anonymously and are rate-limited (60 requests/hour).
Set a token before launching to lift that and enable catalog imports / scaffolder publish:

```bash
# macOS / Linux
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
./devhub
```
```powershell
# Windows
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxx"
.\devhub.cmd
```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| **macOS: "devhub" cannot be opened / developer cannot be verified** | The download was quarantined. The install script clears this automatically; if you extracted manually, run `xattr -cr .` inside the folder, then `./devhub`. |
| **Windows: running a `.ps1` is blocked** | Use the `powershell -ExecutionPolicy Bypass -File …` form shown above (it's already in the one-liner). |
| **"Port 7007 is in use"** | The launcher auto-picks the next free port and prints it — just open the URL it shows. Or pass `--port <n>` yourself. |
| **A TechDocs page won't render** | Rendering needs Python 3 + `mkdocs-techdocs-core` on your `PATH` (not bundled). The hub still runs fine; only the docs page is affected. |
| **The page won't load at `localhost`** | Make sure you opened the exact port from the startup log (`Listening on 127.0.0.1:<port>`), and that the terminal is still running. |
| **`curl` or `unzip` not found (Linux)** | Install them, e.g. `sudo apt-get install -y curl unzip`. |

---

## Manual download (no script)

Prefer to grab the file yourself? Go to the project's **Releases**, download
`devhub-bundled-<your-os>-<arch>.zip`, unzip it, and run the launcher inside:

- macOS / Linux: `./devhub`
- Windows: double-click `devhub.cmd` (or run it from a terminal)

On macOS, if it's blocked, run `xattr -cr .` in the folder first.

---

That's it — one download, one command, and you've got a local TIBCO Developer Hub. For
build details and configuration internals, see [`README.md`](./README.md).
