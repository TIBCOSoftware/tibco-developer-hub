#!/usr/bin/env bash
#
# DevHub Portable bootstrap (macOS / Linux).
#
# Downloads the portable bundle for this machine, extracts it (once, into the current
# folder as ./devhub-bundled-<os>-<arch>/), and starts the TIBCO Developer Hub.
# Re-running just relaunches the already-extracted bundle, so it doubles as the
# "run" script.
#
# One-liner:
#   curl -fsSL <raw-url>/DevHub_Portable/install.sh | bash
#   curl -fsSL <raw-url>/DevHub_Portable/install.sh | bash -s -- --port 8088 --config ./my.yaml
#
# Any arguments after `--` are passed straight through to the hub (e.g. --port, --config).
#
# Environment overrides:
#   DEVHUB_REPO     GitHub owner/repo to fetch releases from
#                   (default: TIBCOSoftware/tibco-developer-hub)
#   DEVHUB_VERSION  release tag to install, or "latest" (default: latest)
#   DEVHUB_URL      full URL to a devhub-bundled-<os>-<arch>.zip (overrides
#                   REPO/VERSION; may be a file:// URL for local testing)
#   DEVHUB_DIR      parent folder to extract into (default: current directory)
#   DEVHUB_FORCE    set to 1 to re-download/re-extract even if already present
#
set -euo pipefail

REPO="${DEVHUB_REPO:-TIBCOSoftware/tibco-developer-hub}"
VERSION="${DEVHUB_VERSION:-latest}"
INSTALL_ROOT="${DEVHUB_DIR:-$PWD}"

err() { echo "devhub-install: $*" >&2; }
die() { err "$*"; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }

# --- detect platform ---------------------------------------------------------
case "$(uname -s)" in
  Darwin) OS="darwin" ;;
  Linux)  OS="linux" ;;
  *) die "unsupported OS '$(uname -s)'. On Windows use install.ps1." ;;
esac
case "$(uname -m)" in
  arm64|aarch64) ARCH="arm64" ;;
  x86_64|amd64)  ARCH="x64" ;;
  *) die "unsupported architecture '$(uname -m)'." ;;
esac
TARGET="$OS-$ARCH"
NAME="devhub-bundled-$TARGET"

have curl   || die "curl is required."
have unzip  || die "unzip is required (install it, e.g. 'apt-get install unzip')."

# --- resolve the download URL ------------------------------------------------
if [ -z "${DEVHUB_URL:-}" ]; then
  if [ "$VERSION" = "latest" ]; then
    err "resolving latest release of $REPO ..."
    VERSION="$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" \
      | grep '"tag_name"' | head -1 | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')"
    [ -n "$VERSION" ] || die "could not resolve latest release. Set DEVHUB_VERSION=portable-vX.Y.Z."
  fi
  DEVHUB_URL="https://github.com/$REPO/releases/download/$VERSION/$NAME.zip"
fi

DEST="$INSTALL_ROOT"
BUNDLE="$DEST/$NAME"

# --- download + extract (once) -----------------------------------------------
if [ "${DEVHUB_FORCE:-0}" = "1" ]; then rm -rf "$BUNDLE"; fi

if [ ! -x "$BUNDLE/devhub" ]; then
  err "downloading $DEVHUB_URL"
  mkdir -p "$DEST"
  tmp_zip="$(mktemp -t devhub.XXXXXX.zip)"
  trap 'rm -f "$tmp_zip"' EXIT
  curl -fSL --progress-bar "$DEVHUB_URL" -o "$tmp_zip" \
    || die "download failed. Check DEVHUB_VERSION/DEVHUB_REPO, or that the release asset $NAME.zip exists."
  err "extracting to $BUNDLE"
  rm -rf "$BUNDLE"
  unzip -q "$tmp_zip" -d "$DEST"
  rm -f "$tmp_zip"; trap - EXIT
  # Clear the macOS quarantine flag so the bundled Node binary runs without prompts.
  if [ "$OS" = "darwin" ] && have xattr; then
    xattr -dr com.apple.quarantine "$BUNDLE" 2>/dev/null || true
  fi
fi

[ -x "$BUNDLE/devhub" ] || die "bundle launcher not found at $BUNDLE/devhub after extraction."

# --- run ---------------------------------------------------------------------
err "starting hub from $BUNDLE"
exec "$BUNDLE/devhub" "$@"
