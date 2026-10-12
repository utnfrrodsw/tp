# Minutas de reunión y avance

> **Nota para el equipo antes de la entrega.** Las secciones
> [Registro de avances](#registro-de-avances) y
> [Decisiones tomadas](#decisiones-tomadas) están reconstruidas a partir de lo
> que quedó asentado en el repositorio (commits, pull requests y documentación),
> así que son verificables una por una. La sección
> [Minutas](#minutas) tiene el formato acordado y la primera entrada cargada:
> **las reuniones que falten hay que completarlas con el registro propio del
> equipo** (fecha real, quiénes estuvieron y qué se acordó). No se inventan.

## Metodología y cadencia

- **Metodología**: Scrum adaptado a un equipo de tres integrantes.
- **Iteraciones**: dos semanas. Cada iteración cierra con las features de su
  alcance mergeadas a `develop`.
- **Sincronización**: una reunión semanal por videollamada, más coordinación
  diaria asincrónica por el grupo de mensajería del equipo.
- **Tablero**: GitHub Projects sobre el repositorio, volcado a
  [tracking.md](tracking.md).
- **Revisión**: ningún integrante mergea su propio pull request; los revisa y
  mergea Santino Gallo.

## Formato de una minuta

```markdown
### <Fecha> — <Título de la reunión>

**Participantes:** ...
**Duración:** ...

**Temas tratados**
- ...

**Decisiones**
- ...

**Tareas asignadas**
| Tarea | Responsable | Issue |
|:-|:-|:-|

**Pendientes para la próxima**
- ...
```

## Registro de avances

Cada fila tiene su evidencia en el repositorio. El detalle de los pull requests
está en [tracking.md](tracking.md).

| Fecha | Avance | Evidencia |
|:-:|:-|:-|
| 08/07/2026 | Estructura base del monorepo: carpetas `frontend/` y `backend/` sobre el fork de la cátedra | `d3d1fb1` |
| 09/07 – 17/07 | Landing page completa: navbar, hero, secciones, CTA, footer, páginas de miembros, listas, música y Pro | `d241050` … `92b5e63` |
| 13/07/2026 | Interfaz de login y registro | `5458544` |
| 11/08/2026 | Base de datos creada y estructura del backend en capas | `93a7832` |
| 13/08/2026 | Seed del catálogo desde Deezer, en dos etapas (PR #1) | `a6c1397` |
| 13/08/2026 | Autenticación con JWT y roles + CRUD de usuario (PR #2) | `454259e`, `f488d9c` |
| 14/08 – 18/08 | Panel de administración e interfaz del perfil de usuario (PR #3 y #4) | `6b1d094`, `03571e1` |
| 21/08/2026 | Baja lógica de usuarios en lugar de borrado físico | `64984f3` |
| 22/08/2026 | CRUD de artista con circuito de propuestas (PR #7) | `d5d3ebb` |
| 22/08/2026 | CRUD de género (PR #8) | `04ec005` |
| 25/08/2026 | Ficha de género con tarjetas, filtros y paginado (PR #9) | `4db142e` |
| 27/08 – 28/08 | CRUD de álbum y canción, colas de solicitudes y explorador conectado a datos reales (PR #10) | `ad4cd77`, `b27a4fe` |
| 28/08/2026 | CRUD de reseña con likes y comentarios (PR #11) | `186f5e4` |
| 01/09/2026 | Epic de membresía completo: planes, suscripciones y pago con MercadoPago | `21da334` |
| 09/09/2026 | Documentación del proyecto (`docs/`), README del proyecto y UI de administración de planes | `fde6c23` |
| 10/09/2026 | Seguimiento entre usuarios y CUU 4 (parte 1): feed social de reseñas (PR #13) | `823532f`, `95634d3` |
| 14/09 – 16/09 | CUU 4 (parte 2): estadísticas avanzadas, buscador y seguidores funcionales, y los tests automatizados de las dos apps (PR #15) | `b83ccfb`, `84c2323`, `8466989` |
| 16/09/2026 | Ranking global de usuarios más activos (PR #16) | `4a103cf` |
| 17/09/2026 | CRUD completo de listas personalizadas, backend y frontend, con `/lists` conectada a la API (PR #17) | `5e6f1de` |
| 18/09/2026 | Correcciones sobre el CRUD de listas (PR #18) y retoques de estilos | `005e7ef`, `68cc11b` |
| 21/09/2026 | Listas de canciones (`LISTS.type` + `LIST_SONGS`) y alta de listas restringida a `PRO`/`ADMIN` (PR #19) | `d28a56e` |
| 22/09/2026 | Filtro de género y criterio real de "en tendencia" en listas, paginado del panel de administración y de las contribuciones del perfil, y corrección de la colisión de clases CSS en la home | `34a713a`, `323e3f0` |
| 22/09/2026 | La membresía Pro pasa a ser un **pago único**: se elimina el vencimiento, la renovación, el estado `expired` y la baja voluntaria, en las dos apps y en la documentación | `587ca90` |
| 24/09/2026 | Dashboard de administración con métricas de ingresos y el seed de ventas de demo (PR #20) | `5dd0458` |
| 27/09/2026 | Tope de filas del panel lateral y del ranking, `z-index` del `Select` sobre los modales y limpieza del alcance voluntario en la documentación (PR #21) | `21c9e96`, `33f6ec8`, `eec181d` |
| 28/09/2026 | Personalización de perfil Pro: banner, color de acento y badge Pro (PR #22) | `33fb859`, `1eb150c`, `2e076c2` |
| 29/09/2026 | Publicidad para usuarios Free: tabla `ADS`, CRUD de administración y panel rotativo (PR #23) | `4e971cc` |
| 29/09/2026 | Una carpeta por componente en todo el frontend (PR #24) | `81aebc2`, `ef9a908` |
| 30/09/2026 | Validación de formularios propia, sin la del navegador (PR #25) | `a801449` |
| 30/09/2026 | Los beneficios Pro dejan de prometer lo que no existe (PR #26), más dos correcciones directas a `develop` | `00246f0`, `12fdf81`, `da1b944` |
| 30/09/2026 | Ajustes de anuncios y los dos tests de la feature (PR #27) | `98da30e` |
| 30/09/2026 | Buscador en vivo y recargas sin parpadeo en el panel de administración (PR #28) | `39adb2e` |
| 03/10/2026 | Actualización de la documentación de la entrega (PR #29) | `311925f` |

## Decisiones tomadas

Decisiones de equipo que condicionan el resto del desarrollo. Cada una está
documentada en detalle en el lugar que se indica, y hay que poder defenderlas
oralmente.

| Fecha | Decisión | Motivo | Dónde está documentada |
|:-:|:-|:-|:-|
| 11/08 | La base de datos propia es la **única fuente de verdad en runtime**: ninguna parte del sistema consulta APIs de música durante su funcionamiento | Los CRUD del catálogo tienen que ser operaciones reales sobre tablas propias, no un proxy de un servicio ajeno | [backend/README](../backend/README.md#la-base-propia-es-la-única-fuente-de-verdad) |
| 11/08 | Arquitectura en capas estricta `routes → controller → service → repository → entity` | Que cada capa tenga una sola responsabilidad y se pueda explicar en la defensa | [backend/README](../backend/README.md#arquitectura-en-capas) |
| 11/08 | `entities/` va fuera de `features/`, con todas las asociaciones en `entities/index.ts` | Las entidades de Sequelize son un grafo conectado; repartirlas por feature generaría imports circulares | [CLAUDE.md](../CLAUDE.md) |
| 13/08 | **Deezer** como origen del catálogo inicial, en lugar de Spotify | Endpoints públicos sin OAuth, géneros a nivel álbum (como los modela el DER) y términos de uso que no restringen persistir el catálogo | [propuesta](../proposal.md#origen-de-los-datos-del-catálogo) |
| 13/08 | El seed se parte en dos etapas: `seed:fetch` (baja los datos, una sola vez) y `seed` (los carga, sin internet y de forma idempotente) | Hace reproducible la carga: da siempre el mismo resultado aunque el servicio externo esté caído | [backend/README](../backend/README.md#las-dos-etapas-y-por-qué-están-separadas) |
| 13/08 | Sin columna para el id externo: la idempotencia se resuelve por clave natural | No desviarse del pasaje a tablas aprobado en la propuesta | [propuesta](../proposal.md#origen-de-los-datos-del-catálogo) |
| 13/08 | Autenticación con JWT propio + bcrypt y tres niveles de acceso (`FREE`, `PRO`, `ADMIN`) | Cumple el requisito de login propio con al menos dos niveles, y el tercero es el que habilita el circuito de moderación | [backend/README](../backend/README.md#autenticación-y-roles) |
| 21/08 | La baja de usuario es **lógica** (`state = 'suspended'`), no física | Borrar la fila se llevaba puestas las reseñas del usuario, que son contenido de la comunidad | [backend/README](../backend/README.md#reglas-de-negocio-en-el-modelo) |
| 22/08 | El contenido aportado por un `PRO` entra en estado `pending` y lo aprueba un `ADMIN` | Es lo que convierte el alta de catálogo en un caso de uso con valor de negocio y no en un formulario suelto | [propuesta](../proposal.md#alcance-mínimo) |
| 28/08 | `REVIEW_LIKES` como relación N:M y `REVIEW_COMMENTS` como entidad débil, en vez de un contador dentro de `REVIEW` | Un contador no registra *quién* reaccionó: sin ese dato no se puede impedir el doble "me gusta" ni retirarlo | [propuesta](../proposal.md#modelo) |
| 01/09 | La membresía es mensual con **renovación manual**, no débito automático | El cobro recurrente es otro producto de MercadoPago (`preapproval`) y exigiría agregar al DER una columna para el id de la suscripción externa | Reemplazada el 22/09 (ver la fila de abajo) |
| 22/09 | La membresía Pro pasa a ser un **pago único**: se paga una vez, el acceso no vence y no hay renovación ni baja voluntaria | La renovación manual era una aproximación a una suscripción con una herramienta que no es para eso: Checkout Pro es el producto de MercadoPago para pagos únicos. El pago único deja el circuito alineado con lo que la pasarela realmente hace y saca del medio el vencimiento, la renovación y el estado `expired`, que sumaban código sin sumar alcance evaluado | [backend/README](../backend/README.md#pago-único-no-suscripción-recurrente) |
| 01/09 | A MercadoPago se le habla con `fetch`, sin el SDK | Son dos llamadas y así queda a la vista qué se manda y qué se recibe | [CLAUDE.md](../CLAUDE.md) |
| 09/09 | La base de datos se mantiene en **MySQL local**, acordado con la cátedra | — | [README del proyecto](../README.md#requisitos) |

## Minutas

### 22/09/2026 — Reparto de los entregables de aprobación

> ⚠️ **Borrador.** El reparto y las decisiones de abajo son los que se
> acordaron trabajando sobre el repositorio; falta que el equipo confirme la
> fecha real, quiénes estuvieron y la duración, y complete lo que se haya
> conversado y no esté asentado acá.

**Participantes:** Santino Gallo, Juan Ignacio Esterri, Santiago Siena
**Duración:** —

**Temas tratados**

- Revisión del alcance contra la [propuesta](../proposal.md): el alcance
  comprometido está **completo**, incluido el adicional voluntario de listas
  personalizadas de álbumes y canciones (PR #17, #18 y #19).
- Lo único que falta para la entrega es **documentación**: API, evidencia de
  tests, video demo y deploy con credenciales.
- Desbalance del historial de commits (36 / 11 / 8 al 22/09), que la cátedra
  evalúa como participación de cada integrante.
- Modelo de cobro de la membresía Pro: la renovación mensual manual agrega un
  circuito (vencimiento, reactivación) que no aporta al alcance evaluado.

**Decisiones**

- Los cuatro entregables de aprobación se reparten entre los tres integrantes,
  priorizando a quienes tienen menos commits en el historial. El detalle está en
  [tracking.md](tracking.md#pendientes-de-abrir).
- La membresía Pro pasa de **suscripción mensual con renovación manual** a un
  **pago único** con MercadoPago: se paga una vez y el acceso `PRO` no vence.
- El merge de la entrega (`develop` → `main`) sale después de cerrar esos ítems,
  y en ese pull request se describe el epic de membresía, que entró sin PR.

**Tareas asignadas**

| Tarea | Responsable | Issue |
|:-|:-|:-|
| Documentación de la API | Santiago Siena | A abrir |
| Evidencia de ejecución de los tests automáticos | Juan Ignacio Esterri | A abrir |
| Video demo de la aplicación | Santiago Siena | A abrir |
| Deploy y credenciales | Santino Gallo | A abrir |
| Membresía Pro como pago único | Santino Gallo | A abrir |
| Merge `develop` → `main` y apertura de los issues faltantes | Santino Gallo | — |

**Pendientes para la próxima**

- Completar las minutas de las reuniones anteriores al 09/09 con el registro
  propio del equipo.
- Crear en el GitHub Project los ocho issues que se trabajaron sin abrirlos y
  vincularlos a sus pull requests.
- Definir la plataforma de deploy.

---

### 09/09/2026 — Planificación de la entrega de regularidad

**Participantes:** Santino Gallo, Juan Ignacio Esterri, Santiago Siena

**Temas tratados**

- Revisión del estado del proyecto contra el alcance comprometido en la
  [propuesta](../proposal.md), de cara a la entrega del 12/10 al 16/10.
- Faltantes de documentación detectados: no existía el directorio `docs/`, el
  `README.md` de la raíz seguía siendo el enunciado del fork y la propuesta no
  tenía los links a los pull requests.
- Estado del CRUD de Plan de membresía: completo en el backend, sin pantalla de
  administración en el frontend.

**Decisiones**

- Se crea el directorio `docs/` con este archivo, el
  [tracking](tracking.md) y el [estado del alcance](estado-alcance.md), y se lo
  enlaza desde el README del proyecto.
- El `README.md` de la raíz pasa a ser el del proyecto, con las instrucciones
  para levantarlo; el enunciado de la cátedra se conserva en
  [`docs/enunciado.md`](enunciado.md).
- Se agrega la pestaña "Planes" al panel de administración, para cerrar el CRUD
  de Plan de membresía.
- La base de datos se mantiene en MySQL local, según lo conversado con la
  cátedra.

**Tareas asignadas**

| Tarea | Responsable | Issue |
|:-|:-|:-|
| Documentación del proyecto (`docs/`, README raíz, links a los PR) | Santino Gallo | — |
| UI de administración del CRUD de Plan de membresía | Santino Gallo | A abrir |
| Reemplazar los datos fijos de `/members` y `/lists` por datos de la API | A definir | A abrir |
| CUU 4 — Feed social y estadísticas avanzadas | A definir | A abrir |

**Pendientes para la próxima**

- Repartir el CUU 4 y los tests automatizados entre los tres integrantes.
- Abrir el pull request de la entrega (`develop` → `main`) y describir ahí el
  epic de membresía, que entró sin PR.
- Definir plataforma de deploy y quién lo hace.

---

<!--
Para agregar una minuta nueva: copiar el bloque de formato de arriba y sumarla
acá, de la más reciente a la más antigua.
-->
