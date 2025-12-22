> **[Portal de Documentación](../../README.md)** / **[Gestión del Proyecto](../README.md)** / 📋 Listado de PRs - Front End

La lista completa de Pull Requests se puede ver acá: https://github.com/upskill-team/Front-End-DSW/pulls?q=is%3Apr+is%3Aclosed

## 🏆 Hitos Técnicos Principales (Highlights)

A continuación, los cambios más significativos del desarrollo:

### 🚀 Nuevas Funcionalidades (Features)

- **Administración y Gestión:** Panel integral para la administración de la plataforma, incluyendo la gestión de tipos de curso, instituciones y un visor de documentos para validación de credenciales ([PR #52](https://github.com/upskill-team/Front-End-DSW/pull/52), [PR #60](https://github.com/upskill-team/Front-End-DSW/pull/60), [PR #129](https://github.com/upskill-team/Front-End-DSW/pull/129), [PR #54](https://github.com/upskill-team/Front-End-DSW/pull/54))
- **Gestión Académica (LMS):** Dashboard dedicado para profesores y flujo completo para la creación, edición y publicación de contenido educativo y cursos ([PR #58](https://github.com/upskill-team/Front-End-DSW/pull/58), [PR #101](https://github.com/upskill-team/Front-End-DSW/pull/101))
- **Sistema de Evaluaciones:** Módulo completo para la creación de exámenes por parte de los docentes y la resolución de los mismos por parte de los estudiantes ([PR #135](https://github.com/upskill-team/Front-End-DSW/pull/135))
- **Pagos y Checkout:** Implementación de pasarela de pagos([PR #134](https://github.com/upskill-team/Front-End-DSW/pull/134))
- **Cuenta y Seguridad:** Gestión de perfil de usuario, recuperación de credenciales y manejo avanzado de sesiones y persistencia de autenticación ([PR #121](https://github.com/upskill-team/Front-End-DSW/pull/121), [PR #70](https://github.com/upskill-team/Front-End-DSW/pull/70), [PR #156](https://github.com/upskill-team/Front-End-DSW/pull/156), [PR #174](https://github.com/upskill-team/Front-End-DSW/pull/174))
- **Experiencia de Usuario (UI/UX):** Diseño responsivo (adaptable a móviles), sistema de feedback visual interactivo y herramientas de filtrado y paginación de datos ([PR #44](https://github.com/upskill-team/Front-End-DSW/pull/44), [PR #149](https://github.com/upskill-team/Front-End-DSW/pull/149), [PR #142](https://github.com/upskill-team/Front-End-DSW/pull/142), [PR #147](https://github.com/upskill-team/Front-End-DSW/pull/147))
- **Calidad de Software (QA):** Configuración e implementación de suite de pruebas automatizadas (unitarias y de extremo a extremo) ([PR #148](https://github.com/upskill-team/Front-End-DSW/pull/148))


### 🐛 Corrección de Errores (Bug Fixes)
- **UI/UX y Navegación:** Solución a problemas de redirección en solicitudes de profesor y desbordamiento de texto en modales ([PR #151](https://github.com/upskill-team/Front-End-DSW/pull/151))
- **Layout y Responsividad:** Corrección de superposición del formulario de autenticación sobre el header en pantallas pequeñas ([PR #42](https://github.com/upskill-team/Front-End-DSW/pull/42))
- **Manejo de Errores:** Corrección en el manejo de excepciones y referencias a instituciones en los cursos ([PR #157](https://github.com/upskill-team/Front-End-DSW/pull/157))
- **Panel de Administración:** Corrección de problemas de responsividad y consistencia visual en layouts administrativos ([PR #69](https://github.com/upskill-team/Front-End-DSW/pull/69))
- **Componentes:** Solución a bugs lógicos y de vinculación en las tarjetas de cursos ([PR #136](https://github.com/upskill-team/Front-End-DSW/pull/136))
- **Lógica de Evaluaciones y Persistencia:** Solución a bucles infinitos en el flujo de evaluaciones y mejoras en el guardado de datos del editor ([PR #180](https://github.com/upskill-team/Front-End-DSW/pull/180))
- **Infraestructura y Routing:** Solución de error al refrescar paginas  en producción ([PR #168](https://github.com/upskill-team/Front-End-DSW/pull/168))
- **Componentes y Gráficos:** Arreglos en el visor de documentos y en la renderización de gráficos del panel administrativo ([PR #199](https://github.com/upskill-team/Front-End-DSW/pull/199))

### 🛠 Mantenimiento y Otros (Chores/Refactors)

- **Gestión de Estado y Formularios:** Migración completa de la arquitectura de estado del servidor a **TanStack Query** y estandarización del manejo de formularios con **React Hook Form** y **Valibot** para mejorar rendimiento y validación ([PR #74](https://github.com/upskill-team/Front-End-DSW/pull/74), [PR #75](https://github.com/upskill-team/Front-End-DSW/pull/75))
- **Seguridad en el Cliente:** Fortalecimiento de la seguridad en la navegación externa y en el visor de documentos integrado ([PR #196](https://github.com/upskill-team/Front-End-DSW/pull/196))
- **Rendimiento (Lazy Loading):** Implementación de carga diferida en el enrutador principal y secciones críticas para reducir el tiempo de carga inicial (FCP) ([PR #155](https://github.com/upskill-team/Front-End-DSW/pull/155))
- **Arquitectura de Componentes UI:** Estandarización y mejora del sistema de componentes base (Input, Button, Card, etc.) utilizando utilidades de composición de clases para garantizar consistencia visual ([PR #92](https://github.com/upskill-team/Front-End-DSW/pull/92), [PR #112](https://github.com/upskill-team/Front-End-DSW/pull/112))
- **Autenticación (Token-Only):** Unificación y estabilización del flujo de autenticación adoptando una estrategia basada exclusivamente en tokens para mayor seguridad ([PR #29](https://github.com/upskill-team/Front-End-DSW/pull/29))
- **Estructura del Proyecto:** Reorganización de la arquitectura de carpetas y código UI para facilitar la escalabilidad y mantenimiento del repositorio ([PR #91](https://github.com/upskill-team/Front-End-DSW/pull/91))



