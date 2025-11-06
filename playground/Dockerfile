# Stage 1 - Create yarn install skeleton layer
FROM alpine:3.22.2 AS packages

WORKDIR /app
COPY package.json yarn.lock ./
COPY .yarn ./.yarn
COPY .yarnrc.yml ./
COPY backstage.json ./

COPY packages packages

# Comment this out if you don't have any internal plugins
COPY plugins plugins

RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -exec rm -rf {} \+

# Stage 2 - Build layer
FROM alpine:3.22.2 as build

RUN addgroup -g 65532 -S nonroot && adduser -u 65532 -S -G nonroot nonroot

ENV NODE_VERSION="22.16.0-r2"

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked,uid=65532,gid=65532 \
    --mount=type=cache,target=/var/lib/apk,sharing=locked,uid=65532,gid=65532 \
    apk update && \
    apk add --no-cache nodejs=$NODE_VERSION yarn \
    cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev build-base

WORKDIR /app
RUN chown -R nonroot:nonroot /app

RUN mkdir -p /home/nonroot/.yarn/berry && chown -R 65532:65532 /home/nonroot/.yarn/berry

USER nonroot

COPY --from=packages --chown=65532:65532  /app .
COPY --from=packages --chown=65532:65532  /app/.yarn ./.yarn
COPY --from=packages --chown=65532:65532  /app/.yarnrc.yml ./
COPY --from=packages --chown=65532:65532  /app/backstage.json ./

RUN --mount=type=cache,target=/home/nonroot/.yarn/berry/cache,sharing=locked,uid=65532,gid=65532 \
    yarn install --immutable

COPY --chown=65532:65532 ../build/playground .

RUN yarn tsc
RUN yarn --cwd packages/backend build


RUN mkdir packages/backend/dist/skeleton packages/backend/dist/bundle \
    && tar xzf packages/backend/dist/skeleton.tar.gz -C packages/backend/dist/skeleton \
    && tar xzf packages/backend/dist/bundle.tar.gz -C packages/backend/dist/bundle

# Stage 3 - Node builder layer
FROM alpine:3.22.2 as node-builder

RUN addgroup -g 65532 -S nonroot && adduser -u 65532 -S -G nonroot nonroot

ENV NODE_VERSION="22.16.0-r2"
ENV NODE_ENV=production

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked,uid=65532,gid=65532 \
    --mount=type=cache,target=/var/lib/apk,sharing=locked,uid=65532,gid=65532 \
    apk update && \
    apk add --no-cache nodejs=$NODE_VERSION yarn \
    cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev build-base

WORKDIR /app
RUN chown -R nonroot:nonroot /app

RUN mkdir -p /home/nonroot/.yarn/berry && chown -R 65532:65532 /home/nonroot/.yarn/berry

USER nonroot

COPY --from=build --chown=65532:65532  /app/.yarn ./.yarn
COPY --from=build --chown=65532:65532  /app/.yarnrc.yml ./
COPY --from=build --chown=65532:65532  /app/backstage.json ./

COPY --from=build --chown=65532:65532 /app/yarn.lock /app/package.json /app/packages/backend/dist/skeleton/ ./

RUN --mount=type=cache,target=/home/nonroot/.yarn/berry/cache,sharing=locked,uid=65532,gid=65532 \
    yarn workspaces focus --all --production && yarn cache clean --all

# Stage 4 - Final layer
FROM --platform=linux/amd64 alpine:3.22.2

RUN addgroup -g 65532 -S nonroot && adduser -u 65532 -S -G nonroot nonroot

ENV PYTHON_VERSION="~3.12"
ENV NODE_VERSION="22.16.0-r2"
ENV NODE_ENV=production
ENV PYTHON=/usr/bin/python3

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked,uid=65532,gid=65532 \
    --mount=type=cache,target=/var/lib/apk,sharing=locked,uid=65532,gid=65532 \
    apk update && \
    apk --no-cache add git \
    nodejs=$NODE_VERSION \
    python3=$PYTHON_VERSION py3-pip \
    tini

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip3 install mkdocs-techdocs-core==1.6.0
RUN pip3 install setuptools

WORKDIR /app

COPY package.json app-config.yaml app-config.production.yaml ./
# Copy license file
COPY LICENSE.TXT /opt/tibco/license/

RUN chown -R 65532:65532 /app
RUN chown -R 65532:65532 /tmp
USER 65532:65532

COPY --from=build --chown=65532:65532 /app/packages/backend/dist/bundle/ ./
COPY --from=node-builder --chown=65532:65532 /app/node_modules ./node_modules

# This disables node snapshot for Node 20 to work with the Scaffolder
ENV NODE_OPTIONS="--no-node-snapshot"
ENV GIT_PYTHON_REFRESH="quiet"

ENTRYPOINT ["tini", "--"]

CMD ["node", "packages/backend", "--config", "app-config.playground.yaml"]
