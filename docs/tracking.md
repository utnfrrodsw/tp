# Tracking de features, bugs e issues

Registro del trabajo del equipo sobre el repositorio
[SantiiDev/DSW-TP](https://github.com/SantiiDev/DSW-TP).

La herramienta de trackeo es **GitHub Issues + GitHub Projects** sobre el mismo
repositorio, para que cada issue quede vinculado a su rama y a su pull request
sin tener que sincronizar dos sistemas a mano. Este archivo es el volcado de ese
tablero al repositorio, que es lo que pide [`docs.md`](../docs.md).

## Cómo se trabaja

1. Cada ítem del alcance de la [propuesta](../proposal.md) se abre como un
   **issue** y se asigna a un integrante según el reparto de features.
2. Del issue sale una rama desde `develop`, con el nombre
   `feature/<número-de-issue>-<descripción-corta>` (o `fix/<descripción>` para
   los arreglos). El número en el nombre de la rama es lo que ata la rama al
   issue.
3. Al terminar se abre un **pull request** contra `develop`, vinculado al issue.
4. **Santino Gallo** revisa y mergea. Nadie mergea su propio PR.
5. `main` queda para las versiones entregadas a la cátedra.

## Reparto de features

Definido para que dos personas no toquen los mismos archivos y no haya conflictos
de merge (está también en [`CLAUDE.md`](../CLAUDE.md)):

| Integrante | Features a cargo |
|:-|:-|
| Santino Gallo | `user`, `auth`, `membership` (plan, subscription, payment), seed del catálogo |
| Juan Ignacio Esterri | `artist`, `album`, `song` |
| Santiago Siena | `genre`, `review`, `list` |

> **El reparto formal ya está cumplido**: las features de la tabla son las del
> alcance comprometido en la [propuesta](../proposal.md) y están todas cerradas.
> Lo que se trabaja de acá en adelante es **alcance adicional voluntario**, que
> no se reparte por entidad: lo toma quien lo desarrolle y se anota en la tabla
> de issues como cualquier otra fila. `list` entró así y quedó a cargo de
> Santiago Siena.

## Issues

Los títulos son los de las ramas que salieron de cada issue.

| # | Issue | Responsable | Estado |
|:-:|:-|:-|:-|
| [#1](https://github.com/SantiiDev/DSW-TP/issues/1) | CRUD de Usuario | Santino Gallo | Cerrado |
| [#2](https://github.com/SantiiDev/DSW-TP/issues/2) | Listado de reseñas en el perfil de un usuario | Santiago Siena | Cerrado |
| [#3](https://github.com/SantiiDev/DSW-TP/issues/3) | CUU 2 — Upgrade a Pro con pasarela de pago | Santino Gallo | Cerrado |
| [#4](https://github.com/SantiiDev/DSW-TP/issues/4) | CRUD de Artista | Juan Ignacio Esterri | Cerrado |
| [#5](https://github.com/SantiiDev/DSW-TP/issues/5) | CRUD de Álbum | Juan Ignacio Esterri | Cerrado |
| [#6](https://github.com/SantiiDev/DSW-TP/issues/6) | Listado de álbumes con filtro por género y año | Juan Ignacio Esterri | Cerrado |
| [#7](https://github.com/SantiiDev/DSW-TP/issues/7) | CRUD de Género | Santiago Siena | Cerrado |
| [#8](https://github.com/SantiiDev/DSW-TP/issues/8) | CRUD de Reseña | Santiago Siena | Cerrado |
| [#9](https://github.com/SantiiDev/DSW-TP/issues/9) | CUU 1 — Publicar y gestionar una reseña | Santiago Siena | Cerrado |
| [#10](https://github.com/SantiiDev/DSW-TP/issues/10) | Seed del catálogo desde Deezer | Santino Gallo | Cerrado |
| — | Documentación de la entrega (`docs/`, README del proyecto, DER en Mermaid) | Santino Gallo | Cerrado (falta abrir el issue) |
| — | UI de administración del CRUD de Plan de membresía | Santino Gallo | Cerrado (falta abrir el issue) |
| — | Seguimiento entre usuarios (relación `FOLLOWS`) | Santino Gallo | Cerrado (falta abrir el issue) |
| — | CUU 4 (parte 1) — Feed social de reseñas | Santiago Siena | Cerrado (falta abrir el issue) |
| — | CUU 4 (parte 2) — Estadísticas avanzadas y bloqueo para `FREE` | Santino Gallo | Cerrado (entró por el PR #15; falta abrir el issue) |
| #11 | Tests automatizados de backend y frontend | Juan Ignacio Esterri | Cerrado |
| #12 | Ranking global de usuarios más activos | Juan Ignacio Esterri | Cerrado |
| — | Listas personalizadas de álbumes (CRUD completo) | Santiago Siena | Cerrado (entró por los PR #17 y #18; falta abrir el issue) |
| — | Listas de canciones (`LISTS.type` + `LIST_SONGS`) y alta de listas restringida a `PRO`/`ADMIN` | Santiago Siena | Cerrado (entró por el PR #19; falta abrir el issue) |
| — | Correcciones de listas, paginado del panel de administración y de las contribuciones del perfil | Juan Ignacio Esterri | Cerrado (entró por commits directos a `develop`; falta abrir el issue) |
| — | Membresía Pro como **pago único** en lugar de suscripción mensual | Santino Gallo | Cerrado (entró por un commit directo a `develop`; falta abrir el issue) |
| — | Dashboard de administración con métricas de ingresos | Santino Gallo | Cerrado (entró por el PR #20; falta abrir el issue) |
| — | Personalización de perfil Pro (banner, color de acento y badge Pro en reseñas, comentarios, listas y navbar) | Juan Ignacio Esterri | Cerrado (entró por el PR #22; falta abrir el issue) |
| — | Anuncios para usuarios Free (tabla `ADS`, panel lateral y CRUD de administración) | Santiago Siena | Cerrado (entró por los PR #23 y #27: el segundo bajó el intervalo a 20 segundos, hizo arrancar la rotación al azar, evitó que el anuncio tape un modal abierto y sumó la vista previa de la imagen y los dos tests de la feature; falta abrir el issue) |
| — | Correcciones de interfaz: tope de filas del panel lateral y del ranking, y `z-index` del `Select` sobre los modales | Juan Ignacio Esterri | Cerrado (entró por el PR #21; falta abrir el issue) |
| — | Una carpeta por componente en todo el frontend | Santino Gallo | Cerrado (entró por el PR #24; falta abrir el issue) |
| — | Validación de formularios propia, sin la del navegador | Santino Gallo | Cerrado (entró por el PR #25; falta abrir el issue) |
| — | Los beneficios Pro dejan de prometer lo que no existe | Santino Gallo | Cerrado (entró por el PR #26; falta abrir el issue) |
| — | Buscador en vivo y recargas sin parpadeo en el panel de administración | Juan Ignacio Esterri | Cerrado (entró por el PR #28; falta abrir el issue) |

> **Las diecisiete filas sin número están todas cerradas, pero ninguna tiene su
> issue abierto.** Se trabajaron antes de crearlo: cuatro entraron juntas por el
> PR #13, la de CUU 4 parte 2 por el PR #15, la de listas personalizadas por los
> PR #17 y #18, la de listas de canciones por el PR #19, las ocho últimas por los
> PR #20 al #28, y las dos restantes por commits directos a `develop`. Hay que
> crearlas en el GitHub Project y vincularlas a esos pull requests, para que la
> trazabilidad quede completa antes de la entrega: es el ítem de mayor prioridad
> de los que quedan, porque sin eso la mitad del trabajo no tiene el recorrido
> issue → rama → PR que este mismo documento declara como método.

> Los números #11 y #12 salen del nombre de las ramas
> (`feature/11-testing-setup` y `feature/12-user-ranking`), que por convención
> lleva el número del issue. **Verificar en el GitHub Project que esos dos issues
> estén realmente abiertos y linkeados a su PR**, y ponerles el link acá.

### Pendientes de abrir

Lo que falta del alcance y todavía no tiene issue. El detalle de cada uno está en
[estado-alcance.md](estado-alcance.md).

| Ítem | Responsable propuesto | Prioridad |
|:-|:-|:-|
| Documentación de la API | Santiago Siena | Alta (aprobación) |
| Evidencia de ejecución de los tests automáticos | Juan Ignacio Esterri | Alta (aprobación) |
| Video demo de la aplicación | Santiago Siena | Alta (aprobación) |
| Deploy y credenciales de la app publicada | Santino Gallo | Alta (aprobación) |
| Merge de la entrega (`develop` → `main`) y apertura de los issues faltantes | Santino Gallo | Alta (regularidad) |

> **Reparto de lo que queda.** Se asigna así a propósito: el historial de commits
> está desparejo (ver [Deuda de proceso](#deuda-de-proceso)), y estos entregables
> son la última oportunidad de equilibrarlo antes de la defensa. Esterri toma la
> evidencia de tests porque es el autor del setup de testing (PR #15), Siena la
> documentación de la API y el video, y Santino el deploy y el merge de la
> entrega, que dependen de `.env` y de las credenciales de MercadoPago que él
> configuró.

> Los tests automatizados (8 unitarios + integración en el backend, unitarios de
> componente + E2E en el frontend) estaban en esta lista y **ya están hechos**:
> entraron por el PR #15 y después se sumaron los de `follow` (PR #16), `list`
> (PR #17), `payment` (PR #20), `user` (PR #22) y `ad` (PR #27). Lo que
> falta de ese ítem es la *evidencia de ejecución*, que es un entregable de
> documentación aparte.
>
> "Conectar `/lists` a la API" también estaba en esta lista y se sacó: se
> resolvió con el CRUD de listas personalizadas, que entró por los PR #17 y #18
> (ver la fila de arriba).

## Pull requests

Todos contra `develop`, salvo donde se aclara. Revisados y mergeados por Santino
Gallo.

| PR | Rama | Contenido | Fecha | Autor |
|:-:|:-|:-|:-:|:-|
| [#1](https://github.com/SantiiDev/DSW-TP/pull/1) | `feature/10-catalog-seed` | Seed del catálogo desde Deezer, en dos etapas | 13/08 | Santino Gallo |
| [#2](https://github.com/SantiiDev/DSW-TP/pull/2) | `feature/1-user-crud` | CRUD de usuario y autenticación con JWT y roles | 13/08 | Santino Gallo |
| [#3](https://github.com/SantiiDev/DSW-TP/pull/3) | `feature/1-user-crud` | Panel de administración y ajustes visuales del CRUD | 14/08 | Santino Gallo |
| [#4](https://github.com/SantiiDev/DSW-TP/pull/4) | `feature/1-user-crud` | Interfaz del perfil de usuario | 18/08 | Santino Gallo |
| [#6](https://github.com/SantiiDev/DSW-TP/pull/6) | `feature/1-user-crud` → `main` | Baja lógica de usuarios en vez de borrado. **Revertido el 26/08**: el merge fue contra `main` en vez de `develop`. El contenido volvió a entrar por la vía normal. | 21/08 | Santino Gallo |
| [#7](https://github.com/SantiiDev/DSW-TP/pull/7) | `feature/4-artist-crud` | CRUD de artista, incluido el circuito de propuestas | 22/08 | Juan Ignacio Esterri |
| [#8](https://github.com/SantiiDev/DSW-TP/pull/8) | `feature/7-genre-crud` | CRUD de género: lecturas públicas, escritura solo ADMIN | 22/08 | Santiago Siena |
| [#9](https://github.com/SantiiDev/DSW-TP/pull/9) | `fix/genre-detail-improvements` | Ficha de género: tarjetas de álbum, filtros y paginado | 25/08 | Santiago Siena |
| [#10](https://github.com/SantiiDev/DSW-TP/pull/10) | `feature/5-album-crud` | CRUD de álbum y canción, colas de solicitudes, explorador conectado a datos reales | 28/08 | Juan Ignacio Esterri |
| [#11](https://github.com/SantiiDev/DSW-TP/pull/11) | `feature/8-review-crud` | CRUD de reseña con interacción social (likes y comentarios) | 28/08 | Santiago Siena |
| [#12](https://github.com/SantiiDev/DSW-TP/pull/12) | `feature/9-review-epic-publish` | Página de detalle de reseña y pestañas de ítems calificados | 05/09 | Santiago Siena |
| [#13](https://github.com/SantiiDev/DSW-TP/pull/13) | `feature/13-social-feed` | Cuatro commits: documentación de la entrega, ABM de planes, seguimiento entre usuarios y CUU 4 (feed social) | 10/09 | Santino Gallo y Santiago Siena |
| [#14](https://github.com/SantiiDev/DSW-TP/pull/14) | `docs/tracking-update` | Actualización del tracking con lo que realmente entró por el PR #13 | 10/09 | Santino Gallo |
| [#15](https://github.com/SantiiDev/DSW-TP/pull/15) | `feature/11-testing-setup` | Seis commits: los tests automatizados de las dos apps (3 unitarios + integración en backend, unitario de componente + E2E en frontend), CUU 4 (parte 2) con las estadísticas avanzadas, buscador y seguidores funcionales, panel de membresía y mejoras de interfaz del panel de administración | 16/09 | Juan Ignacio Esterri y Santino Gallo |
| [#16](https://github.com/SantiiDev/DSW-TP/pull/16) | `feature/12-user-ranking` | Ranking global de usuarios más activos y unificación del encabezado duplicado de `/lists` y `/reviews` | 16/09 | Juan Ignacio Esterri |
| [#17](https://github.com/SantiiDev/DSW-TP/pull/17) | `custom-lists` | CRUD completo de listas personalizadas (backend + frontend): entidades `LISTS`, `LIST_ALBUMS` y `LIST_LIKES`, la feature `list` en las dos apps y las tres secciones de `/lists` conectadas a la API | 17/09 | Santiago Siena |
| [#18](https://github.com/SantiiDev/DSW-TP/pull/18) | `fixed-list` | Correcciones sobre el CRUD de listas | 18/09 | Santiago Siena |
| [#19](https://github.com/SantiiDev/DSW-TP/pull/19) | `fixed-list2` | Listas de canciones (`LISTS.type` + `LIST_SONGS`), alta de listas restringida a `PRO`/`ADMIN` con el cartel `ProOnlyNotice`, gestor y selector de ítems genéricos (`ListItemManager` / `ListItemPicker`), `useCopyLink` para compartir, y la actualización de `der.md`, `proposal.md`, `estado-alcance.md` y este archivo | 21/09 | Santiago Siena |
| [#20](https://github.com/SantiiDev/DSW-TP/pull/20) | `feature/admin-revenue-dashboard` | Dashboard de administración con métricas de ingresos: pestaña **Métricas** de `/admin`, `GET /api/payments/stats` restringido a `ADMIN` y el seed de ventas de demo para la defensa | 24/09 | Santino Gallo |
| [#21](https://github.com/SantiiDev/DSW-TP/pull/21) | `fix/minor-bugs` | Tope de filas en el panel lateral de sugerencias y en el ranking para evitar el doble scroll, `z-index` del panel de `Select` por encima de los modales, y limpieza del alcance voluntario en la documentación | 27/09 | Juan Ignacio Esterri |
| [#22](https://github.com/SantiiDev/DSW-TP/pull/22) | `feature/profile-customization` | Personalización de perfil Pro en las dos apps: banner, color de acento y badge Pro metálico, con las columnas `USERS.url_banner`, `USERS.banner_position` y `USERS.profile_color` documentadas en el DER | 28/09 | Juan Ignacio Esterri |
| [#23](https://github.com/SantiiDev/DSW-TP/pull/23) | `feature/ads-2` | Publicidad para usuarios Free: tabla `ADS`, CRUD de administración en la pestaña **Anuncios** de `/admin` y el panel que rota anuncios mientras un `FREE` navega | 29/09 | Santiago Siena |
| [#24](https://github.com/SantiiDev/DSW-TP/pull/24) | `refactor/component-folders` | Una carpeta por componente en todo el frontend (pedido de la cátedra): cada componente y cada página con su `.tsx`, su `.scss`, su test y su `index.ts` | 29/09 | Santino Gallo |
| [#25](https://github.com/SantiiDev/DSW-TP/pull/25) | `fix/custom-form-validation` | Validación de formularios propia en lugar de la del navegador: `noValidate`, reglas desde `core/utils/validators` que copian los schemas de Zod, y el mensaje debajo del campo con `FormField` | 30/09 | Santino Gallo |
| [#26](https://github.com/SantiiDev/DSW-TP/pull/26) | `refactor/tech-debt` | Los beneficios Pro dejan de prometer lo que no existe: se corrigieron `ProComparison`, `ProBenefits`, `ProSalesView`, `ProCheckoutPage`, `ProMemberView` y las preguntas frecuentes | 30/09 | Santino Gallo |
| [#27](https://github.com/SantiiDev/DSW-TP/pull/27) | `feature/ads-3` | Ajustes sobre los anuncios: intervalo de 20 segundos, rotación que arranca en un anuncio al azar, el anuncio no aparece sobre un modal abierto, vista previa de la imagen en el alta y los dos tests de la feature (`ad.schema` y `AdModal`) | 30/09 | Santiago Siena |
| [#28](https://github.com/SantiiDev/DSW-TP/pull/28) | `feature/admin-panel-improvements` | Buscador en vivo y recargas sin parpadeo en el panel de administración | 30/09 | Juan Ignacio Esterri |
| [#29](https://github.com/SantiiDev/DSW-TP/pull/29) | `fixissues` | Actualización de la documentación: los PR #19 a #28 en la propuesta, este archivo y la revisión del estado del alcance | 03/10 | Santiago Siena |

> Las ramas `custom-lists`, `fixed-list` y `fixed-list2` se borraron después de
> mergearse, así que el trabajo se sigue por su pull request y no por la rama.

> El PR #5 del historial del repositorio pertenece al repositorio original
> `utnfrrodsw/tp`, anterior al fork, y no es trabajo del grupo.

> **Sobre el PR #13.** El trabajo se había separado en tres ramas encadenadas
> (`docs/entrega-regularidad` → `feature/12-user-follow` → `feature/13-social-feed`)
> para que cada parte se revisara por separado. Como estaban apiladas, la última
> contenía las tres, y al mergearla entraron los cuatro commits de una sola vez;
> los otros dos pull requests quedaron sin diferencias que mostrar y se cerraron.
> Se deja asentado acá porque el historial de GitHub muestra un solo PR donde el
> reparto del trabajo fue de dos integrantes.

## Bugs y correcciones

| Qué | Cómo se resolvió | Fecha |
|:-|:-|:-:|
| El borrado de usuario eliminaba la fila y se llevaba puestas sus reseñas | Se cambió por baja lógica (`state = 'suspended'`) con un endpoint inverso para reactivar | 21/08 |
| PR #6 mergeado contra `main` en lugar de `develop` | Se revirtió el merge en `main` y el contenido se reincorporó por `develop` | 26/08 |
| Errores de maquetado en el explorador de música y en el listado de álbumes | Corrección de CSS (centrado, componentes, contenedores) | 25/08 y 01/09 |
| El índice único de la base quedaba mal armado al recrear las tablas: con `sync({ alter: true })`, cada arranque duplicaba los índices sin nombre hasta el límite de 64 de MySQL | Los índices únicos se declaran con nombre en las entidades (ver `user.entity.ts`), así `sync` los reconoce y no los duplica. El script `npm run db:fix-indexes` que limpiaba las bases afectadas se eliminó el 18/09 (`8e208f2`); una base vieja se rehace con `npm run db:reset` | — |
| Bases creadas con el nivel `PATRON`, que se eliminó del modelo | Se migraban con el script `npm run db:migrate:patron`, que se eliminó el 18/09 (`8e208f2`). Una base anterior a ese cambio se rehace con `npm run db:reset` | — |
| Dos integrantes escribieron `optional-auth.ts` en paralelo, con comportamientos opuestos ante un token inválido | Se resolvió a favor de **ignorar el token inválido y seguir como visitante**, en lugar de cortar con 401. El `httpClient` no maneja el 401, así que cortar dejaría a alguien con la sesión vencida viendo un error en una página pública (`/reviews`) en vez del contenido | 10/09 |
| El precio de un plan con centavos se mostraba redondeado ($1.750,50 salía como "$ 1.751") | `Plan.priceLabel` muestra los decimales solo cuando el monto los tiene | 10/09 |
| `.review-card` estaba definida dos veces (`_review.scss` y `_members-explore.scss`) y solo se resolvía bien por el orden de los imports | La colisión desapareció al eliminar `/members` y su hoja de estilos | 10/09 |
| Pausar o reanudar un anuncio parecía recargar el panel de administración: el listado desaparecía un instante detrás del "Cargando anuncios..." y el cartel de confirmación aparecía de la nada empujando la tabla | Las cuatro operaciones actualizan la fila en memoria con el anuncio que devuelve la API (`setData` de `useFetch`) en vez de volver a pedir la lista con `reload`, que prendía `isLoading`. El cartel quedó siempre en pantalla, con un tono `neutral` que dice "Sin cambios", así el hueco está reservado desde el primer render | 30/09 |
| El anuncio de un usuario Free podía aparecer arriba de un formulario a medio llenar (una reseña, una lista) | `AdRotator` posterga la aparición mientras haya un diálogo abierto, que reconoce por el `aria-modal="true"` de `ConfirmDialog` y `FormModal`. Se hizo más visible al bajar el intervalo de 60 a 20 segundos | 30/09 |
| La rotación de anuncios arrancaba siempre en el mismo: el índice vive en memoria y cada recarga de la página lo devolvía a cero | El índice inicial se sortea cuando llegan los anuncios, y desde ahí la rotación sigue avanzando de a uno | 30/09 |
| Revisión de seguridad: una cuenta suspendida, o a la que un ADMIN le bajó el rol, seguía operando con su token viejo hasta 7 días | `requireAuth` y `optionalAuth` releen el rol y el estado del usuario en la base en cada request (`shared/auth/session.ts`) | 12/10 |
| Revisión de seguridad: el circuito de pago no controlaba importe ni moneda, un reembolso no quitaba el Pro y un ADMIN que compraba Pro quedaba como PRO | `confirmPayment` exige el precio del plan en la moneda configurada; los pagos `refunded`/`charged_back` anulan el pago, cancelan la suscripción y devuelven el rol a FREE; el cambio de rol por membresía nunca toca a un ADMIN | 12/10 |
| Revisión de seguridad: sin límite de intentos en login/registro/webhook, URLs `javascript:` aceptadas en avatar, banner, portada y anuncios, login con tiempo distinto según si el email existe, comodines de `LIKE` sin escapar y errores 4xx de `express.json()` devueltos como 500 | `rate-limit.ts` propio (sin librerías) y headers de seguridad en `app.ts`; `z.url({ protocol: /^https?$/ })` y `//` rechazado en los enlaces de anuncios; bcrypt contra un hash de relleno; `escapeLike` en todos los filtros; el errorHandler respeta el status 4xx; JWT con algoritmo fijo y `JWT_SECRET` fuerte obligatorio en producción | 12/10 |
| Valores hardcodeados en el frontend: la URL de Web3Forms, las portadas de `public/images` en los Hero de la home y de `/pro`, el año del footer, PayPal en las preguntas frecuentes, "Popular Esta Semana" sin ventana de tiempo, topes copiados en varios componentes y colores repetidos en los `.scss` | `VITE_WEB3FORMS_URL`; `FloatingCovers` trae las portadas del catálogo desde la API; año calculado; textos corregidos; `MAX_PENDING_PROPOSALS` en `core/utils/catalogRules.ts` y `MIN/MAX_RELEASE_YEAR` en `album/models/Album.ts`; `$color-star`, `$color-warning`, `$color-amber` y `$color-placeholder` en `_variable.scss` | 12/10 |
| La pestaña "Planes" del panel permitía crear, borrar y renombrar planes, y eso rompía la venta: el sistema busca el plan Pro por su nombre y `/pro` solo sabe mostrar Free y Pro | Se dejó solo el cambio de precio del plan pago: el backend quitó `POST` y `DELETE /api/plans`, el `PATCH` acepta únicamente `amount` (mayor a cero) y rechaza tocar el plan gratuito; el panel lista los planes y muestra solo "Cambiar precio" en el Pro. **Pendiente de decisión del equipo:** la propuesta compromete un CRUD completo de Plan de membresía | 12/10 |

## Deuda de proceso

Cosas que se hicieron fuera del flujo acordado y hay que regularizar antes de la
entrega. Se dejan asentadas acá en lugar de taparlas, porque afectan la
trazabilidad del trabajo:

- **El epic de membresía y pago (issue #3) entró sin pull request.** Todo el
  backend de `plan`, `subscription` y `payment`, más las pantallas de `/pro`,
  llegaron a `develop` en el commit directo `21da334`, cuyo mensaje además dice
  "Frontend correction in music and albums" y no refleja lo que contiene.
  **Acción**: abrir el PR de la entrega (`develop` → `main`) y describir ahí el
  alcance del epic, para que el trabajo quede vinculado al issue #3.
- **Otros seis commits fueron directos a `develop`** sin pasar por PR:
  `09afad5`, `64f2f3f`, `cad8b1b`, `cb3164a`, `21da334` y `1fc048d`.
- **Después del PR #17 entraron cuatro commits directos más a `develop`**:
  `4a1a3a1` y `ff6f741` (17/09, efectos de hover reemplazados por contraste de
  color) y `d5e7e48` y `8e208f2` (18/09, correcciones de estilos y simplificación
  de código). Son retoques transversales, no una feature, pero igual tendrían que
  haber salido por una rama.
- **Después del PR #19 entraron dos commits directos más a `develop`**:
  `34a713a` y `323e3f0` (22/09, filtro de género de listas, criterio real de "en
  tendencia", paginado del panel de administración y de las contribuciones del
  perfil, colisión de clases CSS en la home y reglas faltantes del `.gitignore`).
  Mismo caso que los anteriores: son correcciones, pero tendrían que haber salido
  por una rama.
- **El pago único también entró por un commit directo a `develop`**: `587ca90`
  (22/09). Es un cambio de alcance con 30 archivos tocados, de los que más tenía
  que haber salido por una rama y un pull request.
- **Después del PR #26 entraron dos commits directos más a `develop`**:
  `12fdf81` ("Fix error load") y `da1b944` ("Fix css errors"), los dos del 30/09.
  Mismo caso que los anteriores: son correcciones, pero tendrían que haber salido
  por una rama.
- **`main` está 81 commits atrás de `develop`** (54 sin contar los merges),
  medido el 10/10/2026 sobre las ramas de GitHub con
  `git rev-list --count origin/main..origin/develop`. La entrega de regularidad
  tiene que salir de un merge de `develop` a `main`.
- **La carga de trabajo está repartida de forma despareja** en el historial: de
  los 72 commits del desarrollo (sin contar merges ni el historial heredado del
  fork), 44 son de Santino Gallo, 18 de Juan Ignacio Esterri y 10 de Santiago
  Siena. La cátedra evalúa la participación de cada integrante, así que conviene
  repartir lo que falta de manera que el historial lo refleje: ese es el criterio
  con el que se asignaron los [pendientes de abrir](#pendientes-de-abrir).

  > Medición al 03/10/2026. La cifra anterior (56 commits: 37 / 11 / 8) era del
  > 24/09 y quedó vieja: entre el 24/09 y el 30/09 entraron los PR #20 al #28 y
  > dos commits directos. Para recalcularla:
  > `git log --no-merges --format="%an" --since=2026-07-01 | sort | uniq -c`
  > (en PowerShell, `... | Group-Object | Select-Object Count, Name`).
  > Las identidades `SantiiDev` y `Santino Gallo` son la misma persona.
- **El PR #13 juntó cuatro commits de dos áreas distintas.** Se había separado en
  tres ramas para poder revisarlo por partes, pero al estar encadenadas se mergeó
  todo junto (ver la nota de la tabla de pull requests). Para lo que queda
  conviene que las ramas salgan de `develop` en paralelo y no una de otra, salvo
  que haya una dependencia real de código.
