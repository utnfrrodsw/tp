# Musicboxd

Plataforma social y catálogo musical: los usuarios registran, califican con
estrellas y reseñan los álbumes y las canciones que escuchan, descubren música a
través de un feed comunitario y rankings, y pueden pasarse a una membresía **Pro**
que habilita aportar contenido al catálogo.

Trabajo práctico de **Desarrollo de Software** — UTN FRRo, 2026.

| | |
|:-|:-|
| **Integrantes** | 55117 Gallo, Santino · 54507 Esterri, Juan Ignacio · 55037 Siena, Santiago |
| **Propuesta aprobada** | [`proposal.md`](proposal.md) |
| **Documentación** | [`docs/`](docs/README.md) |
| **Enunciado de la cátedra** | [`docs/enunciado.md`](docs/enunciado.md) |

## Stack

| Capa | Tecnología |
|:-|:-|
| Frontend | Vite + React 19 + TypeScript, React Router, Context API + `useReducer`, SASS (arquitectura 7-1) |
| Backend | Node.js + Express 5 + TypeScript, arquitectura en capas (`routes → controller → service → repository → entity`) |
| Persistencia | MySQL 8, ORM Sequelize 6 |
| Validación | Zod |
| Autenticación | JWT propio + bcrypt, con 3 niveles de acceso (`FREE`, `PRO`, `ADMIN`) |
| Pagos | MercadoPago Checkout Pro (sandbox) con webhook de confirmación |

El repositorio es un monorepo con las dos apps, agnósticas entre sí y comunicadas
por una API REST:

```
DSW-TP/
├── backend/    API REST (Express + Sequelize)
├── frontend/   Aplicación web (Vite + React)
├── docs/       Documentación del TP
└── proposal.md Propuesta aprobada por la cátedra
```

## Puesta en marcha

### Requisitos

- **Node.js 20** o superior.
- **MySQL 8** corriendo localmente. La base **no es embebida**: es un servicio
  aparte al que la aplicación se conecta por red. Se mantiene local por acuerdo
  con la cátedra; el código ya soporta un servicio cloud con solo cambiar el
  `.env` (ver [Pasaje a producción](backend/README.md#pasaje-a-producción)).

### 1. Crear la base y el usuario de la aplicación

El ORM crea las tablas, pero no la base. Conectarse a MySQL como `root` y
ejecutar una sola vez el script SQL de
[`backend/README.md`](backend/README.md#2-crear-la-base-y-el-usuario-de-la-aplicación),
que crea el esquema `musicboxd` y el usuario `musicboxd_app` con permisos
acotados a ese esquema.

### 2. Backend

```bash
cd backend
cp .env.example .env   # completar DB_PORT y DB_PASSWORD
npm install
npm run dev
```

La API queda en `http://localhost:3000/api`. Para verificarlo:

```bash
curl http://localhost:3000/api/health
```

### 3. Cargar los datos iniciales

```bash
npm run seed
```

Deja la base usable de una: los 2 planes de membresía, el catálogo completo
(11 géneros, 88 artistas, 263 álbumes y 3.618 canciones), el usuario
administrador y los 5 anuncios que ve un usuario `FREE`. **No necesita conexión a internet**: el catálogo se lee de
archivos JSON versionados en el repositorio. Es idempotente, se puede correr las
veces que haga falta.

### 4. Frontend

En otra terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`.

### Credenciales del administrador

Las crea el seed a partir de las variables `SEED_ADMIN_*` del `.env` del backend.
Por defecto:

| Usuario | Email | Contraseña |
|:-|:-|:-|
| `admin` | `admin@musicboxd.com` | `Admin1234!` |

Las cuentas `FREE` se crean desde el registro de la propia aplicación. Para
probar una cuenta `PRO` hay dos caminos: pasar el rol desde el panel de
administración, o hacer el upgrade real con la
[pasarela de pago en sandbox](backend/README.md#configurar-mercadopago-para-probarlo).

## Documentación

| | |
|:-|:-|
| [Índice de la documentación](docs/README.md) | Punto de entrada, con todo lo que sigue |
| [Propuesta](proposal.md) | Tema, DER, alcance funcional y links a los pull requests |
| [Estado del alcance](docs/estado-alcance.md) | Qué está terminado y qué falta, punto por punto |
| [Tracking](docs/tracking.md) | Issues, ramas, pull requests y bugs |
| [Minutas](docs/minutas.md) | Reuniones, avances y decisiones del equipo |
| [README del backend](backend/README.md) | Instalación detallada, arquitectura, seed, autenticación, pagos y modelo de datos |
| [README del frontend](frontend/README.md) | Estructura, comunicación con la API, sesión y rutas protegidas |

## Cómo se trabaja en el repositorio

Ramas `feature/<issue>-<descripción>` que salen de `develop`, un pull request por
issue vinculado al GitHub Project y merge a `develop` previa revisión. `main`
guarda las versiones entregadas. El detalle está en
[docs/tracking.md](docs/tracking.md).
