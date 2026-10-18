# Instalación y configuración

## Requisitos

- Node.js 20 o superior.
- pnpm (Corepack recomendado).
- MySQL 8 o superior, local o accesible por red.
- Git.

Docker y Docker Compose son opcionales. La configuración de Compose requiere completar todas las variables que valida el backend; para una primera ejecución local se recomienda seguir los pasos por separado.

## Clonar e instalar

```bash
git clone https://github.com/Matias-rego/TP-DS-Isaac-Rego-Vigistain.git
cd TP-DS-Isaac-Rego-Vigistain

cd server
pnpm install
cd ../frontend
pnpm install
```

## Base de datos

Crear una base MySQL para el proyecto y configurar `server/.env` tomando como referencia `server/.env.example`. `DATABASE_URL` debe apuntar a la misma base indicada por las variables `DB_*`.

```env
DATABASE_URL="mysql://USUARIO:CONTRASENA@localhost:3306/NOMBRE_DB"
DB_HOST=localhost
DB_PORT=3306
DB_USER=USUARIO
DB_PASSWORD=CONTRASENA
DB_DATABASE=NOMBRE_DB
DB_ROOT_PASSWORD=CONTRASENA_ROOT
```

Aplicar las migraciones y generar el cliente Prisma desde `server/`:

```bash
pnpm exec prisma migrate deploy
pnpm exec prisma generate
```

Para un entorno de desarrollo en el que se deban crear migraciones nuevas, usar `pnpm exec prisma migrate dev` en lugar de `migrate deploy`.

## Variables de entorno del backend

Además de las variables de base de datos, completar en `server/.env`:

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=una-clave-larga-y-aleatoria
EMAIL_HOST=servidor-smtp
EMAIL_USER=usuario-de-correo
EMAIL_PASSWORD=contrasena-de-correo
CLOUDINARY_CLOUD_NAME=nombre-cloud
CLOUDINARY_API_KEY=clave-api
CLOUDINARY_API_SECRET=secreto-api
RESEND_API_KEY=clave-resend
```

El backend valida estas variables al iniciar. No publicar secretos ni reutilizar los valores de ejemplo.

## Variables de entorno del frontend

Crear `frontend/.env` según `frontend/.env.example`:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_HOST=localhost
VITE_PORT=5173
```

`VITE_BACKEND_URL` es la URL base de la API. `VITE_WS_URL` es opcional y configura Socket.IO; si no se define, el frontend usa `ws://localhost:3000`. En producción debe apuntar al host publicado con el protocolo correspondiente.

## Ejecutar en desarrollo

En una terminal, desde `server/`:

```bash
pnpm dev
```

En otra terminal, desde `frontend/`:

```bash
pnpm dev
```

Por defecto, Vite informa la URL de la aplicación en `http://localhost:5173` y Express escucha en `http://localhost:3000`. El endpoint de salud es `GET http://localhost:3000/api/status` y responde `ok`.

## Scripts disponibles

| Paquete | Comando | Propósito |
|---|---|---|
| Backend | `pnpm dev` | Servidor Express con recarga (`tsx watch`). |
| Backend | `pnpm lint` | ESLint del backend. |
| Frontend | `pnpm dev` | Servidor Vite de desarrollo. |
| Frontend | `pnpm build` | TypeScript y build de producción. |
| Frontend | `pnpm lint` | ESLint del frontend. |
| Frontend | `pnpm preview` | Previsualizar el build de Vite. |

El script `test` del backend todavía no está configurado. No se documenta una suite automatizada como disponible hasta que exista un comando de pruebas operativo.

## Estructura del repositorio

```text
frontend/       Aplicación React/Vite
server/         API Express y schema/migraciones Prisma
docs/           Documentación del proyecto
docker-compose.yaml
```