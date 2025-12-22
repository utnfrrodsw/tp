> **[Portal de Documentación](../../README.md)** / **[Gestión del Proyecto](../README.md)** / 📋 Listado de PRs - Back End

La lista completa de Pull Requests se puede ver acá: https://github.com/upskill-team/Back-End-DSW/pulls?q=is%3Apr+is%3Aclosed

## 🏆 Hitos Técnicos Principales (Highlights)

A continuación, los cambios más significativos del desarrollo:

### 🚀 Nuevas Funcionalidades (Features)

- **Seguridad y Autenticación:** Implementación de flujo completo de autenticación, autorización basada en roles (RBAC), protección de rutas y medidas de seguridad del servidor (Rate Limiting, Helmet) ([PR #6](https://github.com/upskill-team/Back-End-DSW/pull/6), [PR #78](https://github.com/upskill-team/Back-End-DSW/pull/78), [PR #82](https://github.com/upskill-team/Back-End-DSW/pull/82), [PR #152](https://github.com/upskill-team/Back-End-DSW/pull/152))
- **Gestión de Sesiones:** Implementación de lógica de *Refresh Tokens* con rotación segura y funcionalidad de persistencia de sesión ("Recordarme") ([PR #168](https://github.com/upskill-team/Back-End-DSW/pull/168), [PR #184](https://github.com/upskill-team/Back-End-DSW/pull/184))
- **Pagos y Monetización:** Implementación del flujo de pago con Mercado Pago y entidades de ingresos con lógica de división (Revenue Split 97/3) ([PR #144](https://github.com/upskill-team/Back-End-DSW/pull/144), [PR #149](https://github.com/upskill-team/Back-End-DSW/pull/149))
- **Gestión de Cursos y Contenido:** Implementación de la creación de cursos con contenido anidado, gestión de unidades y sistema de evaluaciones ([PR #46](https://github.com/upskill-team/Back-End-DSW/pull/46), [PR #124](https://github.com/upskill-team/Back-End-DSW/pull/124), [PR #145](https://github.com/upskill-team/Back-End-DSW/pull/145))
- **Filtrado y Búsqueda:** Desarrollo de métodos de búsqueda, filtrado, clasificación y paginación para el módulo de cursos ([PR #153](https://github.com/upskill-team/Back-End-DSW/pull/153), [PR #155](https://github.com/upskill-team/Back-End-DSW/pull/155), [PR #129](https://github.com/upskill-team/Back-End-DSW/pull/129))
- **Servicios e Infraestructura:** Implementación de logging estructurado (Pino, Better Stack), servicio de email híbrido y validación de datos con Valibot ([PR #91](https://github.com/upskill-team/Back-End-DSW/pull/91), [PR #162](https://github.com/upskill-team/Back-End-DSW/pull/162), [PR #183](https://github.com/upskill-team/Back-End-DSW/pull/183), [PR #12](https://github.com/upskill-team/Back-End-DSW/pull/12))
- **Gestión Administrativa y Analítica:** Implementación de endpoints para analíticas de administrador/profesor y sistema de gestión de instituciones y solicitudes ([PR #151](https://github.com/upskill-team/Back-End-DSW/pull/151), [PR #136](https://github.com/upskill-team/Back-End-DSW/pull/136), [PR #34](https://github.com/upskill-team/Back-End-DSW/pull/34))
- **Calidad y Documentación:** Configuración de pruebas unitarias/integración y generación de documentación con TypeDoc ([PR #158](https://github.com/upskill-team/Back-End-DSW/pull/158), [PR #59](https://github.com/upskill-team/Back-End-DSW/pull/59))



### 🐛 Corrección de Errores (Bug Fixes)

- **Lógica de Negocio y Persistencia:** Corrección crítica del flujo de creación de cursos, validación de tipos y persistencia de relaciones en la base de datos ([PR #120](https://github.com/upskill-team/Back-End-DSW/pull/120), [PR #189](https://github.com/upskill-team/Back-End-DSW/pull/189), [PR #146](https://github.com/upskill-team/Back-End-DSW/pull/146))
- **Arquitectura y Enrutamiento:** Resolución de conflictos en el enrutamiento global (`app.ts`) y corrección del orden de ejecución de los middlewares en los endpoints ([PR #93](https://github.com/upskill-team/Back-End-DSW/pull/93), [PR #160](https://github.com/upskill-team/Back-End-DSW/pull/160), [PR #159](https://github.com/upskill-team/Back-End-DSW/pull/159))
- **Seguridad y Sesiones:** Solución a problemas de cierre de sesión involuntario (logout), ajustes en las respuestas de *Refresh Token* y aumento de límites de *Rate Limit* ([PR #32](https://github.com/upskill-team/Back-End-DSW/pull/32), [PR #188](https://github.com/upskill-team/Back-End-DSW/pull/188))
- **Mantenimiento y Dependencias:** Actualización de dependencias para resolver vulnerabilidades de seguridad y sincronización de archivos de bloqueo (`lockfiles`) para estabilizar el CI ([PR #26](https://github.com/upskill-team/Back-End-DSW/pull/26), [PR #45](https://github.com/upskill-team/Back-End-DSW/pull/45))
- **Configuración de Herramientas:** Corrección en la configuración de TypeDoc para la correcta generación de documentación modular ([PR #111](https://github.com/upskill-team/Back-End-DSW/pull/111))


### 🛠 Mantenimiento y Otros (Chores/Refactors)

- **Arquitectura y Estandarización:** Estandarización de la arquitectura en módulos principales (`Student`, `Course`, `Professor`, `Institution`) y desacoplamiento de la definición de la aplicación para alinearse con la arquitectura de referencia ([PR #28](https://github.com/upskill-team/Back-End-DSW/pull/28), [PR #41](https://github.com/upskill-team/Back-End-DSW/pull/41), [PR #47](https://github.com/upskill-team/Back-End-DSW/pull/47), [PR #51](https://github.com/upskill-team/Back-End-DSW/pull/51), [PR #53](https://github.com/upskill-team/Back-End-DSW/pull/53), [PR #166](https://github.com/upskill-team/Back-End-DSW/pull/166))
- **Seguridad y Privacidad de Datos:** Implementación de filtrado de datos sensibles y vistas contextuales por rol, reducción de ventanas de limitación de autenticación y mejoras en la seguridad de las respuestas ([PR #182](https://github.com/upskill-team/Back-End-DSW/pull/182), [PR #195](https://github.com/upskill-team/Back-End-DSW/pull/195), [PR #194](https://github.com/upskill-team/Back-End-DSW/pull/194), [PR #200](https://github.com/upskill-team/Back-End-DSW/pull/200))
- **Manejo de Errores:** Implementación de middleware global para el control de errores y centralización de la lógica de manejo de excepciones ([PR #56](https://github.com/upskill-team/Back-End-DSW/pull/56), [PR #79](https://github.com/upskill-team/Back-End-DSW/pull/79))
- **Infraestructura y Calidad (CI/CD):** Implementación de workflows de Integración Continua (CI), configuración de herramientas de calidad de código y plantillas automatizadas para Issues/PRs ([PR #24](https://github.com/upskill-team/Back-End-DSW/pull/24), [PR #167](https://github.com/upskill-team/Back-End-DSW/pull/167), [PR #18](https://github.com/upskill-team/Back-End-DSW/pull/18), [PR #42](https://github.com/upskill-team/Back-End-DSW/pull/42))
- **Limpieza y Documentación:** Externalización de la documentación Swagger a YAML y eliminación de endpoints y entidades obsoletas ([PR #115](https://github.com/upskill-team/Back-End-DSW/pull/115), [PR #70](https://github.com/upskill-team/Back-End-DSW/pull/70), [PR #116](https://github.com/upskill-team/Back-End-DSW/pull/116))



