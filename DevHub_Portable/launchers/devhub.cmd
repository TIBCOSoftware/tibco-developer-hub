@echo off
REM DevHub Portable launcher (Windows).
REM Starts the self-contained TIBCO Developer Hub (frontend + backend in one process).
REM
REM   devhub.cmd                        start on http://localhost:7007
REM   devhub.cmd --port 8088            start on a custom port
REM   devhub.cmd --config .\my.yaml     layer an extra app-config (repeatable)
setlocal enabledelayedexpansion

set "HERE=%~dp0"
REM strip trailing backslash
if "%HERE:~-1%"=="\" set "HERE=%HERE:~0,-1%"

REM Track whether the port was chosen deliberately (env or --port). If so we won't
REM silently move it; if it's the default we fall back to a free port when busy.
if defined DEVHUB_PORT (set "PORT_EXPLICIT=1") else (set "PORT_EXPLICIT=0" & set "DEVHUB_PORT=7007")
set "EXTRA_CONFIGS="

:parse
if "%~1"=="" goto run
if /i "%~1"=="--port" (
  set "DEVHUB_PORT=%~2"
  set "PORT_EXPLICIT=1"
  shift & shift & goto parse
)
if /i "%~1"=="--config" (
  set "EXTRA_CONFIGS=!EXTRA_CONFIGS! --config "%~2""
  shift & shift & goto parse
)
if /i "%~1"=="-h"     goto help
if /i "%~1"=="--help" goto help
echo devhub: unknown argument '%~1' (try --help) 1>&2
exit /b 1

:help
echo Usage: devhub.cmd [--port N] [--config path ...]
exit /b 0

:run
REM Required for the Scaffolder's isolated-vm to work.
if not defined NODE_OPTIONS set "NODE_OPTIONS=--no-node-snapshot"
if not defined NODE_ENV set "NODE_ENV=production"
if not defined GIT_PYTHON_REFRESH set "GIT_PYTHON_REFRESH=quiet"
if not defined DEVHUB_DATA_DIR set "DEVHUB_DATA_DIR=%HERE%\data"
REM Safe defaults so config env-substitution never fails.
if not defined GITHUB_TOKEN set "GITHUB_TOKEN="
if not defined DOC_URL set "DOC_URL=https://docs.tibco.com/go/platform-cp/latest/doc/html#cshid=developer_hub_overview"

REM If a GitHub token is provided, feed it into the github integration so the example
REM catalog loads without anonymous rate limits.
if not "%GITHUB_TOKEN%"=="" set "APP_CONFIG_integrations_github_0_token=%GITHUB_TOKEN%"

if not exist "%DEVHUB_DATA_DIR%" mkdir "%DEVHUB_DATA_DIR%"

set "NODE_BIN=%HERE%\node\node.exe"
if not exist "%NODE_BIN%" (
  echo devhub: bundled Node runtime not found at %NODE_BIN% 1>&2
  exit /b 1
)

REM Resolve a usable port: fall back to a free one if the default is busy; if the
REM user picked the port (env/--port) and it's busy, fail clearly.
if exist "%HERE%\find-free-port.cjs" (
  set "CHOSENPORT="
  for /f "usebackq delims=" %%i in (`""%NODE_BIN%" "%HERE%\find-free-port.cjs" %DEVHUB_PORT% %PORT_EXPLICIT%"`) do set "CHOSENPORT=%%i"
  if not defined CHOSENPORT (
    if "%PORT_EXPLICIT%"=="1" (
      echo devhub: port %DEVHUB_PORT% is already in use. Free it or pick another with --port. 1>&2
    ) else (
      echo devhub: no free port found near %DEVHUB_PORT%. 1>&2
    )
    exit /b 1
  )
  if not "!CHOSENPORT!"=="%DEVHUB_PORT%" echo Port %DEVHUB_PORT% is in use - starting on !CHOSENPORT! instead. 1>&2
  set "DEVHUB_PORT=!CHOSENPORT!"
)

set "DEVHUB_RELEASE=local build"
if exist "%HERE%\.devhub-release" set /p DEVHUB_RELEASE=<"%HERE%\.devhub-release"
echo Starting TIBCO Developer Hub (portable)
echo   Version: %DEVHUB_RELEASE%
echo   URL:     http://localhost:%DEVHUB_PORT%
echo   Data:    %DEVHUB_DATA_DIR%
echo.

REM Entry point: single-file esbuild bundle (index.js) if present, else folder bundle.
if exist "%HERE%\index.js" (
  set "ENTRY=%HERE%\index.js"
) else (
  set "ENTRY=%HERE%\packages\backend"
)

"%NODE_BIN%" "%ENTRY%" --config "%HERE%\app-config.portable.yaml"!EXTRA_CONFIGS!
exit /b %errorlevel%
