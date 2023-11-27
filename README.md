# [The TIBCO Developer Hub](https://backstage.io)

The TIBCO Developer Hub is powered by the Backstage platform. See the Backstage.io documentation for more details.

## Architecture

See the [architecture overview](https://backstage.io/docs/overview/architecture-overview) in the Backstage docs.

## Pre-requisites

- NodeJs 16.x
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

## Helpful Documentation

[Docker configuration](./docker/README.md)\
[Docs](./docs/app-config-extensions.md)\
[Packages](./packages/README.md)\
[Plugins](./plugins/README.md)\
[Example Templates, Group and System](./tibco-examples/README.md)
