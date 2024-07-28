FROM node:20.15.1 AS base

FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY components ./components
COPY pages ./pages
COPY utils ./utils
COPY public ./public
COPY styles ./styles
COPY next.config.js ./
COPY .env* ./
RUN npm run build

FROM base AS runner

WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED=1

# RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs .next

COPY --from=builder --chown=nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001
ENV PORT 3001
CMD HOSTNAME="0.0.0.0" node server.js
