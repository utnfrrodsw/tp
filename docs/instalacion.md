# Instalación

## Requisitos

- [Node.js](https://nodejs.org) (versión LTS reciente)
- [pnpm](https://pnpm.io) 11 (backend). El frontend usa npm.
- Una base PostgreSQL: la de Supabase del grupo **o una propia** (ver el aviso más abajo)

## Backend

```bash
git clone https://github.com/Campesianoo/Trabajo-Desarrollo.git
cd Trabajo-Desarrollo/backend
pnpm install
cp .env.example .env     # y completar los valores (tabla de abajo)
pnpm dev                 # o: pnpm start
```

El servidor queda en `http://localhost:3000`. Al arrancar aplica las migraciones pendientes ([ver migraciones](migraciones.md)).

### Variables de entorno (`backend/.env`)

| Variable | Obligatoria | Descripción |
|:-|:-:|:-|
| `DATABASE_URL` | sí\* | Connection string de PostgreSQL (Supabase → Database Settings → Connection string) |
| `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT` | sí\* | Alternativa a `DATABASE_URL` (por ej. un Postgres local) |
| `JWT_SECRET` | sí | Mínimo 32 caracteres. Generarlo con `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_EXPIRES_MINUTES` | no | Duración de la sesión (60 por defecto) |
| `FRONTEND_ORIGIN` | sí | Origen exacto del frontend, ej. `http://localhost:5173`. Admite varios separados por coma |
| `COOKIE_SAMESITE` | no | `lax` (por defecto). Ver [decisiones](decisiones.md#2-sesión-con-jwt-en-cookie-httponly) |
| `NODE_ENV` | no | `production` en el deploy: cookie `Secure` y errores internos ocultos |
| `TRUST_PROXY` | no | Cantidad de proxies delante del server (en el deploy) |
| `PORT` | no | 3000 por defecto |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | solo al crear el admin | Los usa `pnpm run create-admin` |

\* Hace falta una de las dos formas de conexión.

> ⚠️ **Cada integrante desarrolla contra su propia base**, no contra la compartida de Supabase. Una rama con cambios de esquema que se corre contra la base compartida la modifica para todos. Ver [migraciones](migraciones.md#desarrollar-contra-una-base-propia).

### Crear el primer administrador

1. En `backend/.env` completar `ADMIN_EMAIL` y `ADMIN_PASSWORD` (mínimo 8 caracteres).
2. `pnpm run create-admin`
3. Borrar `ADMIN_PASSWORD` del `.env`.

Después, el resto de las cuentas las crea el admin desde la app (no hay registro público).

## Frontend

```bash
git clone https://github.com/IanKasperczak/Trabajo-Desarrollo-Frontend.git
cd Trabajo-Desarrollo-Frontend
npm install
cp .env.example .env     # completar API_PROXY_TARGET
npm run dev
```

La app queda en `http://localhost:5173`. No llama al backend directo: pide todo a su propio origen en `/api` y Vite lo reenvía a `API_PROXY_TARGET` (por defecto `http://localhost:3000`). Así la cookie de sesión es del mismo sitio.

| Variable | Descripción |
|:-|:-|
| `API_PROXY_TARGET` | URL del backend al que Vite reenvía `/api` (solo desarrollo) |
| `VITE_API_URL` | Base de la API desde el navegador. Dejar `/api` |

## Scripts útiles

| Dónde | Comando | Qué hace |
|:-|:-|:-|
| backend | `pnpm test` | Corre los tests (vitest + supertest) |
| backend | `pnpm run migrate` / `migrate:status` / `migrate:down` | Gestión de migraciones |
| backend | `pnpm run format` / `format:check` | Prettier |
| frontend | `npm test` | Corre los tests (vitest + Testing Library) |
| frontend | `npm run lint` | ESLint |
| frontend | `npm run build` | Chequeo de tipos + build de producción |

## Problemas comunes

- **El server no arranca: "JWT_SECRET no está definido"** → falta `JWT_SECRET` en el `.env` o tiene menos de 32 caracteres.
- **El login anda pero la sesión no se mantiene** → `FRONTEND_ORIGIN` no coincide exactamente con el origen del frontend, o se está llamando al backend directo en vez de por `/api`.
- **No conecta a la base** → si usás Supabase, verificá que el proyecto no esté pausado (los proyectos gratuitos se pausan por inactividad).
