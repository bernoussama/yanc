# syntax=docker.io/docker/dockerfile:1

FROM --platform=$BUILDPLATFORM node:23-alpine AS base

# Install dependencies only when needed
FROM --platform=$BUILDPLATFORM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM --platform=$BUILDPLATFORM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1
# ENV NEXT_PRIVATE_STANDALONE=true
ENV DOCKER=true

ARG TARGETARCH
ARG TMDB_API_KEY
ENV TMDB_API_KEY=$TMDB_API_KEY
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM node:23.3.0-slim
WORKDIR /app

ENV NODE_ENV=production
ENV DOCKER=true

ARG TMDB_API_KEY
ENV TMDB_API_KEY=$TMDB_API_KEY
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

COPY /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY  /app/.next/standalone ./
COPY  /app/.next/static ./.next/static
COPY ./scripts/run.sh ./scripts/run.sh
RUN chmod +x ./scripts/run.sh
# copy env file
# COPY .env .env

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT} || exit 1

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["sh", "./scripts/run.sh"]
