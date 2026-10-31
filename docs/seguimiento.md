# Seguimiento del proyecto

## Pull requests

### Backend – [Campesianoo/Trabajo-Desarrollo](https://github.com/Campesianoo/Trabajo-Desarrollo/pulls?q=is%3Apr)

| PR | Rama | Contenido | Estado |
|:-:|:-|:-|:-:|
| [#3](https://github.com/Campesianoo/Trabajo-Desarrollo/pull/3) | `Crud-Cliente` | CRUD de clientes | Mergeado |
| [#2](https://github.com/Campesianoo/Trabajo-Desarrollo/pull/2) | `feature/clientes` | Clientes y login con roles (admin / profesor / cliente) | Mergeado |
| [#4](https://github.com/Campesianoo/Trabajo-Desarrollo/pull/4) | `feature/crud-rutina` | CRUD de rutinas y sus ejercicios | Mergeado |
| [#5](https://github.com/Campesianoo/Trabajo-Desarrollo/pull/5) | `Crud-Membresías` | CRUD de membresías con estado calculado | Mergeado |
| [#6](https://github.com/Campesianoo/Trabajo-Desarrollo/pull/6) | `fix/revision-backend` | Revisión del backend: migraciones, validaciones, cuenta obligatoria para clientes y profesores | Mergeado |
| [#7](https://github.com/Campesianoo/Trabajo-Desarrollo/pull/7) | `feature/perfil-cliente` | Perfil del cliente (`/clientes/me`) | Mergeado |
| [#8](https://github.com/Campesianoo/Trabajo-Desarrollo/pull/8) | `feature/clientes-listado-membresia` | Estado de membresía en el listado de clientes | Mergeado |
| [#9](https://github.com/Campesianoo/Trabajo-Desarrollo/pull/9) | `feature-Turnos` | Clases, turnos, inscripciones, plantillas diarias y asistencia (con su migración) | En revisión |

### Frontend – [IanKasperczak/Trabajo-Desarrollo-Frontend](https://github.com/IanKasperczak/Trabajo-Desarrollo-Frontend/pulls?q=is%3Apr)

| PR | Rama | Contenido | Estado |
|:-:|:-|:-|:-:|
| [#1](https://github.com/IanKasperczak/Trabajo-Desarrollo-Frontend/pull/1) | `feature/clientes` | Pantallas de clientes y login | Mergeado |
| [#2](https://github.com/IanKasperczak/Trabajo-Desarrollo-Frontend/pull/2) | `feature/frontend-pendientes` | Pantallas pendientes (rutinas, usuarios, perfil de profesor), sin datos mock | Mergeado |
| [#3](https://github.com/IanKasperczak/Trabajo-Desarrollo-Frontend/pull/3) | `feature/perfil-cliente` | Mi Perfil del cliente | Mergeado |
| [#4](https://github.com/IanKasperczak/Trabajo-Desarrollo-Frontend/pull/4) | `feature/sin-salones` | Se quita Salones; membresías y listado de clientes con estado y detalle | Mergeado |

> Los PR más recientes (tests y documentación) se agregan acá al abrirlos.

## Features

| Feature | Backend | Frontend |
|:-|:-:|:-:|
| Login con roles y rutas protegidas | ✅ | ✅ |
| Gestión de usuarios (admin) | ✅ | ✅ |
| CRUD Cliente (con su cuenta) | ✅ | ✅ |
| CRUD Profesor (con su cuenta) y asignación de especialidades | ✅ | ✅ |
| CRUD Especialidad | ✅ | ✅ |
| CRUD Membresía (de Cliente) + "Mi membresía" del cliente | ✅ | ✅ |
| CRUD Rutina (de Cliente y Profesor) con ejercicios | ✅ | ✅ |
| Listado de clientes con estado de membresía + detalle con su rutina | ✅ | ✅ |
| Perfil propio (cliente y profesor) | ✅ | ✅ |
| Clases, turnos e inscripciones | ✅ | ✅ |
| Listado "Clases del día" con detalle de inscriptos | ✅ | ✅ |
| CUU: reservar turno / registrar asistencia | ✅ | ✅ |
| Tests automáticos | ✅ | ✅ |
| Documentación | ✅ | ✅ |
| Deploy con cuentas de demostración | 🚧 | 🚧 |
| Video de demostración | ⏳ | |

✅ hecho · 🚧 en curso · ⏳ pendiente

## Bugs e issues encontrados y resueltos

| Problema | Causa | Solución |
|:-|:-|:-|
| Tablas `Membresia` y `membresia` duplicadas en Supabase | `sequelize.sync()` corrido desde distintas ramas contra la base compartida | Se pasó a migraciones y se unificó el nombre (`Membresias`). Regla: [desarrollar contra base propia](migraciones.md#desarrollar-contra-una-base-propia) |
| La base de producción no coincidía con los modelos | `sync()` no modifica tablas existentes | Migraciones versionadas ([decisión 5](decisiones.md#5-migraciones-en-lugar-de-sequelizesync)) |
| Clientes y profesores sin cuenta | Dos formas de crear lo mismo | Cuenta obligatoria, se crea junto con la persona ([decisión 3](decisiones.md#3-todo-cliente-y-todo-profesor-tiene-cuenta)). Se borraron los profesores sin cuenta |
| El borrado de un cliente fallaba si tenía rutinas | Clave foránea sin cascada | Migración `20261017-02`; el frontend avisa antes de borrar |
| Errores de clave foránea de Postgres (`23001`) no se reconocían | Sequelize solo reconoce `23503` | `esErrorDeReferencia` en `utils/http.js` |
| Conflictos al mergear la rama de membresías | `app.js` y `associations.js` modificados en paralelo | Resueltos conservando lo de `main` más lo de membresías |
| La app desplegada no iniciaba sesión | Vercel apuntaba a otro repositorio; Render a otra rama; Supabase pausado | Se corrigió cada configuración ([deploy](deploy.md)) |
| Cookie de sesión bloqueada entre dominios | Frontend y backend en dominios distintos (cookie de terceros) | El frontend reenvía `/api` al backend: la cookie es del mismo sitio |

## Pendientes conocidos

- Actualizar la propuesta (`proposal.md`): quitar Salón y la sección de adicionales heredada de otra plantilla.
- Test end-to-end con Playwright.
- Revisar las vulnerabilidades que reporta `npm audit` en el frontend.
