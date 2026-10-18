# ---- Etapa 1: build ----
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ---- Etapa 2: producción ----
FROM nginx:alpine AS production

# Usuario no-root para correr nginx
RUN adduser -D -H -u 1000 -s /sbin/nologin webuser

RUN mkdir -p /app/www

# Assets built
COPY --from=build /app/dist /app/www

# Template de config de nginx (se procesa con envsubst automáticamente
# por el entrypoint oficial de la imagen nginx al arrancar)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Script que genera env-config.js a partir del template al arrancar
COPY docker-entrypoint-env.sh /docker-entrypoint.d/50-env-config.sh
RUN chmod +x /docker-entrypoint.d/50-env-config.sh

# Permisos: solo lo necesario
RUN chown -R webuser:webuser /app/www && \
    chmod -R 755 /app/www && \
    chown -R webuser:webuser /var/cache/nginx && \
    chown -R webuser:webuser /var/log/nginx && \
    chown -R webuser:webuser /etc/nginx/conf.d && \
    chown -R webuser:webuser /etc/nginx/templates && \
    touch /var/run/nginx.pid && \
    chown -R webuser:webuser /var/run/nginx.pid

EXPOSE 80

ENV NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/templates
ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
ENV PORT=80
ENV SERVER_NAME=techfix
ENV NGINX_LOG_LEVEL=warn

USER webuser

CMD ["nginx", "-g", "daemon off;"]