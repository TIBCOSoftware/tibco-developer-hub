# This dockerfile builds an image for the backend package.
# It should be executed with the root of the repo as docker context.
#
# Before building this image, be sure to have run the following commands in the repo root:
#
# yarn install
# yarn tsc
# yarn build
#
# Once the commands have been run, you can build the image using `yarn build-image`

# FROM --platform=linux/amd64  node:16-bullseye-slim
FROM --platform=linux/amd64  node:18-bookworm-slim

WORKDIR /app


#Install pip3, python, and mkdocs
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends python3 g++ build-essential python3-pip && \
    yarn config set python /usr/bin/python3

RUN pip3 install mkdocs-techdocs-core==1.1.7 --break-system-packages

# Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
# in which case you should also move better-sqlite3 to "devDependencies" in package.json.
#RUN apt-get update && \
#    apt-get install -y --no-install-recommends libsqlite3-dev python3 build-essential python3-pip && \
#    rm -rf /var/lib/apt/lists/* && \
#    yarn config set python /usr/bin/python3 && \
#    pip3 install mkdocs-techdocs-core==1.1.7

# Run techdocs in the container
# RUN apt-get update && apt-get install -y python3 python3-pip
# RUN pip3 install mkdocs-techdocs-core==1.1.7
# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
COPY yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"

# Then copy the rest of the backend bundle, along with any other files we might want.
COPY packages/backend/dist/bundle.tar.gz app-config*.yaml ./
# COPY packages/backend/dist/bundle.tar.gz app-config.production.yaml app-config-from-configmap.yaml ./
# ADD template-example /app/template-example
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
# CMD ["node", "packages/backend", "--config", "app-config.production.yaml", "--config", "app-config-from-configmap.yaml"]

## Stage 1 - Create yarn install skeleton layer
#FROM --platform=$BUILDPLATFORM node:18-bookworm-slim AS packages
#
#WORKDIR /app
#COPY package.json yarn.lock ./
#
#COPY packages packages
#
## Comment this out if you don't have any internal plugins
#COPY plugins plugins
#
#RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -exec rm -rf {} \+
#
## Stage 2 - Install dependencies and build packages
#FROM --platform=$BUILDPLATFORM node:18-bookworm-slim AS build
#
#RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
#    --mount=type=cache,target=/var/lib/apt,sharing=locked \
#    apt-get update && \
#    apt-get install -y --no-install-recommends python3 g++ build-essential && \
#    yarn config set python /usr/bin/python3
#
#USER node
#WORKDIR /app
#
## COPY --from=packages --chown=node:node /app .
#
## Stop cypress from downloading it's massive binary.
#ENV CYPRESS_INSTALL_BINARY=0
#RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
#    yarn install --frozen-lockfile --network-timeout 600000
#
#COPY --chown=node:node . .
#
#RUN yarn tsc
#RUN yarn --cwd packages/backend build
## If you have not yet migrated to package roles, use the following command instead:
## RUN yarn --cwd packages/backend backstage-cli backend:bundle --build-dependencies
#
#RUN mkdir packages/backend/dist/skeleton packages/backend/dist/bundle \
#    && tar xzf packages/backend/dist/skeleton.tar.gz -C packages/backend/dist/skeleton \
#    && tar xzf packages/backend/dist/bundle.tar.gz -C packages/backend/dist/bundle
#
## Stage 3 - Build the actual backend image and install production dependencies
#FROM --platform=$TARGETPLATFORM node:18-bookworm-slim
#
## Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
## in which case you should also move better-sqlite3 to "devDependencies" in package.json.
## RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
##     --mount=type=cache,target=/var/lib/apt,sharing=locked \
##     apt-get update && \
##     apt-get install -y --no-install-recommends libsqlite3-dev python3 build-essential && \
##     yarn config set python /usr/bin/python3
#
##Install pip3, python, and mkdocs
#RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
#    --mount=type=cache,target=/var/lib/apt,sharing=locked \
#    apt-get update && \
#    apt-get install -y --no-install-recommends python3 g++ build-essential python3-pip && \
#    yarn config set python /usr/bin/python3
#
#RUN pip3 install mkdocs-techdocs-core==1.1.7 --break-system-packages
#
## From here on we use the least-privileged `node` user to run the backend.
#USER node
#
## This should create the app dir as `node`.
## If it is instead created as `root` then the `tar` command below will fail: `can't create directory 'packages/': Permission denied`.
## If this occurs, then ensure BuildKit is enabled (`DOCKER_BUILDKIT=1`) so the app dir is correctly created as `node`.
#WORKDIR /app
#
## Copy the install dependencies from the build stage and context
#COPY --from=build --chown=node:node /app/yarn.lock /app/package.json /app/packages/backend/dist/skeleton/ ./
#
#RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
#    yarn install --frozen-lockfile --production --network-timeout 600000
#
## Copy the built packages from the build stage
#COPY --from=build --chown=node:node /app/packages/backend/dist/bundle/ ./
#
## Copy any other files that we need at runtime
#COPY --chown=node:node app-config.yaml app-config.production.yaml app-config-from-configmap.yaml ./
#
##COPY packages/backend/dist/bundle.tar.gz app-config.production.yaml app-config-from-configmap.yaml ./
#
## Copy license file
#COPY --chown=node:node LICENSE.TXT /opt/tibco/license/
#
## This switches many Node.js dependencies to production mode.
#ENV NODE_ENV production
#ENV HUB_CONFIGFILE "app-config.production.yaml"
#
#ARG BID
#ENV APP_CONFIG_app_buildVersion="${BID}"
#
##CMD node packages/backend --config "${HUB_CONFIGFILE}"
#CMD ["node", "packages/backend", "--config", "${HUB_CONFIGFILE}", "--config", "app-config-from-configmap.yaml"]
