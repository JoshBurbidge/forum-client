FROM node:20.15.1 AS base

FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# USER nodedoke

COPY components ./components
COPY pages ./pages
COPY public ./public
COPY styles ./styles
COPY next.config.js ./
COPY .env* ./
RUN npm run build
# COPY .next/static ./.next/standalone/.next/static

FROM base AS runner

WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001
ENV PORT 3001
CMD HOSTNAME="0.0.0.0" node server.js
