# Musicboxd — Backend

API REST de Musicboxd. TP de Desarrollo de Software, UTN FRRo.

## Stack

| | |
|:-|:-|
| Runtime | Node.js + TypeScript |
| Framework web | Express 5 |
| ORM | Sequelize 6 (tipado nativo con `InferAttributes`) |
| Base de datos | MySQL 8 (local en desarrollo, servicio cloud en producción) |
| Validación | Zod |

## Puesta en marcha

### 1. Requisitos

- Node.js 20 o superior
- Un servidor MySQL 8 accesible (en desarrollo, MySQL local)

### 2. Crear la base y el usuario de la aplicación

El ORM crea las tablas, pero no la base. Conectarse al MySQL local **como root**
(por consola o con MySQL Workbench) y ejecutar una sola vez, cambiando
`CAMBIAME` por una contraseña de desarrollo:

```sql
CREATE DATABASE IF NOT EXISTS musicboxd
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'musicboxd_app'@'localhost' IDENTIFIED BY 'CAMBIAME';
CREATE USER IF NOT EXISTS 'musicboxd_app'@'127.0.0.1' IDENTIFIED BY 'CAMBIAME';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, INDEX, REFERENCES
  ON musicboxd.* TO 'musicboxd_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, INDEX, REFERENCES
  ON musicboxd.* TO 'musicboxd_app'@'127.0.0.1';

FLUSH PRIVILEGES;
```

El backend se conecta con `musicboxd_app` y no con root: ese usuario solo tiene
permisos sobre el esquema `musicboxd`, así que ningún error de la aplicación puede
afectar al resto del servidor. Necesita `CREATE`, `ALTER`, `DROP` e `INDEX` porque
Sequelize crea y ajusta las tablas cuando `DB_SYNC=true`.

> **Si tenés XAMPP instalado**, su MariaDB ocupa el puerto 3306 y el servicio de
> MySQL 8 suele quedar deshabilitado durante la instalación. Para que convivan:
> cambiar `port=3306` por `port=3307` en las dos líneas donde aparece dentro de
> `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`, habilitar el servicio con
> `Set-Service MySQL80 -StartupType Manual` y arrancarlo con `net start MySQL80`
> (ambos comandos requieren una terminal de administrador). XAMPP se queda en el
> 3306 y MySQL 8 pasa al 3307.
>
> Verificar contra cuál de los dos estás trabajando:
> ```sql
> SELECT VERSION(), @@port;
> ```
> Tiene que decir `8.x`, no `10.x-MariaDB`.

### 3. Configurar el entorno

```bash
cp .env.example .env
```

Completar `DB_PORT` (3306 o 3307 según lo anterior) y `DB_PASSWORD` con la
contraseña que elegiste para `musicboxd_app`. Las demás variables ya vienen con
valores válidos para desarrollo.

### 4. Instalar y levantar

```bash
npm install
npm run dev
```

La API queda en `http://localhost:3000/api`. Para verificar que todo está bien:

```bash
curl http://localhost:3000/api/health
```

Debe responder `{"status":"ok","database":"up",...}`.

Con `DB_SYNC=true` (el valor por defecto en desarrollo), Sequelize crea y ajusta
las tablas automáticamente al arrancar a partir de las entidades.

### 5. Cargar los datos iniciales

```bash
npm run seed
```

Un solo comando deja la base usable: los 2 planes de membresía, el catálogo completo
(11 géneros, 88 artistas, 263 álbumes y 3.618 canciones) y el usuario administrador.

**No necesita conexión a internet.** El catálogo se lee de archivos JSON versionados
en el repositorio, no de una API externa. Ver [Catálogo inicial](#catálogo-inicial).

Tarda alrededor de un minuto y termina con un resumen de lo insertado:

```
[seed] Géneros: 11 nuevos, 0 ya existentes.
[seed] Artistas: 88 nuevos, 0 ya existentes.
[seed] Álbumes: 263 nuevos, 0 ya existentes.
[seed] Canciones: 3618 nuevas.
[seed] Vínculos género-álbum: 405 nuevos.
[seed] Usuario ADMIN creado: admin@musicboxd.com (usuario: admin)
```

Todos los seeds son **idempotentes**: se pueden correr las veces que haga falta sin
duplicar registros. Al correrlo una segunda vez, todos los contadores dan cero.

Las credenciales del administrador salen de `SEED_ADMIN_*` en el `.env`. Por defecto:

| Usuario | Email | Contraseña |
|:-|:-|:-|
| `admin` | `admin@musicboxd.com` | `Admin1234!` |

## Scripts

| Script | Qué hace |
|:-|:-|
| `npm run dev` | Levanta la API en modo desarrollo, con recarga automática |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta la versión compilada (producción) |
| `npm run typecheck` | Verifica tipos sin generar archivos |
| `npm test` | Corre todos los tests una vez |
| `npm run test:watch` | Los corre y queda escuchando cambios |
| `npm run seed` | Corre todos los seeds del proyecto |
| `npm run seed:plans` | Corre solo el seed de planes Free / Pro |
| `npm run seed:catalog` | Corre solo el seed del catálogo |
| `npm run seed:admin` | Corre solo el seed del usuario administrador |
| `npm run seed:fetch` | **Descarga el catálogo de Deezer.** Es el único script que sale a internet, y no hace falta correrlo para levantar el proyecto |
| `npm run db:reset` | Borra la base local, la recrea y corre todos los seeds |

## Tests

Corren con **Vitest**, y los de integración además usan **Supertest** para pegarle
a la API sin levantar el servidor en un puerto. Viven en `tests/`, fuera de
`src/`, para que `npm run build` compile solo la aplicación.

```
tests/
├── unit/          una función pura por vez, sin base ni red
│   ├── auth.schema.test.ts      Santino Gallo
│   ├── album.schema.test.ts     Juan Ignacio Esterri
│   ├── review.schema.test.ts    Santiago Siena
│   ├── follow.schema.test.ts
│   ├── list.schema.test.ts      Santiago Siena
│   ├── user.schema.test.ts      Juan Ignacio Esterri
│   ├── payment.schema.test.ts   Santino Gallo
│   └── ad.schema.test.ts        Santiago Siena
└── integration/
    └── auth.test.ts             la app entera, contra MySQL
```

Los tres primeros son el test por integrante que pide la cátedra; los otros cinco
se sumaron después, con las features que los estrenaron.

**Los unitarios** prueban los schemas de Zod, que son las reglas de validación de
la API: la normalización del email y el mínimo de la contraseña (`auth`), el año
vacío que se guarda como `NULL` y el artista obligatorio (`album`), la escala de
media estrella más el XOR álbum/canción (`review`), el valor por defecto y el tope
del ranking de usuarios (`follow`), el tipo obligatorio de una lista con el tope
de su paginado (`list`), la paleta cerrada del color de perfil y el banner vacío
que vuelve a `NULL` (`user`), el año de las métricas del dashboard (`payment`), y
el título y la imagen obligatorios de un anuncio con su enlace externo o interno
(`ad`). Son funciones puras, así que no necesitan base de datos ni variables de
entorno:

```bash
npm test -- tests/unit
```

**El de integración** recorre las cinco capas de verdad
(`routes → controller → service → repository → entity`), más MySQL, bcrypt y la
firma del JWT: inicia sesión con el usuario administrador, verifica que la
respuesta **no** incluya el hash de la contraseña, que una contraseña incorrecta
devuelva `401` y un email mal formado `400`, y que el token sirva para entrar a
una ruta protegida. Todos los casos son de solo lectura, no escriben en la base.

Para correrlo hace falta **MySQL levantado y `npm run seed` ya ejecutado**, y las
credenciales salen del `SEED_ADMIN_*` del `.env`, no están escritas en el test.

```bash
npm test
```

## Reiniciar la base local

Con `DB_SYNC=true`, Sequelize actualiza el esquema solo al arrancar: si un compañero
agrega una columna a una entidad, alcanza con hacer `git pull` y `npm run dev`.

Pero `sync({ alter: true })` es bueno agregando y flojo renombrando o eliminando, y
si se corre muchas veces puede acumular índices duplicados. Cuando la base local
quede rara después de varios cambios de modelo, en vez de pelearla se rehace:

```bash
npm run db:reset
```

Borra todas las tablas (incluidas las huérfanas de entidades renombradas), recrea el
esquema desde las entidades y vuelve a correr los seeds. **La base local es
descartable**: todos sus datos vienen de los seeds, así que no se pierde nada. En
ningún momento del proyecto debería haber información importante que exista solo en
la máquina de un integrante.

El script se niega a correr si `NODE_ENV=production`, y antes de borrar imprime a qué
host, puerto y base se está conectando.

## Catálogo inicial

### La base propia es la única fuente de verdad

Musicboxd **no consulta APIs externas de música en runtime**. Ningún endpoint de la
API ni ningún componente del frontend le pega a Deezer, Spotify ni MusicBrainz: todo
sale de las tablas propias. La metadata musical se descarga **una sola vez, offline**,
y a partir de ahí el catálogo crece desde adentro del sistema, con los aportes de los
usuarios PRO que un ADMIN modera.

Esto tiene una consecuencia importante para el TP: los CRUD de Artista, Álbum, Género
y Canción son CRUD reales sobre tablas propias, no un proxy contra un servicio ajeno.

### Las dos etapas, y por qué están separadas

```
   [ Deezer ]                          (1 vez, a mano, con internet)
       │
       │  npm run seed:fetch
       ▼
 src/seed/data/*.json                  (versionado en git)
       │
       │  npm run seed
       ▼
   [ MySQL ]                           (sin internet, reproducible)
       │
       │  la app solo lee de acá
       ▼
   [ API REST ]
```

`seed:fetch` es lo único que sale a internet, y **no hace falta correrlo**: los tres
archivos que genera están commiteados. Solo se vuelve a ejecutar si se quiere ampliar
la selección de `src/seed/catalog-selection.ts`.

Separarlo así es lo que hace que el seed sea reproducible: `npm run seed` carga
siempre exactamente los mismos datos, funciona sin conexión y sigue funcionando aunque
Deezer esté caído o cambie su API.

| Archivo | Contenido |
|:-|:-|
| `src/seed/catalog-selection.ts` | La curaduría: qué géneros y qué artistas se descargan |
| `src/seed/deezer-client.ts` | Cliente HTTP de Deezer (rate limit y reintentos) |
| `src/seed/fetch-metadata.ts` | Etapa 1: descarga y escribe los JSON |
| `src/seed/data/*.json` | La metadata descargada, versionada en git |
| `src/seed/seed-catalog.ts` | Etapa 2: inserta los JSON en la base |

### Por qué Deezer y no Spotify

| | Deezer | Spotify |
|:-|:-|:-|
| Autenticación | Ninguna, endpoints públicos | OAuth (Client Credentials) |
| Géneros | A nivel **álbum** | Solo a nivel artista |
| Tracklist | Viene en el detalle del álbum | Requiere llamadas aparte |
| Términos de uso | Sin restricción para persistir catálogo | Sus Términos de Desarrollador restringen almacenar el catálogo |

El modelo del TP asocia los géneros al **álbum** (tabla `genres_albums`), que es
justamente como los expone Deezer. Con Spotify habría que derivarlos del artista.

### Cómo se eligen los datos

Se descargan 3 álbumes de cada artista, de 11 géneros. La selección de artistas está
escrita a mano en `catalog-selection.ts` en lugar de tomarse de la API por dos motivos:

1. El endpoint `/genre/{id}/artists` de Deezer devuelve un ranking general de
   popularidad, no una clasificación por género: pedirle los artistas de "Rock"
   contesta BTS y Bad Bunny.
2. Permite incluir un género propio, **Rock Nacional**, con 17 artistas argentinos que
   ningún chart de Deezer prioriza.

Dos detalles del script que vale la pena conocer:

- **Elección de la página de artista.** Deezer tiene páginas duplicadas para casi todos
  los artistas conocidos, con el mismo nombre y un puñado de singles, y el buscador las
  devuelve primero. Entre las coincidencias exactas se elige la de más seguidores: la
  página real de Charly García tiene 198.798 y la que devuelve primero el buscador, 6.
  Para los nombres genuinamente ambiguos (Virus, la banda argentina, contra Vîrus, el
  rapero francés, que sin acentos se escriben igual) la curaduría permite fijar el id.
- **Número de pista.** El detalle del álbum de Deezer no trae `track_position`, pero
  devuelve las canciones en el orden del disco, así que `number_track` sale de esa
  posición. Numerarlas corrido resuelve además los álbumes dobles: copiar la numeración
  por disco daría dos pistas nº 1 en el mismo álbum y violaría el índice único
  `uq_song_album_track`.

### Limitaciones conocidas de los datos

- **El año es el de la edición, no siempre el del lanzamiento original.** Deezer no
  expone la fecha original de un disco, sino la de cada edición que tiene cargada. De
  cada grupo de reediciones el script se queda con la fecha más antigua, que corrige 26
  de los 263 álbumes; en el resto Deezer directamente no tiene cargada la edición
  original y el año queda siendo el de la reedición (Clics Modernos, de 1983, figura
  como 2007).
- **Los artistas no tienen biografía.** La API pública de Deezer no la expone. La
  columna queda en `NULL` y se completa desde el CRUD de artista.
- **Algunos títulos conservan el sufijo de la edición** ("Master Of Puppets
  (Remastered)"). Se guardan tal como los devuelve Deezer, sin retocarlos.

### Idempotencia sin tocar el DER

Las tablas no guardan el id de Deezer: agregar una columna `deezer_id` al modelo solo
para el seed habría sido un desvío del pasaje a tablas. En su lugar cada registro se
identifica por su **clave natural** — el género por `name`, el artista por `name`, el
álbum por `title` + artista, y la canción por su número de pista dentro del álbum, que
es la clave única que la entidad ya declaraba.

## Estructura del proyecto

```
src/
  server.ts          Punto de entrada: conecta a la DB y escucha
  app.ts             Configuración de Express (sin levantar el servidor)
  routes.ts          Router principal: monta el router de cada feature

  features/          EL DOMINIO: una carpeta por entidad, con sus cinco capas
    health/          Health check (además, ejemplo del patrón de capas)
    auth/            Registro, inicio de sesión y usuario logueado
    user/            CRUD de usuarios y cambio de rol
    follow/          Seguimiento entre usuarios, búsqueda y sugerencias
    artist/          CRUD de artista
    album/  song/    CRUD de álbum y de canción, con sus exploradores
    genre/           CRUD de género
    review/          CRUD de reseña, likes, comentarios y estadísticas
    list/            CRUD de listas personalizadas
    plan/  subscription/  payment/   Membresías y pasarela de pago

  entities/          Modelos de Sequelize (uno por tabla del DER) +
                     index.ts con TODAS las asociaciones

  shared/            LO TRANSVERSAL: lo que usan varias features
    auth/jwt.ts      Firma y verificación de los tokens
    config/env.ts    Lectura y validación de variables de entorno
    db/sequelize.ts  Instancia única de conexión
    errors/          Clases de error de negocio (AppError y derivadas)
    middlewares/     validate, require-auth, optional-auth, require-role,
                     error-handler, not-found
    types/           Enumerados del dominio + extensión global de Request

  seed/              Carga inicial de datos + data/*.json descargados
  scripts/           Mantenimiento de la base (reset)
```

La organización es la misma que la del frontend: **`features/` es el dominio y
`shared/` es lo transversal** (el equivalente de `core/` del lado del cliente). Con
esa separación, `src/` no crece: sumar el CRUD de álbum agrega una carpeta adentro
de `features/`, no una más en la raíz.

### Por qué `entities/` está afuera de las features

Es la única parte que no espeja al frontend, y es a propósito. En el frontend cada
feature tiene su `models/` porque esas clases son independientes entre sí. Acá las
entidades son un grafo conectado: `entities/index.ts` declara **todas** las
asociaciones en un solo lugar, justamente para evitar imports circulares.

Si cada entidad viviera dentro de su feature, `review` importaría de `album`, `song`
y `user`, y `album` de `artist` y `genre`: círculos de imports y el mapa de
relaciones repartido en diez archivos. Centralizarlas es una restricción del ORM,
no un descuido.

### `seed/` y `scripts/`: qué va en cada una

| Carpeta | Qué contiene | Cuándo se corre |
|:-|:-|:-|
| `seed/` | Todo lo que **carga datos iniciales**: los cargadores (`run-seeds`, `seed-*.ts`), los JSON de `data/` y el descargador de Deezer que los generó | Al preparar una base nueva |
| `scripts/` | Tareas de **mantenimiento de la base**: `reset-db` | Puntualmente, cuando hace falta |

No son seeds: `reset-db` borra las tablas y las vuelve a crear.
Tenerlos mezclados hacía que `seed/` pareciera un cajón de sastre.

## Arquitectura en capas

Cada feature se organiza en cinco archivos con una responsabilidad cada uno:

```
src/features/album/
  album.routes.ts       define las rutas y encadena los middlewares
  album.controller.ts   traduce HTTP <-> service. No consulta la base
  album.service.ts      lógica de negocio. No conoce req ni res
  album.repository.ts   acceso a datos vía Sequelize
  album.schema.ts       schemas de Zod para validar la entrada
```

El flujo es siempre **routes → controller → service → repository → entity**.
No se saltean capas: un controller nunca consulta el modelo directamente.

### Plantilla para una feature nueva

```ts
// album.schema.ts
import { z } from 'zod';

export const createAlbumSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio.').max(200),
  release_year: z.number().int().min(1900).max(2100).optional(),
  id_artist: z.number().int().positive(),
});
export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
```

```ts
// album.repository.ts
import { Album } from '../../entities';
import { CreateAlbumInput } from './album.schema';

export const albumRepository = {
  findAll: () => Album.findAll(),
  findById: (id: number) => Album.findByPk(id),
  create: (data: CreateAlbumInput) => Album.create(data),
};
```

```ts
// album.service.ts
import { NotFoundError } from '../../shared/errors/app-error';
import { albumRepository } from './album.repository';

export const albumService = {
  async findById(id: number) {
    const album = await albumRepository.findById(id);
    if (!album) throw new NotFoundError('El álbum');
    return album;
  },
};
```

```ts
// album.controller.ts
import { Request, Response } from 'express';
import { albumService } from './album.service';

export const albumController = {
  // En Express 5 no hace falta try/catch: los errores de una promesa rechazada
  // llegan solos al middleware de manejo de errores.
  async findById(req: Request, res: Response) {
    const album = await albumService.findById(Number(req.params.id));
    res.status(200).json(album);
  },
};
```

```ts
// album.routes.ts
import { Router } from 'express';
import { validate } from '../../shared/middlewares/validate';
import { albumController } from './album.controller';
import { createAlbumSchema } from './album.schema';

export const albumRouter = Router();

albumRouter.get('/:id', albumController.findById);
albumRouter.post('/', validate({ body: createAlbumSchema }), albumController.create);
```

Por último se monta en `src/routes.ts`:

```ts
router.use('/albums', albumRouter);
```

## Validación y manejo de errores

El middleware `validate({ body, params, query })` valida con Zod antes de llegar
al controller y deja los datos parseados en `req.validated`. Los controllers leen
de ahí, nunca de `req.body` crudo:

```ts
const data = req.validated.body as CreateAlbumInput;
```

Si algo falla, se lanza el error y lo captura el middleware central, que devuelve
siempre el mismo formato:

```json
{
  "message": "Los datos enviados no son válidos.",
  "errors": [
    { "field": "rating", "message": "La calificación máxima es 5 estrellas." }
  ]
}
```

Ese middleware traduce automáticamente: errores propios (`AppError` y derivadas),
errores de Zod, violaciones de índice único (409), violaciones de clave foránea (409)
y validaciones del modelo de Sequelize (400). Los 5xx se loguean completos en el
servidor y nunca exponen el SQL al cliente.

## Autenticación y roles

La API usa **JWT propio** (sin librerías de terceros tipo Passport) y **bcrypt**
para el hash de las contraseñas. No hay sesiones ni cookies: el token viaja en el
header `Authorization` en cada request.

### Endpoints

| Método | Ruta                 | Acceso    | Descripción                                     |
| :----- | :------------------- | :-------- | :---------------------------------------------- |
| POST   | `/api/auth/register` | público   | Crea la cuenta (siempre `FREE`) y devuelve token |
| POST   | `/api/auth/login`    | público   | Valida credenciales y devuelve token             |
| GET    | `/api/auth/me`       | logueado  | Datos del usuario dueño del token                |

`register` y `login` responden lo mismo: el usuario y su token.

```json
{
  "user": {
    "id_user": 1,
    "username": "admin",
    "email": "admin@musicboxd.com",
    "rol": "ADMIN",
    "registration_date": "2026-08-13T18:31:40.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Ejemplo con curl:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@musicboxd.com","password":"Admin1234!"}'
```

```bash
curl http://localhost:3000/api/auth/me -H "Authorization: Bearer <token>"
```

### Proteger una ruta

Dos middlewares, siempre en este orden: primero `requireAuth` (¿quién sos?) y
después `requireRole` (¿te alcanza el rol?).

```ts
import { requireAuth } from '../../shared/middlewares/require-auth';
import { requireRole } from '../../shared/middlewares/require-role';

// Cualquier usuario logueado
albumRouter.post('/:id/reviews', requireAuth, reviewController.create);

// Alta de catálogo: solo PRO o ADMIN
albumRouter.post('/', requireAuth, requireRole('PRO', 'ADMIN'), albumController.create);

// Moderación: solo ADMIN
albumRouter.patch('/:id/approve', requireAuth, requireRole('ADMIN'), albumController.approve);
```

`requireAuth` verifica el token y deja `{ id_user, rol }` en `req.user`, que el
controller usa para saber quién está haciendo la operación:

```ts
const id_user = req.user!.id_user;
```

Los códigos son los esperables: **401** si falta el token, está vencido o es
inválido; **403** si el usuario está logueado pero su rol no alcanza.

### Rutas públicas que mejoran con sesión: `optionalAuth`

Hay un tercer caso además de "pública" y "protegida": la ruta que cualquiera puede
llamar, pero cuya respuesta es mejor si además hay sesión.

```ts
// Detalle de una reseña: lo abre cualquiera, pero si hay token se aprovecha.
reviewRouter.get('/:id', optionalAuth, validate({ params: ... }), reviewController.getById);
```

`optionalAuth` es igual a `requireAuth` salvo en una cosa: **nunca corta**. Sin
header sigue de largo y el controller recibe `req.user` en `undefined`; con un
token válido lo deja seteado; y con uno vencido lo trata como si no hubiera
venido ninguno, en vez de responder 401 en una ruta que es pública.

El detalle de una reseña es el caso que lo justifica. Es el destino del botón
"Compartir", así que lo tiene que poder abrir alguien sin cuenta; pero hay dos
cosas que solo se saben con el token: si el que mira ya le dio "me gusta" (para
dibujar el corazón lleno) y si es su autor o un `ADMIN` (para poder ver una
reseña que un moderador ocultó, en vez de comerse un 404 al intentar editarla
desde su propio perfil).

### Decisiones de esta parte

- **El rol nunca sale de la request.** Todo registro público entra como `FREE`,
  aunque el body traiga `"rol": "ADMIN"`. Se sube a `PRO` pagando, y a `ADMIN`
  solo desde el seed.
- **La contraseña no sale nunca en una respuesta.** El `defaultScope` de la entidad
  `User` la excluye de toda consulta; el login es el único lugar que usa
  `User.scope('withPassword')`, y aun ahí el service arma la respuesta campo por campo.
- **Login fallido: siempre el mismo mensaje**, exista o no el email. Distinguir los
  casos le permitiría a un atacante averiguar qué cuentas están registradas.
- **`JWT_SECRET` es obligatorio.** Si falta, el servidor no arranca: con una clave
  vacía cualquiera podría fabricarse un token de `ADMIN`.
- El frontend replica estos permisos con `ProtectedRoute`, pero eso es solo para la
  navegación: **la validación real es la del backend**.

## Reseñas

El CUU de publicar y gestionar una reseña. Reseñar es lo que hace **cualquier
usuario registrado**, incluido un `FREE`: es la diferencia con los CRUD de
catálogo, donde el alta exige `PRO`.

### Endpoints

| Método | Ruta | Acceso |
|:-|:-|:-|
| GET | `/api/reviews` | **público**, con `optionalAuth` |
| GET | `/api/reviews/mine` | logueado |
| GET | `/api/reviews/stats/me?year=` | PRO o ADMIN |
| GET | `/api/reviews/stats` | público |
| GET | `/api/reviews/:id` | **público**, con `optionalAuth` |
| POST | `/api/reviews` | logueado |
| PATCH · DELETE | `/api/reviews/:id` | su autor (la baja, también un ADMIN) |
| PATCH | `/api/reviews/:id/hide` · `/restore` | ADMIN |
| POST | `/api/reviews/:id/like` | logueado |
| GET · POST | `/api/reviews/:id/comments` | público · logueado |
| DELETE | `/api/reviews/:id/comments/:idComment` | su autor o ADMIN |

### Filtros del listado

`GET /api/reviews` acepta `id_album`, `id_song`, `target`, `id_user`, `state`,
`min_rating`, `following`, `exclude_mine`, `limit` y `offset`. Con esos filtros,
una sola consulta alimenta seis pantallas:

| Para qué | Query |
|:-|:-|
| Reseñas de un álbum | `?id_album=5` |
| Reseñas de un usuario, de 4 estrellas para arriba | `?id_user=2&min_rating=4` |
| Álbumes que calificó un usuario | `?id_user=2&target=album` |
| Canciones que calificó | `?id_user=2&target=song` |
| Solapa "Comunidad" de `/reviews` | `?exclude_mine=true` |
| Solapa "Amigos" de `/reviews` | `?following=true` |

El listado es **público** porque el feed de la comunidad se ve sin cuenta. Va con
`optionalAuth` porque la respuesta mejora con sesión: `liked_by_me` dice si el que
mira ya le dio "me gusta", y `following` (el feed de amigos) solo existe sabiendo
quién pregunta, así que sin token responde 401. Sin sesión, `exclude_mine` no
excluye nada.

`following` y `exclude_mine` filtran por autor, igual que `id_user`, así que no se
combinan entre sí ni con él: el schema rechaza esas combinaciones con un 400.

`target` (`album` \| `song`) no se pisa con `id_album` / `id_song`: aquellos
apuntan a **un** ítem y este a **todo un tipo**. En la tabla, a qué apunta una
reseña se guarda como cuál de los dos ids quedó en NULL, así que "todas las de
álbum" se traduce a `id_album IS NOT NULL`.

Solo un `ADMIN` puede pedir un `state` distinto de `published`: para cualquier
otro, el listado es siempre lo publicado, sin importar qué haya pedido.

### Estadísticas avanzadas: "Tu año en música"

`GET /api/reviews/stats/me?year=2026` es el beneficio que desbloquea Pro (CUU 4).
Devuelve, a partir de las reseñas publicadas del usuario en ese año: totales
(reseñas, álbumes, canciones, artistas, géneros, promedio y minutos de música
calificada), actividad por mes, top 5 de géneros (con "Otros"), de artistas y de
álbumes mejor calificados, décadas de lanzamiento, distribución de notas y los
destacados del año. Sin `year`, usa el año en curso.

Son siempre **las propias**: la ruta no recibe un id de usuario, lo saca del token.

**Por qué el service relee el rol**, si `requireRole('PRO', 'ADMIN')` ya cortó a
un `FREE`: `requireRole` lee el rol del JWT, y un token emitido antes de que un ADMIN
le bajara el rol al usuario sigue diciendo `PRO` hasta que expira. Para un `PRO`, el
service vuelve a leer el rol de la base; si ya no es Pro, responde 403. No exige una suscripción activa porque un `PRO`
asignado desde el panel de administración no tiene ninguna.

Los cálculos se hacen en el service, sobre una sola consulta con includes (álbum o
canción, artista, géneros y duraciones), con funciones chicas por cada ranking.

### Dos decisiones que hay que poder explicar

- **La baja de una reseña es FÍSICA**, a diferencia de la de un usuario. El
  índice único por usuario e ítem no distingue estados, así que una fila
  "borrada" le impediría al autor volver a reseñar lo mismo. Para retirar de
  circulación sin borrar está `hide`, que además es reversible.
- **Un ADMIN no puede EDITAR una reseña ajena**, aunque sí ocultarla o borrarla:
  cambiarle el texto a otro sería ponerle palabras en la boca y dejarlas firmadas
  con su nombre.

## Seguimiento entre usuarios

La feature `follow` maneja la relación `FOLLOWS`: seguir, dejar de seguir,
contadores, listas, búsqueda y sugerencias. Las rutas cuelgan de `/api/users`
porque seguir es una interacción con un usuario, pero viven en su propia carpeta
para no tocar el CRUD de `user`.

### Endpoints

| Método | Ruta | Acceso |
|:-|:-|:-|
| GET | `/api/users/suggestions?limit=` | público, con `optionalAuth` |
| GET | `/api/users/search?q=&limit=` | público, con `optionalAuth` |
| POST · DELETE | `/api/users/:id/follow` | logueado |
| GET | `/api/users/:id/follow-stats` | público, con `optionalAuth` |
| GET | `/api/users/:id/followers?limit=&offset=` | público, con `optionalAuth` |
| GET | `/api/users/:id/following?limit=&offset=` | público, con `optionalAuth` |

Sugerencias, búsqueda y listas devuelven la misma tarjeta de usuario (id, nombre,
avatar, rol, cantidad de reseñas y de seguidores, y `followed_by_me`), nunca el email.

### Decisiones de esta parte

- **Las cuentas suspendidas no aparecen ni cuentan.** Las listas, la búsqueda y
  también los contadores las excluyen, para que el número de "Seguidores" sea
  siempre el mismo que la cantidad de gente que se ve al abrir la lista.
- **Las listas se arman en una sola consulta sobre `users`** (con subconsultas a
  `follows`), y no trayendo primero las filas de `follows`: si se filtraran los
  suspendidos después, una tanda de 20 podía llegar con 17 y el paginado se
  cortaba antes de tiempo.
- **La búsqueda escapa los comodines de `LIKE`**: buscar `%` no trae a todos. Primero
  van los nombres que empiezan con el texto y después los que lo contienen.

## Listas personalizadas

La feature `list` maneja las cuatro tablas de listas (`LISTS`, `LIST_ALBUMS`,
`LIST_SONGS` y `LIST_LIKES`): armar una colección, editarla, agregarle y sacarle
ítems, y el "me gusta" sobre una lista ajena. Es alcance adicional voluntario.

Una lista es **de álbumes o de canciones**, nunca de las dos. De qué es lo dice
su columna `type`, y esa columna decide en cuál de las dos tablas intermedias van
sus ítems: por eso la mezcla no se valida en ningún lado, directamente no se
puede representar. El detalle del modelado está en
[`docs/der.md`](../docs/der.md).

### Endpoints

| Método | Ruta | Acceso |
|:-|:-|:-|
| GET | `/api/lists?genre=&q=&id_user=&type=&sort=&limit=&offset=` | **público**, con `optionalAuth` |
| GET | `/api/lists/mine` | logueado |
| GET | `/api/lists/:id` | **público**, con `optionalAuth` |
| POST | `/api/lists` | **PRO o ADMIN** |
| PATCH | `/api/lists/:id` | su dueño, **PRO o ADMIN** |
| DELETE | `/api/lists/:id` | su dueño o un ADMIN |
| POST · DELETE | `/api/lists/:id/items` · `/api/lists/:id/items/:idItem` | su dueño, **PRO o ADMIN** |
| POST | `/api/lists/:id/like` | logueado |

`sort` ordena por `recent` (la sección "Listas en Tendencia") o por cantidad de
"me gusta" con `top` (la sección "Top Listas"); `genre` deja solo las listas que
tengan al menos un ítem de ese género; `type` acota a un tipo de lista, y sin él
vienen las dos mezcladas. Con esos filtros, una sola consulta alimenta las tres
secciones de la pantalla y el bloque "Más listas de @usuario".

### Decisiones de esta parte

- **Armar listas es un beneficio de Pro.** Un `FREE` las ve, las abre, las
  comparte y les da "me gusta", pero no las crea ni las cura: es el mismo
  criterio que las estadísticas avanzadas. El `like` es la única escritura que
  sigue abierta a cualquier usuario registrado, porque reaccionar a una lista
  ajena es consumirla, no armarla.
- **El corte de Pro vive en el service y no en un `requireRole` de la ruta.**
  `requireRole` lee el rol del JWT, y un token emitido antes de que un ADMIN le
  bajara el rol al usuario sigue diciendo `PRO` hasta que expira. Para un `PRO`,
  `assertCanWrite` vuelve a leer el rol de la base; si ya no es Pro, responde 403. No exige una suscripción activa
  porque un `PRO` asignado desde el panel de administración no tiene ninguna.
  Poner la mitad de la regla en la ruta y la otra mitad en el service la dejaría
  repartida en dos lugares.
- **Las rutas de ítems no nombran la entidad** (`/items`, no `/albums` ni
  `/songs`): la lista ya sabe de qué es. Tenerlas separadas obligaría al frontend
  a elegir la ruta según el tipo y dejaría abierta la puerta a mandarle un álbum
  a una lista de canciones.
- **No hay circuito de moderación.** Una lista no es contenido de catálogo —no
  lleva `state` en el DER—: es una colección personal sobre álbumes y canciones
  que ya están aprobados.
- **Solo se agregan ítems `approved`**, con el mismo criterio que una reseña. En
  el alta se valida **el lote entero antes** de crear la lista: si el tercer ítem
  fallara a mitad de la inserción, la lista ya existiría y quedaría a medio armar
  sin que el usuario se entere.
- **Una lista nunca nace vacía**: el alta exige al menos un ítem. Un nombre suelto
  no es una agrupación. La regla vive en el schema de Zod y no solo en el
  formulario, porque la validación real es siempre la del backend.
- **El tipo de una lista no se puede cambiar.** El `PATCH` no acepta `type`: los
  ítems viven en la tabla intermedia de su tipo, así que pasar de álbumes a
  canciones obligaría a vaciarla primero. Quien quiera una del otro tipo, arma
  otra.
- **El "me gusta" es un solo endpoint** que pone y saca, no un alta y una baja
  separadas: el corazón es un interruptor y el frontend no tiene que saber en qué
  estado está para poder apretarlo. Después de tocarlo, el conteo se vuelve a leer
  de la base en vez de sumarle o restarle uno a mano, que se desincroniza si dos
  personas reaccionan a la vez.
- **Editar y borrar no los resuelve un middleware.** Dependen de comparar el
  `id_user` de la lista contra el del token, así que viven en el service, igual
  que en `review` y en `album`. Editar es solo del dueño; borrar, del dueño o de
  un `ADMIN`.
- **Las listas son siempre públicas**, tal como quedó definido en la propuesta.
  Ninguna ruta devuelve algo distinto según quién pregunta, salvo `liked_by_me`:
  eso es lo único que justifica el `optionalAuth` de las dos rutas de lectura.
- **El filtro por género salta un nivel más en las listas de canciones.** Los
  géneros del modelo cuelgan del álbum, así que para una lista de álbumes el
  camino es lista → álbum → género y para una de canciones, lista → canción →
  álbum → género. Se resuelve con una consulta por tabla, cuyos ids se unen: un
  include anidado con `required: true` dejaría en la lista solo los ítems de ese
  género en vez de la lista completa.

## Buscador de la barra

El buscador del frontend encuentra álbumes, canciones y usuarios con tres pedidos
en paralelo, todos públicos:

| Qué busca | Ruta |
|:-|:-|
| Álbumes | `GET /api/albums/explore?title=&limit=&sort=` |
| Canciones | `GET /api/songs/explore?title=&limit=&sort=` |
| Usuarios | `GET /api/users/search?q=&limit=` |

Para álbumes y canciones no se creó un endpoint nuevo: se sumó el filtro `title` a
los exploradores, que ya eran públicos, tenían tope de filas y devuelven solo el
catálogo aprobado. El listado `GET /api/albums?title=` ya filtraba por título, pero
pide sesión y no tiene tope. Las tres búsquedas comparten
`shared/db/like.ts`: escapan los comodines de `LIKE` y ponen primero lo que
**empieza** con el texto buscado.

## Membresías y pasarela de pago

El CUU de upgrade a `PRO`. Tres features trabajan juntas: `plan` (qué se vende),
`subscription` (quién lo tiene y hasta cuándo) y `payment` (cómo se cobró).

### El circuito, de punta a punta

```
1. El usuario aprieta "Pasarme a Pro"
   -> POST /api/payments/checkout  crea la preference en MercadoPago
                                   y devuelve el link. NO guarda nada todavía.
2. Paga en MercadoPago.
3. MercadoPago avisa, por DOS caminos que terminan en la misma función:
     - POST /api/payments/webhook   aviso servidor a servidor (URL pública)
     - POST /api/payments/confirm   lo llama la pantalla /pro/return del frontend
4. confirmPayment() le PREGUNTA a MercadoPago cómo terminó el pago y, si está
   aprobado, en UNA transacción:
     crea la suscripción (sin vencimiento: es un pago único)
     -> sube users.rol a 'PRO' -> registra el pago
5. El frontend pide POST /api/auth/refresh para tener un token con el rol nuevo.
```

### Las cuatro decisiones que hay que poder explicar

- **Nunca se le cree a quien avisa.** Ni el webhook ni la pantalla de retorno
  dicen si un pago se aprobó: solo dicen qué id mirar. El estado se consulta
  contra MercadoPago con nuestro access token. Si no fuera así, cualquiera se
  haría `PRO` mandando un POST inventado al webhook, que es una ruta pública.
- **El circuito es idempotente.** Los dos avisos pueden llegar, en cualquier
  orden. Antes de activar nada se busca el pago por su `id_gateway`; y si dos
  entraran a la vez, el índice único `payments_id_gateway_unique` haría fallar al
  segundo. La membresía no se puede duplicar.
- **El webhook siempre responde 200, incluso cuando falla.** MercadoPago
  reintenta durante días todo lo que no sea 2xx, así que un error se registra en
  el log del servidor y se le contesta 200 igual. Es la única ruta del sistema
  con `try/catch` y sin `validate()`.
- **Solo se persiste el pago aprobado.** `payments.id_subscription` es NOT NULL y
  `subscription.state` no tiene un valor `pending`, así que un pago rechazado
  obligaría a crear una suscripción que nunca estuvo vigente. Un rechazo no deja
  fila: el usuario lo ve en la pantalla de retorno y puede reintentar.

### Pago único, no suscripción recurrente

La membresía Pro se paga **una sola vez** y **no vence**: `subscription.end_date`
queda siempre en NULL. No hay renovación, no hay vencimiento y no hay ningún
proceso corriendo en el tiempo para aplicarlo.

Es lo que se corresponde con la herramienta que se usa: Checkout Pro es el
producto de MercadoPago **para pagos únicos**. El cobro recurrente es otro
(`preapproval`) y habría que guardar el id de la suscripción externa, columna que
el DER no tiene; sin ese dato, dar de baja cancelaría la membresía en nuestra
base mientras MercadoPago le sigue cobrando al usuario. Antes la membresía duraba
un mes con renovación manual, que era la forma de acercarse a una suscripción sin
usar `preapproval`; el pago único saca esa aproximación del medio y deja el
circuito alineado con lo que la pasarela realmente hace.

Consecuencias en el código:

- `createCheckout` corta con 400 si el usuario ya tiene la membresía activa: no
  hay nada que volver a comprar.
- No existe la baja voluntaria. La única baja posible la aplica un ADMIN al
  cambiarle el rol a FREE a un usuario, y ahí `subscriptionService.cancelForUser`
  deja la fila como `cancelled`.
- El estado `expired` se eliminó del enum: era inalcanzable.

### El rol vive dentro del token

`requireRole` lee el rol del JWT, no de la base. Entonces, después de pagar, el
token guardado sigue diciendo `FREE` y el backend rechazaría las rutas que el
usuario acaba de comprar. Por eso existe `POST /api/auth/refresh`: relee el
usuario y emite un token nuevo. El frontend lo llama al confirmar un pago.

### Endpoints

| Método | Ruta | Acceso |
|:-|:-|:-|
| GET | `/api/plans` | público |
| GET | `/api/plans/:id` | público |
| POST · PATCH · DELETE | `/api/plans` · `/api/plans/:id` | ADMIN |
| GET | `/api/subscriptions/mine` | logueado |
| GET | `/api/subscriptions` | ADMIN |
| POST | `/api/payments/checkout` | logueado |
| POST | `/api/payments/confirm` | logueado |
| POST | `/api/payments/webhook` | **público** (lo llama MercadoPago) |
| GET | `/api/payments/mine` | logueado |
| GET | `/api/payments/stats?year=` | ADMIN |

### Dashboard de administración

`GET /api/payments/stats` alimenta la pestaña **Métricas** del panel de
administración: ingresos (históricos y del año elegido), cantidad de ventas,
ticket promedio, ingresos mes a mes, usuarios activos por rol, conversión a Pro
y las últimas ventas.

Con el pago único no hay ingresos recurrentes que medir (ni MRR ni bajas): lo que
se mide son **ventas**. Todo sale de las tablas propias —`payments`,
`subscription` y `users`—, así que un pago que entra por MercadoPago aparece en
la siguiente lectura. Dos criterios que no son obvios:

- **Usuarios por plan sale de `users.rol`**, no de `subscription`: un Free no
  tiene fila en `subscription` (solo nace de un pago) y un Pro puede estar
  asignado a mano por un admin. Las cuentas suspendidas no cuentan.
- **La conversión** es Pro que pagaron (suscripciones activas) sobre usuarios
  activos no admin: un admin no compra, tiene todo por su rol.

#### Datos de demostración

Para que el dashboard no muestre todo en cero en la defensa hay un seed aparte,
que **no** corre con `npm run seed` ni con `db:reset`:

```bash
npm run seed:demo-sales              # 10 ventas repartidas en los últimos meses
npm run seed:demo-sales -- --clean   # las borra
```

Cada venta es un usuario `demo_comprador_N` (email `@demo.musicboxd.local`) con
su suscripción activa y su pago aprobado, creados en una transacción. Los pagos
llevan `id_gateway` con prefijo `demo-`, que es lo que usa la limpieza para
borrar solo lo de demo. **Hay que correr la limpieza antes del deploy**: si no,
la app publicada mostraría ingresos que nunca se cobraron.

### Configurar MercadoPago para probarlo

1. En [Tus integraciones](https://www.mercadopago.com.ar/developers/panel), crear
   una aplicación de tipo **Checkout Pro** y copiar su access token a
   `MERCADOPAGO_ACCESS_TOKEN`.
2. Crear **dos usuarios de prueba**: uno vendedor (dueño de la aplicación) y uno
   comprador. MercadoPago no deja comprarse a uno mismo.
3. `MERCADOPAGO_NOTIFICATION_URL` se deja **vacía** en desarrollo: a `localhost`
   no le llega ningún webhook, y la confirmación la resuelve la pantalla de
   retorno. Para probar el webhook de verdad hay que exponer el backend (por
   ejemplo con ngrok) y poner ahí `https://<host>/api/payments/webhook`.

`auto_return` solo se le manda a MercadoPago si la URL de retorno es pública:
con un `localhost` rechaza la preference entera.

## Modelo de datos

Diecisiete tablas. Las diez primeras salen del pasaje a tablas del DER original:

`users`, `plan`, `subscription`, `payments`, `artist`, `albums`, `genres`,
`genres_albums`, `song`, `review`.

Las siete últimas son los agregados al DER, documentados y justificados uno por
uno en la [propuesta](../proposal.md#modelo):

`review_likes`, `review_comments`, `follows`, `lists`, `list_albums`,
`list_songs`, `list_likes`.

El diagrama completo, con las restricciones y el comportamiento ante borrados,
está en [`docs/der.md`](../docs/der.md).

### Desvíos respecto del pasaje a tablas original

| Tabla | Cambio | Motivo |
|:-|:-|:-|
| `subscription` | Se agrega PK subrogada `id_subscription`; la clave natural `(id_user, id_plan, subscription_date)` queda como índice UNIQUE | Sequelize 6 no soporta claves foráneas compuestas en asociaciones, y `payments` referencia a esta tabla |
| `payments` | La FK compuesta a `subscription` se reemplaza por `id_subscription` | Consecuencia del punto anterior |
| `subscription` | Se agregan las columnas `end_date` (siempre NULL con el pago único) y `state` (`active / cancelled`) | Con solo la fecha de alta no había forma de saber si una membresía sigue vigente ni de registrar una baja. `end_date` se conserva aunque hoy no se use: es lo que dejaría agregar un plan con vigencia acotada sin volver a tocar el modelo |
| `song` | Se agrega PK subrogada `id_song`; `(id_album, number_track)` queda como índice UNIQUE | `number_track` es el número de pista dentro del álbum: se repite entre álbumes y no identifica una canción por sí solo |
| `review` | La FK `number_track` pasa a llamarse `id_song` | Consecuencia del punto anterior |
| `genres` | La PK es `id_genre` | El pasaje a tablas decía `id_album`, error de tipeo |

En los tres casos la regla de unicidad del modelo original se conserva mediante un
índice UNIQUE: no se perdió ninguna restricción, solo cambió qué columna es la PK.

### Reglas de negocio en el modelo

- Una reseña apunta a un álbum **o** a una canción, nunca a ambos ni a ninguno.
- Un usuario reseña **una sola vez** cada álbum y cada canción. Puede editar o borrar
  esa reseña, y si la borra puede volver a reseñar el ítem; lo que no puede es tener
  dos reseñas publicadas del mismo álbum.
- `rating` va de 0.5 a 5.0, en pasos de media estrella (`DECIMAL(2,1)`).
- Una suscripción tiene `state` y `end_date`. Que haya **una sola** suscripción
  `active` por usuario no se puede garantizar con un índice UNIQUE (MySQL no admite
  índices únicos parciales): esa regla la aplica el service de membresías, que al
  activar una nueva pasa la anterior a `cancelled` dentro de la misma transacción.
- `average_rating` de un álbum es un atributo derivado: se recalcula al crear,
  editar o borrar una reseña.
- El contenido de catálogo (`artist`, `albums`, `song`) tiene `state`
  (`pending | approved | rejected`) y `created_by`: lo que carga el seed entra como
  `approved`, lo que aporta un usuario PRO entra como `pending` hasta que un
  ADMIN lo aprueba.
- La contraseña del usuario nunca sale en una consulta: el `defaultScope` de `User`
  la excluye. Para el login se usa explícitamente `User.scope('withPassword')`.
- El seguimiento entre usuarios es **unidireccional**: seguir a alguien no requiere
  que la otra parte acepte, así que `follows` no lleva ningún atributo de estado.
  Su PK compuesta `(id_follower, id_followed)` es lo que garantiza que no se pueda
  seguir dos veces a la misma persona, y nadie puede seguirse a sí mismo (lo corta
  el service con un 400).
- Una lista es **siempre pública** y no lleva `state`: no es contenido de catálogo,
  así que no pasa por moderación. La PK compuesta de sus tablas intermedias impide
  que el mismo ítem entre dos veces, y `position` —el único atributo de orden propio
  del modelo— lo asigna el service como el siguiente entero libre. A diferencia de
  las reseñas, la baja de un usuario **sí** se lleva sus listas en cascada: son una
  colección personal, no contenido de la comunidad.
- Una lista es de álbumes **o** de canciones, según su columna `type`, y no puede
  tener las dos cosas. No es una validación: `type` decide en cuál de las dos
  tablas intermedias (`list_albums` o `list_songs`) van sus ítems, así que la fila
  mezclada no se puede ni escribir. Es la diferencia con `REVIEW`, donde la
  exclusión álbum/canción sí se valida a nivel de fila porque las dos claves
  foráneas conviven en la misma tabla.

## Pasaje a producción

El único cambio necesario para migrar de MySQL local al servicio cloud es el `.env`:

```
DB_HOST=<host del proveedor>
DB_PORT=<puerto del proveedor>
DB_SSL=true
DB_SSL_CA=<contenido del certificado CA que provee el servicio>
DB_SYNC=false
NODE_ENV=production
```

El código no cambia: `sequelize.ts` ya activa el bloque de SSL cuando `DB_SSL=true`.
