FROM node:20.15.1

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1


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
COPY .next/static ./.next/standalone/.next/static

EXPOSE 3001

ENV NODE_ENV production
ENV PORT 3001
CMD HOSTNAME="0.0.0.0" node .next/standalone/server.js
