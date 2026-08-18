# Stage 1 - Create yarn install skeleton layer
FROM alpine:3.24.1 AS packages

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
FROM alpine:3.24.1 as build

RUN addgroup -g 65532 -S nonroot && adduser -u 65532 -S -G nonroot nonroot

ENV NODE_VERSION="24.18.1-r0"

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked,uid=65532,gid=65532 \
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

COPY --chown=65532:65532 . .

RUN yarn test:all
RUN yarn tsc
RUN yarn --cwd packages/backend build


RUN mkdir packages/backend/dist/skeleton packages/backend/dist/bundle \
    && tar xzf packages/backend/dist/skeleton.tar.gz -C packages/backend/dist/skeleton \
    && tar xzf packages/backend/dist/bundle.tar.gz -C packages/backend/dist/bundle

# Stage 3 - Node builder layer
FROM alpine:3.24.1 as node-builder

RUN addgroup -g 65532 -S nonroot && adduser -u 65532 -S -G nonroot nonroot

ENV NODE_VERSION="24.18.1-r0"
ENV NODE_ENV=production

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked,uid=65532,gid=65532 \
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
FROM alpine:3.24.1

RUN addgroup -g 65532 -S nonroot && adduser -u 65532 -S -G nonroot nonroot

ENV PYTHON_VERSION="~3.14"
ENV NODE_VERSION="24.18.1-r0"
ENV NODE_ENV=production
ENV PYTHON=/usr/bin/python3

RUN apk upgrade --no-cache

RUN --mount=type=cache,target=/var/cache/apk,sharing=locked,uid=65532,gid=65532 \
    apk update && \
    apk --no-cache add git \
    nodejs=$NODE_VERSION \
    python3=$PYTHON_VERSION py3-pip \
    tini

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip3 install --upgrade pip
RUN pip3 install mkdocs-techdocs-core==1.7.0
# 1.7.0 already resolves Pygments 2.20.0 and pymdown-extensions 10.21.3; these
# floors keep the CVE fixes explicit and guard against transitive resolver drift:
#   pygments            CVE-2026-4539  (-> >=2.20.0)
#   pymdown-extensions  CVE-2026-46338 (-> >=10.21.3)
# ACCEPTED RISK — pymdown-extensions CVE-2026-61632 (MEDIUM) and CVE-2026-67422
# (HIGH) are both fixed only in 11.x, but mkdocs-techdocs-core==1.7.0 (latest)
# hard-pins pymdown-extensions==10.21.3 (and mkdocs-material==9.7.6). Forcing 11.x
# would break techdocs-core's pin and risk techdocs rendering (11.0 was a major
# API bump). Deferred until techdocs-core ships a release that allows 11.x.
RUN pip3 install 'pygments>=2.20.0' 'pymdown-extensions>=10.21.3'
# Patched setuptools (CVE-2025-47273, CVE-2026-59890); kept for mkdocs/pkg_resources.
RUN pip3 install 'setuptools>=78.1.1'

# pip is only needed at build time to populate the venv — techdocs runs the
# `mkdocs` CLI at runtime (builder/generator: local), not pip. pip's vendored
# deps (msgpack, setuptools in pip/_vendor/bom.cdx.json) trip the image scanner
# even though they are unreachable. Remove pip from BOTH places: the venv copy
# (pip3 uninstall) AND the system copy owned by the py3-pip APK package, which
# lives at /usr/lib/pythonX.Y/site-packages/pip and carries pip/_vendor. Also
# drop ensurepip's bundled wheels and purge caches. rm -rf is a backstop in
# case apk's DB does not track the files.
RUN pip3 cache purge || true; \
    pip3 uninstall -y pip || true; \
    apk del py3-pip || true; \
    rm -rf /usr/lib/python*/site-packages/pip \
           /usr/lib/python*/ensurepip \
           "$VIRTUAL_ENV"/lib/python*/site-packages/pip

WORKDIR /app

COPY package.json app-config.yaml app-config.production.yaml ./
# Copy license file
COPY LICENSE.TXT /opt/tibco/license/

RUN chown -R 65532:65532 /app
RUN chown -R 65532:65532 /tmp
USER 65532:65532

COPY --from=build --chown=65532:65532 /app/packages/backend/dist/bundle/ ./
COPY --from=build --chown=65532:65532 /app/coverage/ ./coverage
COPY --from=build --chown=65532:65532 /app/test-report.xml ./
COPY --from=node-builder --chown=65532:65532 /app/node_modules ./node_modules

# This disables node snapshot for Node 20 to work with the Scaffolder
ENV NODE_OPTIONS="--no-node-snapshot"
ENV GIT_PYTHON_REFRESH="quiet"

ENTRYPOINT ["tini", "--"]

CMD ["node", "packages/backend", "--config", "app-config.production.yaml"]
