# Estado del alcance

Qué está terminado y qué falta, punto por punto, contra el alcance comprometido
en la [propuesta](../proposal.md) y los requisitos del
[enunciado](enunciado.md).

Última revisión: **10/10/2026**.

## Requisitos técnicos

### Backend — regularidad

| Requisito | Estado | Dónde |
|:-|:-:|:-|
| Desarrollado en JavaScript (TypeScript sobre Node) | ✅ | `backend/src` |
| Framework web integrable por middlewares | ✅ | Express 5 |
| API web para el frontend | ✅ | API REST bajo `/api` ([routes.ts](../backend/src/routes.ts)) |
| Base de datos persistente por servicio externo, no embebida | ✅ | MySQL 8 como servicio aparte |
| Persistencia mediante un mapper | ✅ | Sequelize 6 con tipado nativo |
| Arquitectura en capas | ✅ | `routes → controller → service → repository → entity` |
| Validación de entrada y manejo de errores por la API | ✅ | Zod en un middleware + `errorHandler` único |
| Dependencias registradas para instalación automática | ✅ | `backend/package.json` |

### Backend — aprobación

| Requisito | Estado | Falta |
|:-|:-:|:-|
| Login propio con al menos 2 niveles de acceso | ✅ | JWT + bcrypt, con `FREE`, `PRO` y `ADMIN` |
| Rutas protegidas según el nivel de acceso | ✅ | `requireAuth` + `requireRole` |
| Ambientes definidos | ✅ | `.env` + `.env.example` |
| 1 test automatizado por integrante (3) | ✅ | Vitest sobre los schemas de Zod: `auth` (Santino), `album` (Esterri), `review` (Siena), más `user`, `follow`, `list`, `payment` y `ad` que se sumaron después — ocho en total, en [`backend/tests/unit`](../backend/tests/unit) |
| 1 test de integración | ✅ | Vitest + Supertest sobre `app.ts`: el circuito de login contra MySQL, en [`backend/tests/integration/auth.test.ts`](../backend/tests/integration/auth.test.ts) |

### Frontend — regularidad

| Requisito | Estado | Dónde |
|:-|:-:|:-|
| Framework de frontend | ✅ | React 19 + Vite |
| HTML5 | ✅ | — |
| CSS con preprocesador y metodología | ✅ | SASS con arquitectura 7-1 y clases BEM |
| Mobile-first | ✅ | Media queries `min-width` desde `abstracts/_breakpoints.scss` |
| Se ve bien en SM, MD y LG | ✅ | Breakpoints 576 / 768 / 1024 |
| Manejo de eventos del usuario | ✅ | Formularios, filtros, paginado |
| Manejo amigable de errores | ✅ | `core/utils/errorHandler` + componente `Alert` |
| Reactividad ante un estado | ✅ | `useState`, `useReducer` y Context |
| Input property / Output property | ✅ | Props tipadas y handlers `on...` en todos los componentes |
| Al menos un servicio | ✅ | Un servicio por feature, todos sobre `core/services/httpClient` |
| Modelos representados con clases o tipos propios | ✅ | `features/<x>/models/` |
| Algún patrón de diseño orientado a objetos | ✅ | Repository en el backend; Service + mapeo a modelos en el frontend |
| Dependencias registradas | ✅ | `frontend/package.json` |

### Frontend — aprobación

| Requisito | Estado | Falta |
|:-|:-:|:-|
| Login y protección de rutas según el nivel de usuario | ✅ | `ProtectedRoute` + `AuthContext` |
| Ambientes definidos | ✅ | `.env` con prefijo `VITE_` |
| 1 test unitario de un componente | ✅ | Vitest + React Testing Library. Hay siete, detallados en el [README del frontend](../frontend/README.md#tests): [`SegmentedControl`](../frontend/src/core/components/SegmentedControl/SegmentedControl.test.tsx) (el más simple, sin mocks), [`MembershipPanel`](../frontend/src/features/membership/components/MembershipPanel/MembershipPanel.test.tsx), que fija la regla del pago único —el panel no ofrece renovar ni dar de baja—, [`RevenueDashboard`](../frontend/src/features/membership/components/RevenueDashboard/RevenueDashboard.test.tsx), el tablero de métricas con y sin ventas, y [`AdModal`](../frontend/src/features/ad/components/AdModal/AdModal.test.tsx), que el anuncio no se pueda saltar antes de los 5 segundos, más los de `PlanForm`, `CreateUserForm` y `ContactPage`. A esos siete se suma [`validators.test.ts`](../frontend/src/core/utils/validators.test.ts), que no es de un componente sino de las reglas de validación compartidas: ocho archivos de test en total |
| 1 test end-to-end | ✅ | Playwright: el login completo desde el navegador ([test](../frontend/e2e/login.spec.ts)) |

## Requisitos funcionales

### CRUDs

| CRUD | Backend | Frontend |
|:-|:-:|:-:|
| Usuario | ✅ | ✅ Panel de administración |
| Artista | ✅ | ✅ |
| Género | ✅ | ✅ |
| Álbum | ✅ | ✅ |
| Canción | ✅ | ✅ |
| Reseña | ✅ | ✅ |
| Plan de membresía | ✅ | ✅ Pestaña "Planes" del panel de administración |

### Listados con filtro y detalle

| Listado | Estado |
|:-|:-:|
| Álbumes filtrados por género y/o año → ficha con tracklist y reseñas | ✅ |
| Reseñas del perfil de un usuario filtradas por calificación → detalle y link al álbum | ✅ |

### Casos de uso / epics

| CUU | Estado | Detalle |
|:-|:-:|:-|
| 1 — Sistema de reseñas (álbumes y canciones) | ✅ | Alta, edición, baja, likes y comentarios |
| 2 — Pasarela de pagos y membresías | ✅ | Checkout Pro en sandbox, webhook y confirmación al volver. Desde el 22/09 la membresía es un **pago único**: se paga una vez, el acceso no vence y no hay renovación ni baja voluntaria (ver la minuta del 22/09) |
| 3 — Aporte y moderación de catálogo | ✅ | Alta en estado `pending` por un `PRO`, aprobación por un `ADMIN` |
| 4 — Feed social y estadísticas avanzadas | ✅ | **Feed social**: la sección `/reviews` con su toggle Comunidad / Amigos, el seguimiento unidireccional entre usuarios (relación `FOLLOWS`) y el panel "Gente para seguir". Desde el perfil se abren las listas de seguidores y seguidos (con seguir/dejar de seguir en cada fila), el buscador de la barra encuentra álbumes, canciones y usuarios, el autor de cada reseña y comentario lleva a su perfil, y la pestaña "Resumen" muestra la actividad reciente. **Estadísticas avanzadas** ("Tu año en música"): pestaña "Estadísticas" del perfil propio con horas de música calificada, actividad mes a mes, géneros más escuchados, top de artistas y álbumes, décadas y distribución de notas, con selector de año. Salen de `GET /api/reviews/stats/me`, restringido a `PRO`/`ADMIN`; el service además relee el rol de la base para cortar un token viejo de alguien a quien un ADMIN le bajó el rol. Un `FREE` ve una vista previa bloqueada con acceso a `/pro`. Gráficos en SVG propio, sin dependencias nuevas (`core/components/charts`). |

La relación entre casos de uso comprometida en la propuesta **cierra de punta a
punta**: el pago del CUU 2 convierte al usuario en `PRO`, eso lo habilita a
aportar catálogo en el CUU 3, sobre ese catálogo aprobado se publican las reseñas
del CUU 1, y esas reseñas son las que alimentan el CUU 4: el feed las lleva a la
gente que sigue al autor y las estadísticas avanzadas las resumen para su dueño. Cada eslabón usa como entrada la data que registró el
anterior, que es lo que pide la cátedra.

### Alcance adicional voluntario

| Ítem | Estado |
|:-|:-:|
| Interacción social sobre reseñas (likes y comentarios) | ✅ |
| Listas personalizadas de álbumes **y de canciones** | ✅ CRUD completo (`LISTS`, `LIST_ALBUMS`, `LIST_SONGS`, `LIST_LIKES` en el DER): alta, edición, baja, agregar/sacar ítems y "me gusta". Una lista es de álbumes **o** de canciones, nunca de las dos: lo dice `LISTS.type`, que decide en qué tabla intermedia van sus ítems. Armar y curar listas es un **beneficio Pro**; un `FREE` las ve, las comparte y les da "me gusta", y si intenta crear una ve el cartel que lo invita a `/pro`. `/lists` explora por "Top Listas" y "Listas en Tendencia" con filtro por género, y desde la ficha de un álbum **o de una canción** se agrega a una lista propia del tipo que corresponda. El CRUD base entró por los PR #17 y #18; las listas de canciones y el gate Pro, después |
| Ranking global de usuarios más activos | ✅ Panel "Más activos" en la columna lateral de `/reviews`, ordenado por un puntaje que combina reseñas publicadas y seguidores (`GET /api/users/ranking`) |
| Dashboard de administración con métricas de ingresos | ✅ Pestaña **Métricas** de `/admin` (la que abre por defecto): ingresos históricos y del año, ventas, ticket promedio, conversión a Pro, curva de ingresos mes a mes, usuarios activos por plan y últimas ventas. Sale de `GET /api/payments/stats` (solo `ADMIN`) y se calcula siempre sobre los pagos reales; para la defensa hay un seed de demo aparte (`npm run seed:demo-sales`) que se borra con `-- --clean` antes del deploy |
| Publicidad para usuarios Free (tabla `ADS`) | ✅ CRUD completo en la pestaña **Anuncios** de `/admin` (alta, edición, pausar sin borrar y baja) y el panel que ve un `FREE` mientras navega. Es lo que le da sentido al "sin anuncios" que la propuesta promete como beneficio Pro, así que se cuenta también como deuda saldada (ver abajo). El detalle de quién lo ve y cuándo está en el [README del frontend](../frontend/README.md#la-publicidad-que-ve-un-usuario-free) |
| Personalización de perfil Pro | ✅ Un `PRO` o `ADMIN` elige un **banner** (por URL, igual que el avatar, con un deslizador para elegir qué parte de la imagen se ve) y un **color de acento** de una paleta cerrada, que tiñe su ficha (banner, borde del avatar y pestañas) y deja una franja de ese color en sus reseñas, comentarios y listas. Desde "Editar perfil", con vista previa en vivo; un `FREE` ve un cartel hacia `/pro`. Además, un **badge Pro** metálico aparece al lado del nombre en todo lugar donde un usuario se muestra a otros: reseñas, comentarios, listas, filas de la comunidad y la navbar (Admin lleva el suyo, en acero). Columnas `USERS.url_banner`, `USERS.banner_position` y `USERS.profile_color` en el DER. La API rechaza con 403 cargarlos en una cuenta `FREE`, mirando el rol de la base y no el del token; si un `PRO` pasa a `FREE`, sus datos se conservan pero no se muestran |

## Documentación de la entrega

| Contenido | Regularidad | Estado |
|:-|:-:|:-:|
| Propuesta actualizada | X | ✅ |
| Links a los PR | X | ✅ [tracking.md](tracking.md) y [propuesta](../proposal.md#pull-requests) |
| Instrucciones de instalación | X | ✅ [README del proyecto](../README.md) |
| Minutas de reunión y avance | X | ⚠️ [minutas.md](minutas.md) — faltan las reuniones anteriores al 09/09 |
| Tracking de features, bugs e issues | X | ✅ [tracking.md](tracking.md) |
| Documentación de la API | Aprobación | ❌ |
| Evidencia de ejecución de tests | Aprobación | ❌ |
| Video demo | Aprobación | ❌ |
| Deploy y credenciales | Aprobación | ❌ |

## Deuda conocida

Cosas que funcionan pero no están como deberían, ordenadas por prioridad:

1. ~~**Los beneficios Pro no se cumplen todos.**~~ **Resuelto (30/09, rama
   `refactor/tech-debt`).** La tabla comparativa de `/pro` (`ProComparison.tsx`)
   ofrecía cosas sin implementar: "Largo ilimitado en reseñas", "Acceso
   anticipado a funciones", "Soporte prioritario" y "Listas (máx. 10)" para
   Free, cuando un `FREE` no puede crear listas. Ahora lista solo lo que existe.
   Se corrigieron también las mismas promesas en `ProBenefits`, `ProSalesView`,
   `ProCheckoutPage` y `ProMemberView` ("Listas ilimitadas", "Hasta 10 listas",
   "Soporte prioritario"), y en las preguntas frecuentes: el botón "Reportar"
   que no existe, el descuento para estudiantes y la escala de "1 a 5" estrellas
   (es de media a cinco, de a media estrella).

   > La personalización de perfil se resolvió el 28/09 en la rama
   > `feature/profile-customization` (ver "Alcance adicional voluntario").

   > **Resuelto (29/09, rama `feature/ads-2`; ajustes el 30/09 en `feature/ads-3`).**
   > La parte de "sin anuncios". La
   > propuesta promete una "experiencia sin anuncios" como beneficio Pro
   > (`proposal.md`) y siete componentes del frontend lo repiten, pero no existía
   > ningún anuncio que ver, así que el beneficio no significaba nada. Se agregó
   > la tabla `ADS` con su CRUD de `ADMIN` (pestaña **Anuncios** de `/admin`) y un
   > panel que se le muestra a un usuario `FREE` cada 20 segundos, con un botón
   > "Saltar" que se habilita a los cinco segundos y un acceso directo a `/pro`.
   > El panel **no bloquea el sitio**: flota sobre el contenido pegado a un
   > costado y se puede seguir navegando con él en pantalla, pero no se va solo.
   > De los cinco anuncios del seed, el quinto es la propia membresía Pro, que es
   > el único con enlace interno (`/pro`). Un `PRO`, un `ADMIN` y un visitante sin
   > cuenta no ven ninguno.
   >
   > En `feature/ads-3` se bajó el intervalo de 60 a 20 segundos, la rotación pasó a
   > arrancar en un anuncio al azar (con el índice en memoria, cada recarga volvía a
   > empezar por el mismo) y el anuncio dejó de aparecer sobre un diálogo abierto:
   > si al cumplirse la espera hay un modal en pantalla, se posterga. Se sumó
   > además la vista previa de la imagen en el formulario de alta y los dos tests de
   > la feature (`ad.schema` en el backend, `AdModal` en el frontend).

> **Resuelto (17/09, PR #17 y #18).** `/lists` mostraba datos fijos en sus tres secciones
> (`TopListsSection`, `TrendingListsSection`, `ExploreTagsSection`), con
> portadas que además salían de `placehold.co` —una llamada externa en
> runtime—. Se construyó el CRUD completo de listas personalizadas (entidades
> `LISTS`, `LIST_ALBUMS` y `LIST_LIKES`, backend en capas y la feature `list`
> del frontend) y las tres secciones ahora piden datos reales a la API. Era el
> último foco de datos inventados del proyecto: la sección `/members`, que era
> el otro, se había eliminado junto con sus cuatro componentes al construir el
> feed social.
