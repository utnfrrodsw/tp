# Documentación – Power Trainer

Sistema web para administrar el flujo de personas del gimnasio **Power Trainer**: clientes, profesores, membresías, rutinas, clases y turnos.

El proyecto son **dos repositorios** independientes que se comunican por una API REST:

| Parte | Repositorio | Tecnología |
|:-|:-|:-|
| Backend (este repo) | [Campesianoo/Trabajo-Desarrollo](https://github.com/Campesianoo/Trabajo-Desarrollo) | Node.js, Express 5, Sequelize, PostgreSQL (Supabase) |
| Frontend | [IanKasperczak/Trabajo-Desarrollo-Frontend](https://github.com/IanKasperczak/Trabajo-Desarrollo-Frontend) | React 18, Vite, TypeScript, MUI |

## Índice

| Documento | Qué contiene |
|:-|:-|
| [Instalación](instalacion.md) | Cómo levantar el backend y el frontend en local, variables de entorno, base de datos |
| [Arquitectura](arquitectura.md) | Capas, diagramas (Mermaid), modelo de datos (ER) |
| [API](api.md) | Referencia de todos los endpoints, roles y errores |
| [Decisiones de diseño](decisiones.md) | Por qué se hizo cada cosa (contraseña inicial = DNI, JWT en cookie, migraciones, etc.) |
| [Migraciones](migraciones.md) | Cómo cambiar el esquema de la base, y la regla para ramas que agregan tablas |
| [Tests](tests.md) | Cómo correr los tests automáticos y evidencia de su ejecución |
| [Seguimiento](seguimiento.md) | Pull requests, features, bugs e issues |
| [Minutas](minutas/README.md) | Minutas de reunión y de avance (con plantilla) |
| [Deploy](deploy.md) | Dónde está desplegado, variables del deploy y cuentas de demostración |

## Estado del alcance

| Requisito | Estado |
|:-|:-|
| Login con roles (admin / profesor / cliente) y rutas protegidas | Hecho |
| CRUD Cliente, Profesor, Especialidad | Hecho |
| CRUD dependiente: Membresía (de Cliente), Rutina (de Cliente y Profesor) | Hecho |
| Listado de clientes con estado de membresía + detalle con su rutina | Hecho |
| Clases (tipos de clase, turnos, inscripciones) y "Clases del día" con detalle de inscriptos | Hecho (PR #9) |
| CUU: reservar turno para una actividad / registrar asistencia | Hecho (PR #9) |

El grupo pasó de 4 a 3 integrantes, por eso se quitó la entidad **Salón** del alcance (ver [decisiones](decisiones.md#8-se-quita-salón-del-alcance)).
