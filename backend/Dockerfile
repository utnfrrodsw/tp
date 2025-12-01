###############################################################
# Dockerfile para backend Node.js/TypeScript
# Construye y prepara la app para producción en Fly.io
#
# FASE 1: Build (compilación de TypeScript a JavaScript)
###############################################################

########################################
# Etapa de build: compila TypeScript   #
########################################
FROM node:20-alpine AS build
WORKDIR /app
# Instalar dependencias con npm
COPY package.json ./
RUN npm install --legacy-peer-deps=true --auto-install-peers=true
# Copiar código y compilar
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

###############################################################
# FASE 2: Producción (solo ejecuta el código compilado)
###############################################################

# Etapa de producción: solo artefactos
FROM node:20-alpine
# Directorio de trabajo
WORKDIR /app                          
# Modo producción
ENV NODE_ENV=production               
# Copiar dist y node_modules desde build
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
# Expone el puerto 8080 (Fly.io lo usará)
EXPOSE 8080                           
# Comando para iniciar la app
CMD ["node","dist/app.js"]