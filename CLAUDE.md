# Reglas de Desarrollo — Musicboxd (DSW TP)

Estas reglas guían al agente mientras se desarrolla Musicboxd (frontend **y** backend).

## Contexto del proyecto

- Proyecto: Musicboxd, catálogo social de música y reseñas. TP de Desarrollo de Software (UTN FRRo).
- Repositorio: https://github.com/SantiiDev/DSW-TP (fork de `utnfrrodsw/tp`, monorepo con
  carpetas `frontend/` y `backend/`).
- Equipo: Santino Gallo (líder, revisa y mergea los PRs), Esterri Juan Ignacio, Siena Santiago.
- El desarrollo debe cumplir los requisitos técnicos y funcionales del TP de la cátedra
  (ver `README.md` y `FAQ.md` en la raíz del repo).

### Decisión de arquitectura clave: la base de datos propia es la fuente de verdad

Musicboxd **no consulta APIs externas de música en runtime**. La metadata de artistas, álbumes,
canciones y géneros se carga **una única vez** mediante un script de seed (`backend/src/seed/`)
que se ejecuta a mano con `npm run seed`.

Consecuencias obligatorias:

- Ningún endpoint de la API ni ningún componente del frontend debe llamar a Spotify, Deezer,
  MusicBrainz ni ninguna otra API de metadata musical.
- Los CRUD de Artista, Álbum, Canción y Género operan **siempre** sobre tablas propias.
- El seed guarda su respuesta cruda en `backend/src/seed/data/*.json`, versionada en git, para que
  el proceso sea reproducible sin conexión a internet.

### División de trabajo por feature (evitar conflictos de merge)

- Santino → `user`, `membership` (plan, subscription, payment), auth
- Esterri → `artist`, `album`, `song`
- Siena → `genre`, `review`, `list`

No modificar ni reescribir código de la feature de otro integrante sin que se pida explícitamente.

**El reparto formal ya está cumplido**: esas features cubren el alcance comprometido en la
propuesta y están todas cerradas. Lo que se desarrolla ahora es alcance adicional voluntario,
que no se reparte por entidad: lo toma quien lo trabaje y se anota en
[`docs/tracking.md`](docs/tracking.md). La feature `list` (listas personalizadas) entró así y
quedó a cargo de Siena.

## Stack obligatorio (no cambiar sin pedido explícito del usuario)

### Frontend

- Vite + React, **en TypeScript** (`.ts` / `.tsx`). No crear archivos `.js` / `.jsx` nuevos.
- Enrutamiento: React Router.
- Estado: Context API + `useReducer` para estado compartido/global; `useState` para estado local
  de componente.
- Estilos: SASS/SCSS con arquitectura 7-1. Nada de CSS-in-JS, styled-components, Tailwind u otro
  framework de estilos salvo pedido explícito.
- Sin librerías de componentes (MUI, Bootstrap, Chakra, etc.) salvo pedido explícito.
- Sin librerías externas de estado (Redux, Zustand, Recoil, etc.).

### Backend

- Node + **Express** + **TypeScript**.
- ORM: **Sequelize v6**, tipando las entidades con `InferAttributes` / `InferCreationAttributes`
  (tipado nativo de Sequelize). No usar `sequelize-typescript` ni decoradores.
- Base de datos: **MySQL 8**, siempre como servicio aparte al que la app se conecta por red.
  **Nunca una DB embebida** (SQLite y compañía quedan descartadas por la cátedra). En
  desarrollo corre local (`DB_HOST=127.0.0.1`, `DB_SSL=false`), por acuerdo con la cátedra;
  en producción, un servicio cloud gestionado. Lo único que cambia entre los dos es el `.env`:
  con `DB_SSL=true` el CA del proveedor se pega en `DB_SSL_CA` y de ahí sale
  `dialectOptions.ssl`. Ver "Pasaje a producción" en el README del backend.
- Validación de entrada: **Zod**, aplicada mediante un middleware antes del controller.
- Autenticación: JWT propio + bcrypt para el hash de contraseñas.
- Pasarela de pago: MercadoPago Checkout Pro (sandbox) con webhook. Se le habla con
  `fetch` (viene con Node), sin el SDK: son dos llamadas y así se ve qué se manda.
  La membresía Pro es un **pago único**: se paga una vez, el acceso no vence y no
  hay renovación ni baja voluntaria. Es lo que hace Checkout Pro, que es el producto
  de MercadoPago para pagos únicos; el cobro recurrente es otro (`preapproval`) y
  necesitaría una columna en el DER para el id de la suscripción externa. Ver la
  sección "Membresías y pasarela de pago" del README del backend.

### Regla común

- No agregar ninguna dependencia nueva sin avisar antes al usuario.

## Estructura de carpetas

### Frontend

Ya está creada (`src/core/`, `src/features/<feature>/{components,models,pages,services,styles}`).
No modificar ni alterar las carpetas sin antes preguntar.

**Una carpeta por componente** (pedido de la cátedra). Cada componente y cada página vive en
una carpeta con su nombre en PascalCase, con todo lo suyo adentro:

```
core/components/SegmentedControl/
  SegmentedControl.tsx        el componente
  SegmentedControl.scss       sus estilos, con el mismo nombre (sin guion bajo)
  SegmentedControl.test.tsx   su test, si tiene
  index.ts                    export * from './SegmentedControl';
```

- El `index.ts` hace que se siga importando como `core/components/SegmentedControl`, sin repetir
  el nombre: mover un componente a su carpeta no obliga a tocar los imports de nadie.
- Cada componente importa **su** `.scss`. `styles/main.scss` queda solo con lo global
  (`abstracts` y `base`): si un componente también se importa ahí, su CSS sale duplicado.
- Variables que comparten varios componentes de una feature van en un parcial de tokens
  (`features/<feature>/styles/_tokens.scss`), que no genera CSS.
- Si un componente usa un bloque BEM que es de otro (por ejemplo `.profile-panel`, que es de
  `ProfileTabContent`), importa el `.scss` de ese otro componente: Vite lo carga una sola vez.
  La única hoja compartida sin dueño es `features/home/styles/static-pages.scss` (las cuatro
  páginas estáticas).
- Todo `core/components` y todas las features ya están migrados.

### Backend

Misma idea que el frontend: **`features/` es el dominio y `shared/` es lo transversal**
(el equivalente de `core/`). No agregar carpetas nuevas en la raíz de `src/`: una feature
nueva es una carpeta adentro de `features/`.

```
backend/src/
  server.ts          arranque: conecta a la DB y escucha
  app.ts             configuración de Express
  routes.ts          monta el router de cada feature
  features/          una carpeta por entidad, con sus cinco capas:
    <feature>/       <x>.routes.ts, <x>.controller.ts, <x>.service.ts,
                     <x>.repository.ts, <x>.schema.ts
  entities/          modelos de Sequelize, uno por tabla del DER (User, Plan,
                     Subscription, Payment, Artist, Genre, GenreAlbum, Album,
                     Song, Review, ReviewLike, ReviewComment, Follow, List,
                     ListAlbum, ListSong, ListLike, Ad) + index.ts con TODAS
                     las asociaciones
  shared/            middlewares (auth, requireRole, validate, errorHandler),
                     config de la DB, errores, tipos comunes
  seed/              carga inicial de datos + data/*.json
  scripts/           mantenimiento de la base (hoy, solo reset-db)
```

Separación de capas estricta: **routes → controller → service → repository → entity**.
El controller no arma queries; el service no toca `req` ni `res`.

Dos reglas de ubicación que no son obvias:

- **`entities/` va afuera de `features/`**, aunque en el frontend los modelos vivan dentro
  de cada feature. Las entidades de Sequelize son un grafo conectado y `entities/index.ts`
  declara todas las asociaciones en un solo lugar para evitar imports circulares. Meterlas
  en las features haría que `review` importe de `album`, `song` y `user`, y `album` de
  `artist` y `genre`.
- **`seed/` no es `scripts/`**: en `seed/` va lo que carga datos iniciales; en `scripts/`,
  las tareas de mantenimiento de la base (hoy, borrar y recrear con `db:reset`).

## Nomenclatura

- Identificadores de código (variables, funciones, componentes, archivos, carpetas): **en inglés**.
- Ramas de git: en inglés, `feature/<issue-number>-<short-description>` (ej: `feature/4-artist-crud`).
- Frontend: componentes en PascalCase (`ArtistCard.tsx`); hooks en camelCase con prefijo `use`
  (`useArtistList.ts`); estilos de un componente con su mismo nombre (`ArtistCard.scss`), y
  parciales de `abstracts` o de tokens con guion bajo (`_variable.scss`, `_tokens.scss`).
- Backend: archivos en kebab-case con sufijo de capa (`album.controller.ts`, `album.service.ts`).
- Comentarios: se permite español para que todo el equipo los entienda fácil, pero deben ser
  claros, breves y en el mismo idioma dentro de un mismo archivo.

## Comentarios obligatorios en el código

- Al inicio de cada componente/archivo: una línea explicando qué hace ese archivo.
- Antes de cada función no trivial: comentario breve de qué recibe y qué devuelve.
- En lógica no obvia (transformaciones de datos, condicionales complejos, efectos): explicar el
  "por qué", no repetir el "qué" ya evidente en el código.
- No comentar cosas obvias (ej: `// declara una variable`).

## Componentes (frontend)

- Solo componentes funcionales con Hooks. Nada de componentes de clase.
- Un componente = una responsabilidad. Si supera ~150-200 líneas o mezcla mucha lógica, dividirlo.
- Props tipadas con un `type` propio y destructuring en la firma del componente.
- Handlers de eventos con prefijo `handle` (`handleClick`, `handleInputChange`).
- Todo fetch/servicio debe manejar estados de `loading`, `error` y datos vacíos, mostrando mensajes
  amigables en la UI (nunca un error crudo de consola).

## Validación de formularios (frontend)

- **No usar la validación del navegador** (pedido de la cátedra): el `<form>` lleva `noValidate` y
  los controles no llevan `required`, `minLength`, `maxLength`, `pattern`, `type="email"` ni
  `type="url"` (para el teclado del celular se usa `type="text"` + `inputMode`). `maxLength`
  tampoco: corta en silencio el texto que se pega; el tope se avisa con la regla `maxLength`.
- Un campo obligatorio que no es de texto (un `Select`, las estrellas, los ítems de una lista)
  también se valida con mensaje: no se deshabilita el botón de guardar sin explicar por qué.
- Las reglas salen de `core/utils/validators` (`required`, `isEmail`, `minLength`, `isUrl`, ...) y
  copian los schemas de Zod del backend, con sus mismos mensajes. Las reglas que se repiten entre
  formularios van en un archivo de la feature (ej: `features/user/models/userRules.ts`).
- El mensaje va debajo del campo con `<FormField error={...}>`, y el control recibe
  `{...fieldErrorProps(id, error)}`: pone `aria-invalid`, que además pinta el borde en rojo.
- Los errores se muestran recién después del primer intento de enviar, y desde ahí se recalculan
  en cada tecla. Mientras haya errores no se llama a la API.
- El backend sigue validando igual: esa es la validación que vale; la del frontend solo avisa antes.

## Modelado de datos (frontend)

- Representar los datos que van/vienen de la API con **clases** en `features/<x>/models/`.
  Ejemplo: `class Artist { constructor(public id: number, public name: string) {} }`.
- Los servicios (`services/xxxService.ts`) mapean la respuesta cruda del backend a estos modelos;
  el resto de la app nunca ve el JSON crudo.
- Cada feature debe tener al menos un servicio propio que centralice sus llamadas HTTP, y ese
  servicio debe usar el `httpClient` compartido de `core/services/`, no `fetch` directo.
- **Única excepción**: `features/home/services/contactService.ts` usa `fetch` para mandar el
  formulario de contacto a Web3Forms. `httpClient` le pega a nuestra API y adjunta el token de
  sesión: usarlo con un servicio externo le mandaría ese token a un tercero.

## API y errores (backend)

- API REST con rutas en plural y en inglés (`/api/albums`, `/api/albums/:id/songs`).
- Códigos de estado correctos: 200/201/204, 400 (validación), 401, 403, 404, 409, 500.
- Formato de error único en toda la API: `{ message: string, errors?: unknown }`.
- Un único middleware de manejo de errores al final del stack de Express: los controllers no
  arman respuestas de error a mano, tiran el error y lo captura el middleware.
- Nunca devolver el hash de contraseña ni datos sensibles en las respuestas.

## Niveles de acceso

`USERS.rol` ∈ `FREE | PRO | ADMIN`.

- Rutas de escritura de catálogo (artista, álbum, canción): requieren `PRO` o `ADMIN`.
- Contenido creado por un `PRO` entra con `state = 'pending'` y solo un `ADMIN` lo aprueba.
- Rutas de moderación y de gestión de planes: solo `ADMIN`.
- El frontend replica esta protección con un componente `ProtectedRoute`, pero **la validación
  real vive siempre en el backend**.

## Estilos (SASS 7-1)

- Mobile-first: primero los estilos para mobile, después media queries para ampliar (`min-width`).
- Breakpoints sugeridos: SM ≥576px, MD ≥768px, LG ≥1024px, como variables SASS en
  `abstracts/_breakpoints.scss`.
- Variables SASS para colores, espaciados y tipografía (`abstracts/_variables.scss`); nada de
  valores hardcodeados repetidos.
- Convención de clases consistente (BEM u otra) dentro de cada componente.

## Buenas prácticas generales

- SUPER IMPORTANTE: No usar patrones o features "avanzados" que excedan el nivel de la materia
  (Server Components, Suspense para data fetching, arquitecturas exageradas, event sourcing, etc.).
  Priorizar código claro y directo por sobre "elegante pero complejo": el código lo tiene que
  poder explicar un estudiante en la defensa oral.
- Reutilizar componentes comunes (inputs, botones, cards) desde `core/components` en vez de
  duplicar código entre features.
- No dejar datos hardcodeados en componentes: todo dato de negocio viene de la API.

## Variables de entorno

- Frontend: `.env` con prefijo `VITE_` para la URL base de la API. Nunca hardcodear URLs.
- Backend: `.env` con la conexión a la base (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`,
  `DB_PASSWORD`, `DB_SSL`, `DB_SSL_CA`, `DB_SYNC`), `JWT_SECRET`, `PORT`, credenciales de
  MercadoPago, el usuario admin del seed (`SEED_ADMIN_*`) y el servicio de metadata usado por
  el seed (`METADATA_*`).
- Mantener siempre un `.env.example` actualizado y **nunca** commitear el `.env` real.

## Testing

- No es obligatorio para regularidad. Para la etapa de aprobación se necesita:
  - Backend: 1 test automatizado por integrante (3) + 1 test de integración.
  - Frontend: 1 test unitario de un componente + 1 test end-to-end.
- Herramientas recomendadas: Vitest + React Testing Library en frontend (integra nativo con Vite),
  Vitest + Supertest en backend, Playwright para el E2E.

## Git / Pull Requests

- Ramas desde `develop`, nombre en inglés.
- PR con descripción breve de qué se hizo y por qué.
- No mergear directo a `main`. Santino revisa y hace squash-merge de los PRs a `develop`.
- Cada PR debe estar vinculado a su issue en el GitHub Project del equipo.

## Qué NO hacer

- No llamar a APIs externas de metadata musical fuera del script de seed.
- No crear archivos `.js` / `.jsx` nuevos en el frontend: el proyecto es TypeScript.
- No sumar librerías de UI, estado o estilos fuera del stack definido arriba.
- No saltear capas en el backend (por ejemplo, un controller consultando el modelo directamente).
- SUPER IMPORTANTE: No inventar arquitecturas o patrones que un estudiante de una materia de DSW
  no manejaría: mantenerlo simple, legible y explicable.
- No tocar ni reescribir la feature de otro integrante sin que se pida explícitamente.
