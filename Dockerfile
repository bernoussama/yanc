# COPY pnpm-lock.yaml pnpm-lock.yaml
# Production image, copy all the files and run next
FROM node:23.3.0-slim
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV=production
ENV DOCKER=true

ARG TMDB_API_KEY
ENV TMDB_API_KEY=$TMDB_API_KEY
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

COPY public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY .next/standalone ./
COPY .next/static ./.next/static

COPY ./scripts/run.sh ./scripts/run.sh

RUN chmod +x ./scripts/run.sh
# copy env file
# COPY .env .env


EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT} || exit 1

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["sh", "./scripts/run.sh"]
