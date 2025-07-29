# The TIBCO® Developer Hub

The TIBCO® Developer Hub is powered by the Backstage platform. See the Backstage.io documentation for more details.

## Architecture

See the [architecture overview](https://backstage.io/docs/overview/architecture-overview) in the Backstage docs.

## Pre-requisites

- NodeJs 20.x
- yarn 1.22.19
- Docker (with docker compose) -- to run the database

## Getting started

### Database

We've included a docker-compose file to make it simpler to start the database.

In a terminal, go to the `docker` folder and run:

```sh
# cd docker
docker compose up -d
```

> Tip: the docker compose command will also start the [Adminer](https://www.adminer.org) database UI in port `:8080`.
> If for some reason you want to skip the adminer service, run `docker compose up -d db`

Stop the database services without deleting their data:

```sh
# cd docker
docker compose stop
```

Stop the database services and delete their data:

```sh
# cd docker
docker compose down
```

You can alternatively set up your own Postgres database instance. You will need to update the connection details
in the `app-config.local.yaml` under `backend.database.connection`.

### Install dependencies

```sh
yarn install
```

### Setup local environment files

Create a copy the file [`./app-config.template-local.yaml`](./app-config.template-local.yaml) and rename it `app-config.local.yaml`.

Update the contents of the newly created `app-config.local.yaml` to suit your local configuration.

The application will load the `app-config.local.yaml`, overriding the configuration in [`app-config.yaml`](./app-config.yaml).
The `app-config.local.yaml` file is ignored by git, so it's safe to input tokens, passwords, or any other secret values without
risk of committing the file by mistake.

### Run backend and frontend

You can run start both backend and frontend at once by running:

```sh
yarn dev
```

When the command finishes running, it should open up a browser window displaying your app. If not, you can open a browser and directly navigate to the frontend at http://localhost:3000/tibco/hub .

For development purposes it might be more convenient to start the backend and the frontend server in different terminals.
This way you can restart each one independently and the most importantly, makes it easier to read the log outputs and
identify where the logs are coming from.

Start the backend server

```sh
yarn start-backend
```

Start the frontend server

```sh
yarn start
```

### Use of .env.yarn file to load environment variables

To start TIBCO® Developer Hub with predefined environment variables, create a .env.yarn file under root of the project directory.

You can define the environment variables in this file by following the blow format.

Example:

File name: .env.yarn

```
DOC_URL="https://docs.tibco.com/go/platform-cp/1.9.0/doc/html#cshid=developer_hub_overview"
GITHUB_TOKEN=xxxxxxxxxx
```

### Steps to build

```sh
docker build -t <customImageName:customImageTag> .
```

## Helpful Documentation

[Docker configuration](./docker/README.md)\
[Docs](./docs/app-config-extensions.md)\
[Packages](./packages/README.md)\
[Plugins](./plugins/README.md)\
[Example Templates, Group and System](https://github.com/TIBCOSoftware/tibco-developer-hub/tree/main/tibco-examples/README.md)

## Compatability Matrix

| TIBCO Developer Hub Version | Minimum TIBCO Platform Version |
| --------------------------- |--------------------------------|
| 1.9.0                       | 1.9.0                          |
| 1.8.0                       | 1.8.0                          |
| 1.7.0                       | 1.7.0                          |
| 1.6.0                       | 1.6.0                          |
| 1.5.1                       | 1.4.0                          |
| 1.5.0                       | 1.4.0                          |
| 1.4.0                       | 1.4.0                          |
| 1.3.2                       | 1.3.0                          |
| 1.3.1                       | 1.3.0                          |
| 1.3.0                       | 1.3.0                          |
| 1.2.2                       | 1.2.0                          |
| 1.2.1                       | 1.2.0                          |
| 1.2.0                       | 1.2.0                          |
| 1.1.0                       | 1.1.0                          |
| 1.0.1                       | 1.0.0                          |
| 1.0.0                       | 1.0.0                          |

**Note:** The TIBCO Hosted Control Plane (SaaS) is always on the latest version, it is recommended to use the compatible version of the TIBCO Developer Hub with that. It is not supported to deploy older versions of the TIBCO Developer Hub to newer minor versions of the platform.

## Licenses

This project (TIBCO® Developer Hub) is licensed under the [Apache 2.0 License](LICENSE.TXT).

### Other Software

When you use some of the TIBCO® Developer Hub, you fetch and use other charts that might fetch other container images, each with its own licenses.

A partial summary of the third party software and licenses used in this project is available [here](./docs/third-party-software-licenses.txt).

---

Copyright 2024 Cloud Software Group, Inc.

License. This project is Licensed under the Apache License, Version 2.0 (the "License").
You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
