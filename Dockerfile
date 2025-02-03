# Build Python environment in a separate builder stage
FROM cgr.dev/chainguard/python@sha256:3d576a0d94b05c0da7fba83c8dbf1d909a61a95132d3f65b409b3eb01bf18633 as python-builder

ENV PATH=/venv/bin:$PATH

RUN --mount=type=cache,target=/home/nonroot/.cache/pip,uid=65532,gid=65532 \
    python3 -m venv /home/nonroot/venv && \
    /home/nonroot/venv/bin/pip install mkdocs-techdocs-core==1.3.3 &&  \
    /home/nonroot/venv/bin/pip install setuptools

# Stage 1 - Create yarn install skeleton layer
FROM cgr.dev/chainguard/wolfi-base@sha256:2148be123cd047f10c93e2bc88010d4abba1fc56a367d6287a251099ed5f006a AS packages

WORKDIR /app
COPY package.json yarn.lock ./
COPY .yarn ./.yarn
COPY .yarnrc.yml ./


COPY packages packages

# Comment this out if you don't have any internal plugins
COPY plugins plugins

RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -exec rm -rf {} \+

FROM cgr.dev/chainguard/wolfi-base@sha256:2148be123cd047f10c93e2bc88010d4abba1fc56a367d6287a251099ed5f006a as build

ENV NODE_VERSION="18=~18.20"

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked,uid=65532,gid=65532 \
    --mount=type=cache,target=/var/lib/apk,sharing=locked,uid=65532,gid=65532 \
    apk update && \
    apk add nodejs-$NODE_VERSION yarn \
    # Install isolate-vm dependencies, these are needed by the @backstage/plugin-scaffolder-backend.
    openssl-dev brotli-dev c-ares-dev nghttp2-dev icu-dev zlib-dev gcc-12 libuv-dev build-base

WORKDIR /app
RUN chown -R nonroot:nonroot /app

RUN mkdir -p /home/nonroot/.yarn/berry && chown -R 65532:65532 /home/nonroot/.yarn/berry

USER nonroot

COPY --from=packages --chown=65532:65532  /app .
COPY --from=packages --chown=65532:65532  /app/.yarn ./.yarn
COPY --from=packages --chown=65532:65532  /app/.yarnrc.yml  ./

RUN --mount=type=cache,target=/home/nonroot/.yarn/berry/cache,sharing=locked,uid=65532,gid=65532 \
    yarn install --immutable

COPY --chown=65532:65532 . .

RUN yarn tsc
RUN yarn --cwd packages/backend build


RUN mkdir packages/backend/dist/skeleton packages/backend/dist/bundle \
    && tar xzf packages/backend/dist/skeleton.tar.gz -C packages/backend/dist/skeleton \
    && tar xzf packages/backend/dist/bundle.tar.gz -C packages/backend/dist/bundle

FROM cgr.dev/chainguard/wolfi-base@sha256:2148be123cd047f10c93e2bc88010d4abba1fc56a367d6287a251099ed5f006a as node-builder

ENV NODE_VERSION="18=~18.20"

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked,uid=65532,gid=65532 \
    --mount=type=cache,target=/var/lib/apk,sharing=locked,uid=65532,gid=65532 \
    apk update && \
    apk add nodejs-$NODE_VERSION yarn \
    # Install isolate-vm dependencies, these are needed by the @backstage/plugin-scaffolder-backend.
    openssl-dev brotli-dev c-ares-dev nghttp2-dev icu-dev zlib-dev gcc-12 libuv-dev build-base

WORKDIR /app
RUN chown -R nonroot:nonroot /app

RUN mkdir -p /home/nonroot/.yarn/berry && chown -R 65532:65532 /home/nonroot/.yarn/berry

USER nonroot

COPY --from=build --chown=65532:65532  /app/.yarn ./.yarn
COPY --from=build --chown=65532:65532  /app/.yarnrc.yml  ./

COPY --from=build --chown=65532:65532 /app/yarn.lock /app/package.json /app/packages/backend/dist/skeleton/ ./

RUN --mount=type=cache,target=/home/nonroot/.yarn/berry/cache,sharing=locked,uid=65532,gid=65532 \
    yarn workspaces focus --all --production && yarn cache clean --all

FROM --platform=linux/amd64 cgr.dev/chainguard/wolfi-base@sha256:2148be123cd047f10c93e2bc88010d4abba1fc56a367d6287a251099ed5f006a

ENV PYTHON_VERSION="3.12=~3.12"
ENV NODE_VERSION="18=~18.20"
ENV NODE_ENV=production

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked,uid=65532,gid=65532 \
    --mount=type=cache,target=/var/lib/apk,sharing=locked,uid=65532,gid=65532 \
    apk update && \
    apk add \
    # add node for backstage
    nodejs-$NODE_VERSION \
    # add python for backstage techdocs
    python-$PYTHON_VERSION \
    # add tini for init process
    tini

WORKDIR /app

COPY package.json app-config.yaml app-config.production.yaml ./
# Copy license file
COPY LICENSE.TXT /opt/tibco/license/

RUN chown -R 65532:65532 /app
RUN chown -R 65532:65532 /tmp
USER 65532:65532

COPY --from=build --chown=65532:65532 /app/packages/backend/dist/bundle/ ./
COPY --from=node-builder --chown=65532:65532 /app/node_modules ./node_modules
COPY --from=python-builder --chown=65532:65532 /home/nonroot/venv /home/nonroot/venv
ENV PATH=/home/nonroot/venv/bin:$PATH

ENV GIT_PYTHON_REFRESH="quiet"

ENTRYPOINT ["tini", "--"]

CMD ["node", "packages/backend", "--config", "app-config.production.yaml"]
