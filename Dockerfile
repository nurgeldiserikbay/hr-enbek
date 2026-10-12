# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    NEXT_TELEMETRY_DISABLED=1 \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
WORKDIR /app
COPY package.json ./
RUN corepack enable && corepack install

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    HUSKY=0 pnpm install --frozen-lockfile --store-dir /pnpm/store

FROM base AS build
ARG APP_ENV
ARG NEXT_PUBLIC_SITE_URL
RUN : "${APP_ENV:?build arg APP_ENV is required: dev, test or prod}" \
      "${NEXT_PUBLIC_SITE_URL:?build arg NEXT_PUBLIC_SITE_URL is required}" \
 && case "$APP_ENV" in dev|test|prod) ;; *) echo "APP_ENV must be dev, test or prod, got: $APP_ENV" >&2; exit 1 ;; esac
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=cache,id=next-cache-${APP_ENV},target=/app/.next/cache \
    pnpm build

FROM node:${NODE_VERSION}-alpine AS runner
ARG APP_ENV
LABEL org.opencontainers.image.title="hr-enbek-frontend" \
      kz.enbek.app-env="${APP_ENV}"
RUN apk add --no-cache libc6-compat tini
WORKDIR /app
ENV APP_ENV=${APP_ENV} \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/robots.txt" > /dev/null || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
