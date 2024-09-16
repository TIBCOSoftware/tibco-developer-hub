# Stage 1 - Create yarn install skeleton layer
FROM node:18.20-alpine3.19 AS packages

WORKDIR /app
COPY package.json yarn.lock ./

COPY packages packages

# Comment this out if you don't have any internal plugins
COPY plugins plugins

RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -exec rm -rf {} \+

# Stage 2 - Install dependencies and build packages
FROM node:18.20-alpine3.19 AS build

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
    --mount=type=cache,target=/var/lib/apk,sharing=locked \
    apk update && \
    apk add python3 g++ make && \
    yarn config set python /usr/bin/python3

USER node
WORKDIR /app

COPY --from=packages --chown=node:node /app .

RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn install --frozen-lockfile --network-timeout 600000

COPY --chown=node:node . .

RUN yarn tsc
RUN yarn --cwd packages/backend build
# If you have not yet migrated to package roles, use the following command instead:
# RUN yarn --cwd packages/backend backstage-cli backend:bundle --build-dependencies

RUN mkdir packages/backend/dist/skeleton packages/backend/dist/bundle \
    && tar xzf packages/backend/dist/skeleton.tar.gz -C packages/backend/dist/skeleton \
    && tar xzf packages/backend/dist/bundle.tar.gz -C packages/backend/dist/bundle

# Stage 3 - Build the actual backend image and install production dependencies
FROM --platform=linux/amd64 chainguard/wolfi-base

ENV NODE_VERSION 18=~18.20
ENV PYTHON_VERSION 3.12=~3.12

RUN apk update && apk add nodejs-$NODE_VERSION yarn

# Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
# in which case you should also move better-sqlite3 to "devDependencies" in package.json.
# Additionally, we install dependencies for `techdocs.generator.runIn: local`.
# https://backstage.io/docs/features/techdocs/getting-started#disabling-docker-in-docker-situation-optional
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
    --mount=type=cache,target=/var/lib/apk,sharing=locked \
    apk update && \
    apk add python-$PYTHON_VERSION make py3-pip python-3-dev py3-setuptools build-base gcc libffi-dev glibc-dev openssl-dev brotli-dev c-ares-dev nghttp2-dev icu-dev zlib-dev gcc-12 libuv-dev && \
    yarn config set python /usr/bin/python3

# Set up a virtual environment for mkdocs-techdocs-core.
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN pip3 install setuptools

RUN pip3 install mkdocs-techdocs-core==1.3.3

WORKDIR /app
# Copy the install dependencies from the build stage and context
COPY --from=build /app/yarn.lock /app/package.json /app/packages/backend/dist/skeleton/ ./

RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn install --frozen-lockfile --production --network-timeout 600000

# Copy the built packages from the build stage
COPY --from=build /app/packages/backend/dist/bundle/ ./

# Copy any other files that we need at runtime
COPY app-config.yaml app-config.production.yaml ./

# Copy license file
COPY LICENSE.TXT /opt/tibco/license/

# This switches many Node.js dependencies to production mode.
ENV NODE_ENV production
ENV HUB_CONFIGFILE "app-config.production.yaml"

ARG BID
ENV APP_CONFIG_app_buildVersion="${BID}"

RUN chmod -R 777 /app/node_modules/@backstage/plugin-techdocs-backend

CMD node packages/backend --config "${HUB_CONFIGFILE}"