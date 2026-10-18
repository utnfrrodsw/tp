# syntax=docker/dockerfile:1

# Base: pnpm habilitado vía corepack
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# deps: instala TODAS las dependencias (para poder compilar)
FROM base AS deps
RUN apk add --no-cache python3 make g++
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# build: compila TypeScript y genera el client de Prisma
FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src
RUN pnpm exec prisma generate
RUN pnpm run build
RUN find src -name "*.so.node" | while read f; do \
      dest="dist${f#src}"; \
      mkdir -p "$(dirname "$dest")"; \
      cp "$f" "$dest"; \
    done

# prod-deps: solo dependencias de producción + prisma client
FROM base AS prod-deps
RUN apk add --no-cache python3 make g++
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --prod --frozen-lockfile
COPY prisma ./prisma
RUN pnpm exec prisma generate

# runner: imagen final, liviana y sin herramientas de build
FROM node:22-alpine AS runner
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup -S nodejs && adduser -S expressjs -G nodejs

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/prisma ./prisma
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh && chown -R expressjs:nodejs /app

USER expressjs

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]