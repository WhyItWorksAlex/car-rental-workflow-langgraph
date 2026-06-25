# Runs TypeScript via tsx (same as npm run dev:request). See README → Docker.
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer cache when only source changes)
COPY package.json package-lock.json ./
RUN npm ci

# Placeholder secrets (safe to ship). Real key: create .env on the host (not in the image).
COPY .env.example ./.env.example
COPY tsconfig.json ./
COPY request.json ./
COPY src ./src

# Default: process request.json (override in docker compose later)
CMD ["npm", "run", "dev:request"]
