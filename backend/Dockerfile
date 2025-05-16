FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile
RUN pnpm exec prisma generate
RUN pnpm run build

# ----------- Final Runner Stage ----------- #
FROM node:18-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY ./prisma ./prisma

RUN pnpm install --frozen-lockfile --prod

EXPOSE 4014

CMD pnpm exec prisma migrate deploy && pnpm start:prod