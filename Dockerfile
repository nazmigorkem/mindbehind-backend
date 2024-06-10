FROM node:20.12.1-alpine as ts-builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . /app
RUN pnpm install
RUN pnpm build

FROM node:20.12.1-alpine as ts-remover
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY --from=ts-builder /app/package.json /app
COPY --from=ts-builder /app/pnpm-lock.yaml /app
COPY --from=ts-builder /app/build /app/build
COPY --from=ts-builder /app/drizzle /app/drizzle
RUN pnpm install --production

FROM node:20.12.1-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY --from=ts-remover /app /app
ENV MODE="PROD"
EXPOSE 3000
WORKDIR /app
CMD pnpm prod