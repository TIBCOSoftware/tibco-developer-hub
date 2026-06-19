<#
.SYNOPSIS
  DevHub Portable bootstrap (Windows).

.DESCRIPTION
  Downloads the Windows portable bundle, extracts it (once, into the current folder
  as .\devhub-bundled-win32-x64\) and starts the TIBCO Developer Hub. Re-running just
  relaunches the extracted bundle.

  One-liner (downloads then runs):
    powershell -ExecutionPolicy Bypass -Command "irm <raw-url>/DevHub_Portable/install.ps1 -OutFile $env:TEMP\devhub-install.ps1; & $env:TEMP\devhub-install.ps1 -Port 8088"

.PARAMETER Port
  Port the hub listens on (default 7007).
.PARAMETER Config
  One or more extra app-config files to layer on top.
.PARAMETER Repo
  GitHub owner/repo (default TIBCOSoftware/tibco-developer-hub). Or set $env:DEVHUB_REPO.
.PARAMETER Version
  Release tag or "latest" (default latest). Or set $env:DEVHUB_VERSION.
.PARAMETER Url
  Full URL to devhub-bundled-win32-x64.zip (overrides Repo/Version). Or set $env:DEVHUB_URL.
#>
param(
  [int]$Port = 0,
  [string[]]$Config = @(),
  [string]$Repo = $(if ($env:DEVHUB_REPO) { $env:DEVHUB_REPO } else { 'TIBCOSoftware/tibco-developer-hub' }),
  [string]$Version = $(if ($env:DEVHUB_VERSION) { $env:DEVHUB_VERSION } else { 'latest' }),
  [string]$Url = $env:DEVHUB_URL
)
$ErrorActionPreference = 'Stop'
# Invoke-WebRequest is 10-50x slower for large downloads while its progress bar is on
# (Windows PowerShell 5.1 re-renders it constantly and buffers the whole response in
# memory). Silence it so the fallback IWR path is fast; the curl.exe path below is faster still.
$ProgressPreference = 'SilentlyContinue'

$Target = 'win32-x64'
$Name = "devhub-bundled-$Target"
$InstallRoot = if ($env:DEVHUB_DIR) { $env:DEVHUB_DIR } else { (Get-Location).Path }

if (-not $Url) {
  if ($Version -eq 'latest') {
    Write-Host "devhub-install: resolving latest release of $Repo ..."
    $rel = Invoke-RestMethod "https://api.github.com/repos/$Repo/releases/latest"
    $Version = $rel.tag_name
    if (-not $Version) { throw "could not resolve latest release; pass -Version portable-vX.Y.Z" }
  }
  $Url = "https://github.com/$Repo/releases/download/$Version/$Name.zip"
}

$Dest = $InstallRoot
$Bundle = Join-Path $Dest $Name
$Launcher = Join-Path $Bundle 'devhub.cmd'
if ($Version -ne 'latest') { Write-Host "devhub-install: release: $Version" }

if (($env:DEVHUB_FORCE -eq '1') -and (Test-Path $Bundle)) { Remove-Item -Recurse -Force $Bundle }

if (-not (Test-Path $Launcher)) {
  Write-Host "devhub-install: downloading $Url"
  New-Item -ItemType Directory -Force -Path $Dest | Out-Null
  $tmpZip = Join-Path $env:TEMP ("devhub-" + [System.Guid]::NewGuid().ToString('N') + '.zip')
  # Prefer curl.exe (ships with Windows 10 1803+): it streams to disk at full line speed,
  # like a browser. Fall back to Invoke-WebRequest (now with the progress bar disabled).
  $curl = Get-Command curl.exe -ErrorAction SilentlyContinue
  if ($curl) {
    & $curl.Source -fSL --retry 3 $Url -o $tmpZip
    if ($LASTEXITCODE -ne 0) { throw "download failed (curl exit $LASTEXITCODE). Check Version/Repo or that $Name.zip exists." }
  } else {
    Invoke-WebRequest -Uri $Url -OutFile $tmpZip
  }
  Write-Host "devhub-install: extracting to $Bundle"
  if (Test-Path $Bundle) { Remove-Item -Recurse -Force $Bundle }
  # Extract with .NET ZipFile. The single index.js entry is ~80 MB deflated, which trips
  # the bsdtar/libarchive build shipped with Windows ("ZIP decompression failed (-5)").
  # .NET inflates large entries reliably, and the bundled layout is shallow + few files,
  # so it has no MAX_PATH trouble. ZipFile is built-in on PowerShell 7 (.NET); on Windows
  # PowerShell 5.1 it needs the FileSystem assembly loaded first — tolerate either.
  try { Add-Type -AssemblyName System.IO.Compression.FileSystem -ErrorAction Stop } catch {}
  [System.IO.Compression.ZipFile]::ExtractToDirectory($tmpZip, $Dest)
  Remove-Item -Force $tmpZip
  # Record which release this bundle came from (the launcher prints it on start).
  Set-Content -Path (Join-Path $Bundle '.devhub-release') -Value $Version -NoNewline
}

if (-not (Test-Path $Launcher)) { throw "bundle launcher not found at $Launcher after extraction." }

# If an existing bundle was reused (no download) and the latest release is newer, hint at
# upgrading — the extracted folder name has no version, so it isn't auto-updated.
$installed = if (Test-Path (Join-Path $Bundle '.devhub-release')) { (Get-Content (Join-Path $Bundle '.devhub-release') -Raw).Trim() } else { 'unknown' }
if ($Version -ne 'latest' -and $installed -ne $Version) {
  if ($installed -eq 'unknown') {
    Write-Host "devhub-install: installed version unknown (older bundle); latest is $Version - set `$env:DEVHUB_FORCE=1 to refresh."
  } else {
    Write-Host "devhub-install: installed $installed; latest is $Version - set `$env:DEVHUB_FORCE=1 to upgrade."
  }
}

# Build pass-through args.
$devhubArgs = @()
if ($Port -gt 0) { $devhubArgs += @('--port', "$Port") }
foreach ($c in $Config) { $devhubArgs += @('--config', $c) }

Write-Host "devhub-install: starting hub from $Bundle"
& $Launcher @devhubArgs
exit $LASTEXITCODE
