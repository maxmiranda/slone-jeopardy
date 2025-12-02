FROM node:24-slim AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build client assets
RUN npm run buildReact

FROM node:24-slim
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8083
ENV NODE_OPTIONS=--experimental-strip-types

# Install runtime deps only
COPY package*.json ./
RUN npm ci --omit=dev

# Bring over built assets and server code
COPY --from=builder /app/build ./build
COPY server ./server
COPY words ./words
COPY global.d.ts ./global.d.ts
COPY jeopardy.json.gz ./jeopardy.json.gz
COPY public ./public
COPY index.html ./index.html
COPY vite.config.ts ./vite.config.ts

# For Docker metadata
EXPOSE 8083

CMD ["node", "server/server.ts"]
