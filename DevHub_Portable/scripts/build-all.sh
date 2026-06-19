#!/usr/bin/env bash
#
# Build every DevHub Portable (bundled) zip that can be produced on this machine,
# then tell you what's left and how to publish.
#
#   * darwin-arm64 — built natively on this Mac (host).
#   * linux-x64    — built inside a node:24 Docker container (linux/amd64).
#   * win32-x64    — CANNOT be built on macOS/Docker; run build-bundled.ps1 on a
#                    Windows machine and drop the zip into DevHub_Portable/dist/.
#
# Native modules (isolated-vm, better-sqlite3, …) are compiled per-platform and the
# build boots the bundle to discover its sidecar, so each target must be built on its
# own OS/arch — there is no cross-compiling. That's why Windows needs a Windows box.
#
# Usage:
#   DevHub_Portable/scripts/build-all.sh [--skip-install] [--skip-linux]
#     --skip-install   pass through to the host build (reuse existing node_modules)
#     --skip-linux     build the host target only (no Docker)
#
set -euo pipefail

SCRIPT_DIR="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORTABLE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ROOT="$(cd "$PORTABLE_DIR/.." && pwd)"
DIST="$PORTABLE_DIR/dist"

SKIP_INSTALL=0
SKIP_LINUX=0
for arg in "$@"; do
  case "$arg" in
    --skip-install) SKIP_INSTALL=1 ;;
    --skip-linux)   SKIP_LINUX=1 ;;
    *) echo "build-all: unknown argument '$arg'" >&2; exit 1 ;;
  esac
done

mkdir -p "$DIST"

# --- 1. host build (this Mac → darwin-arm64) ---------------------------------
echo "==> [1/2] Building host target natively"
HOST_ARGS=()
[[ "$SKIP_INSTALL" -eq 1 ]] && HOST_ARGS+=(--skip-install)
bash "$SCRIPT_DIR/build-bundled.sh" ${HOST_ARGS[@]+"${HOST_ARGS[@]}"}

# --- 2. linux-x64 build (Docker) ---------------------------------------------
if [[ "$SKIP_LINUX" -eq 0 ]]; then
  echo "==> [2/2] Building linux-x64 in Docker (node:24, linux/amd64)"
  if ! command -v docker >/dev/null 2>&1; then
    echo "build-all: docker not found — install Docker or pass --skip-linux." >&2
    exit 1
  fi
  if ! docker info >/dev/null 2>&1; then
    echo "build-all: Docker daemon is not running — start Docker Desktop or pass --skip-linux." >&2
    exit 1
  fi
  # The container gets a clean copy of the repo (no host node_modules / dist / .git),
  # installs build tools, runs the SAME build-bundled.sh (which detects linux-x64),
  # and copies the resulting zip back into the host dist via the /out bind mount.
  # --platform linux/amd64 forces an x64 build even on Apple Silicon (uses emulation).
  docker run --rm --platform linux/amd64 \
    -v "$ROOT":/src:ro \
    -v "$DIST":/out \
    node:24-bookworm bash -euo pipefail -c '
      echo "--- installing build toolchain ---"
      export DEBIAN_FRONTEND=noninteractive
      apt-get update -qq
      apt-get install -y -qq build-essential python3 zip rsync curl >/dev/null
      corepack enable
      echo "--- copying source (excluding node_modules/.git/dist) ---"
      mkdir -p /build
      rsync -a --exclude node_modules --exclude .git --exclude "DevHub_Portable/dist" /src/ /build/
      cd /build
      echo "--- building linux-x64 bundle ---"
      bash DevHub_Portable/scripts/build-bundled.sh
      cp DevHub_Portable/dist/devhub-bundled-linux-x64.zip /out/
      echo "--- linux-x64 zip copied to host dist ---"
    '
else
  echo "==> [2/2] Skipping linux-x64 (--skip-linux)"
fi

# --- summary -----------------------------------------------------------------
echo
echo "==> Done. Zips in $DIST:"
ls -1 "$DIST"/devhub-bundled-*.zip 2>/dev/null | sed 's#^#    #' || echo "    (none?)"
cat <<EOF

Still needed:
  • Windows (win32-x64): run DevHub_Portable/scripts/build-bundled.ps1 on a Windows
    machine, then copy devhub-bundled-win32-x64.zip into DevHub_Portable/dist/.

Publish (manual) — upload all zips to a fork release:
  gh release create portable-v1.0.0 DevHub_Portable/dist/devhub-bundled-*.zip \\
    --repo TIBCOSoftware/tibco-developer-hub \\
    --title "DevHub Portable v1.0.0" \\
    --notes "Bundled builds: macOS arm64, Linux x64, Windows x64"
EOF
