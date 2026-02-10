# Skola: conecta tu futuro

## Índice

- [Instalación del proyecto](#instalaci%C3%B3n-del-proyecto)
- [Minutas de período](#minutas-de-los-per%C3%ADodos)
- [Tecnologías utilizadas](#tecnolog%C3%ADas-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Feature tracking](#features-tracking)
- [Documentación de la API (pendiente)](#documentaci%C3%B3n-de-la-api)
- [Evidencia de ejecución de test automáticos (pendiente)](#evidencia-de-ejecuci%C3%B3n-de-test-autom%C3%A1ticos)
- [Video demo de app (pendiente)](#video-demo-de-app)

## Instalación del Proyecto

_Pendiente para AD_

## Minutas de los períodos

Nuestra manera de documentar el progreso del desarrollo del proyecto fue generar minutas pero no por reunión sino más bien por período de tiempo (aproximadamente cada 30 días). En ellas registramos las reuniones y consultas que se tuvieron en ese período, las decisiones que se tomaron y las dificultades que se hayaron, así como también los cambios en el código que se realizaron en ambos repositorios (front y back), las nuevas tecnologías que se iban implementando y la proyección de los objetivos a lograr para el siguiente período.  
A continuación una enumeración descriptiva de las minutas por período hasta la fecha.

- **[Minuta 1](https://github.com/MartinianoLeonCorrea/tpGestionSecundaria/blob/main/minutas_seguimiento/minuta%201.md)**  
  Definición y conceptualización general e inicial del proyecto.
- **[Minuta 2](https://github.com/MartinianoLeonCorrea/tpGestionSecundaria/blob/main/minutas_seguimiento/minuta%202.md)**  
  Formalización y consolidación del modelo de dominio y "proposal" del sistema de gestión escolar, junto con la organización inicial del repositorio del proyecto.
- **[Minuta 3](https://github.com/MartinianoLeonCorrea/tpGestionSecundaria/blob/main/minutas_seguimiento/minuta%203.md)**  
  Inicio de la estructuración técnica y configuración de los repositorios, tecnologías y primeros desarrollos del frontend y backend del sistema de gestión escolar.
- **[Minuta 4](https://github.com/MartinianoLeonCorrea/tpGestionSecundaria/blob/main/minutas_seguimiento/minuta%204.md)**  
  Asignación, desarrollo y consolidación de los CRUDs simples en el backend, elección de tecnologías y definición de la estructura de datos y arquitectura de capas.
- **[Minuta 5](https://github.com/MartinianoLeonCorrea/tpGestionSecundaria/blob/main/minutas_seguimiento/minuta%205.md)**  
  Avance significativo en la implementación y diseño del frontend, integración con el backend y consolidación del modelo de dominio y operaciones CRUD.
- **[Minuta 6](https://github.com/MartinianoLeonCorrea/tpGestionSecundaria/blob/main/minutas_seguimiento/minuta%206.md)**  
  Refactorización, optimización y avance en la integración funcional entre frontend y backend, con especial énfasis en formularios, dashboards y gestión de exámenes y dictados.
- **[Minuta 7](https://github.com/MartinianoLeonCorrea/tpGestionSecundaria/blob/main/minutas_seguimiento/minuta%207.md)**  
  Definición de la identidad visual y nombre de la aplicación, junto con mejoras y testeo de funcionalidades clave en frontend y backend.

## Tecnologías utilizadas

### Backend

- Node.js + Express 5.1.0
- Sequelize ORM 6.37.7
- Sequelize CLI 6.6.3
- MySQL 8.0
- MySQL Workbench 8.0 CE (para desarrollo)
- Dotenv 17.2.0
- Yarn 1.22.22
- Nodemon 3.1.10 (para desarrollo)

### Frontend

- React 19.1.0
- Vite 7.0.4
- React Router DOM 7.7.1

## Estructura del proyecto

```
DSW2025/
├── backendapp_tpGS/                 # Backend Node.js/Express
│   ├── src/
│   │   ├── modules/                 # Módulos por entidad
│   │   │   ├── materia/
|   │   │   │   ├── materia.model.js        # Definición del modelo de datos (Sequelize)
|   │   │   │   ├── materia.controller.js   # Lógica de manejo de peticiones HTTP
|   │   │   │   ├── materia.service.js      # Lógica de negocio y acceso a datos
|   │   │   │   ├── materia.routes.js       # Definición de rutas HTTP
|   │   │   │   ├── materia.definitions.js  # Definiciones o constantes
|   │   │   │   └── materia.schema.js       # Esquema de validación (ej. Joi)
│   │   │   ├── curso/
│   │   │   ├── examen/
│   │   │   ├── dictado/
│   │   │   ├── persona/
│   │   │   ├── evaluacion/
│   │   │   └── db/                  # Modelos y relaciones generales
│   │   │       └── index.js         # Índice de modelos y relaciones
│   │   ├── config/                  # Configuración
│   │   │   └── database.js          # Configuración de base de datos
│   │   ├── middleware/              # Middleware de Express
│   │   │   ├── errorHandler.js
│   │   │   ├── notFound.js
│   │   │   └── validateRequest.js
│   │   ├── utils/                   # Utilidades (funciones auxiliares)
│   │   └── app.js                   # Configuración principal de Express (Reemplaza index.js como app principal)
│   ├── seeders/
│   ├── migrations/
│   ├── .sequelizerc
│   ├── index.js                     # Punto de entrada principal (Ahora podría solo llamar a app.js)
│   ├── package.json
│   ├── yarn.lock
│   ├── README.md
│   └── .env
│
***
│
├── frontendapp_tpGS/                # Frontend React
│   ├── src/
│   │   ├── assets/                  # Archivos estáticos específicos (logos, iconos, etc.)
│   │   │   └── react.svg
│   │   ├── components/              # Componentes reutilizables
│   │   ├── pages/                   # Páginas por ruta
│   │   │   ├── alumno/              # Vistas de alumno
│   │   │   └── docente/             # Vistas de docente
│   │   ├── context/         
|   |   |   ├── UserProvides.jsx      # Context API
│   │   │   └── UserContext.js       
│   │   ├── schemas/                 # Esquemas de validación de frontend (Yup)
│   │   ├── App.css                 # Estilos unificados de toda la app
│   │   ├── App.jsx                 # Componente principal
│   │   ├── index.css               
│   │   └── main.jsx                # Punto de entrada (renderizador)
│   ├── public/
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   └── eslint.config.js
│
***
│
└── tpGestionSecundaria/             # Repo general
    ├── README.md
    ├── docs/
    │   └── README.md
    └── minutas_seguimiento/

```

## Features Tracking

Última actualización: 11/10/2025

### Resumen Ejecutivo

- **Total Features**: 80
- **Completadas**: 62 (77.5%)
- **En Progreso**: 8 (10.0%)
- **Pendientes**: 10 (12.5%)

### Epic 1: Registro de Alumnos

**Objetivo**: Permitir el alta de alumnos en la plataforma, con validaciones, vinculación a cursos y persistencia en el backend.

| ID    | Feature                    | Descripción                                                             | Estado | Minuta / Commit / Fecha                                  |
| ----- | -------------------------- | ----------------------------------------------------------------------- | ------ | -------------------------------------------------------- |
| F-001 | Formulario de registro     | Formulario en frontend para cargar datos de alumno.                     | ✅     | Commit: 9006cccc...<br>Minuta 6 (04/09/2025, 11/09/2025) |
| F-002 | Validaciones en frontend   | Validación de DNI, email, teléfono, dirección antes de enviar.          | ✅     | Commit: 70e9d47...<br>Minuta 6 (11/09/2025)              |
| F-003 | Consumo de API backend     | Enviar datos por POST a `/api/personas/alumnos` y mostrar respuesta.    | ✅     | Commit: 3cb7bb9...<br>Minuta 6 (11/09/2025)              |
| F-004 | Listado de cursos dinámico | Obtener cursos disponibles vía fetch y mostrar opciones en el registro. | ✅     | Commit: 7b35ac2...<br>Minuta 6 (04/09/2025)              |
| F-005 | Mensajes de error y éxito  | Mostrar alertas o mensajes según resultado del registro.                | ✅     | Commit: 0210de5...<br>Minuta 6 (11/09/2025)              |

**Progreso**: 5/5 (100%) ✅

### Epic 2: Gestión de Personas / Usuarios

**Objetivo**: Sistema de usuarios con múltiples roles (alumno, docente, admin), gestión y edición de perfil, navegación contextual.

| ID    | Feature                    | Descripción                                                                       | Estado | Commit / Minuta / Fecha                                       |
| ----- | -------------------------- | --------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------- |
| F-006 | Registro de alumno         | Formulario y lógica para crear alumnos, validaciones y persistencia.              | ✅     | 1b38b051, 1dd6ffba, 09cba39, 0210de5; <br>Minuta 6 (sep 2025) |
| F-007 | Edición de perfil          | Edición de datos personales y especialidad, integración con backend.              | ✅     | 1b38b051, 1dd6ffba, 09cba39; <br>Minuta 6 (sep 2025)          |
| F-008 | Contexto de usuario        | UserContext y UserProvider para navegación y persistencia por tipo usuario.       | ✅     | 1b38b051, 8fec2a59; <br>Minuta 7 (oct 2025)                   |
| F-009 | Dashboard por rol          | Routing y renderizado de DashboardAlumno y DashboardDocente según rol.            | ✅     | 1b38b051, 5cda332f; <br>Minuta 6/7                            |
| F-010 | Listado de usuarios        | Vista Home con selección y filtrado de alumnos/docentes, integración con backend. | ✅     | 5cda332f, 0da004e4; <br>Minuta 6                              |
| F-011 | Autenticación simple       | Login por DNI y persistencia en localStorage.                                     | ✅     | 5cda332f, 1b38b051; <br>Minuta 6/7                            |
| F-012 | Selección de usuario       | Selección manual en Home, derivación a dashboards según tipo.                     | ✅     | 5cda332f; <br>Minuta 6                                        |
| F-013 | Página de login y registro | Página dedicada para iniciar sesión (login) o registrarse.                        | 🔄     | _(pendiente de implementación)_                               |
| F-014 | Vista de admin             | Dar funcionalidades especiales del admin                                          | 🔄     | _(pendiente de implementación)_                               |

**Progreso:** 8/10 (80%) 🔄

### Epic 3: Gestión de Exámenes y Evaluaciones

**Objetivo**: Administración de creación y edición de examenes y evaluaciones correspondientes.

| ID    | Feature                  | Descripción                                                                         | Estado | Commit / Minuta / Fecha                           |
| ----- | ------------------------ | ----------------------------------------------------------------------------------- | ------ | ------------------------------------------------- |
| F-015 | Crear examen             | El docente puede crear un examen para un dictado (fecha, temas, copias, validación) | ✅     | f65aa3f, bb2448a4; <br>Minuta 6, 7 (sep-oct 2025) |
| F-016 | Editar examen            | El docente puede editar fecha, temas, copias del examen                             | ✅     | f65aa3f, bb2448a4; <br>Minuta 7                   |
| F-017 | Eliminar examen          | El docente puede eliminar un examen                                                 | ✅     | f65aa3f, bb2448a4; <br>Minuta 7                   |
| F-018 | Subir notas              | El docente puede subir notas y observaciones para cada alumno de un examen          | ✅     | c83298ec, 4550ea98; <br>Minuta 7                  |
| F-019 | Modificar notas          | El docente puede editar notas de alumnos en lote o individualmente                  | ✅     | c83298ec, 4550ea98; <br>Minuta 7                  |
| F-020 | Ver listado de exámenes  | El docente puede ver todos los exámenes de un dictado                               | ✅     | f65aa3f, bb2448a4;<br>Minuta 6, 7                 |
| F-021 | Ver exámenes próximos    | El alumno puede ver el listado de exámenes próximos y pasados, filtrado/ordenado    | ✅     | 748afd54, bb2448a4; <br>Minuta 6, 7               |
| F-022 | Ver notas y evaluaciones | El alumno puede ver las notas y observaciones de sus evaluaciones                   | ✅     | 4550ea98, bb2448a4; <br>Minuta 7                  |
| F-023 | Ver exámenes por materia | El alumno puede ver los exámenes asociados a una materia                            | ✅     | 748afd54, bb2448a4; <br>Minuta 6                  |

**Progreso:** 9/9 (100%) ✅

### Frontend - Dashboard Alumno

**Objetivo**: Interfaz para estudiantes

| ID    | Feature                    | Descripción                                                                       | Estado | Commit / Minuta / Fecha                                       |
| ----- | -------------------------- | --------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------- |
| F-024 | DashboardAlumno            | Página principal para alumnos, muestra materias, novedades y exámenes próximos    | ✅     | 5cda332f, 0da004e4, 1b38b051, 1dd6ffba, 09cba39; <br>Minuta 6 |
| F-025 | Listar materias            | Visualización y navegación de materias del alumno                                 | ✅     | 5cda332f, 0da004e4, 1b38b051, 1dd6ffba, 09cba39; <br>Minuta 6 |
| F-026 | Ver exámenes próximos      | Card y listado con los exámenes próximos filtrados por fecha                      | ✅     | f65aa3f, bb2448a4, 4550ea98; <br>Minuta 6, 7                  |
| F-027 | Detalle de materia         | Página de detalle de cada materia, docente a cargo, descripción y exámenes        | ✅     | 5cda332f, f65aa3f, bb2448a4; <br>Minuta 6                     |
| F-028 | Ver notas y evaluaciones   | Página de notas permite ver las evaluaciones y observaciones por materia y examen | ✅     | 4550ea98, bb2448a4, e70552df; <br>Minuta 7                    |
| F-029 | Filtrar y ordenar exámenes | Filtrado de exámenes por próximos/pasados y orden asc/desc                        | ✅     | bb2448a4, f65aa3f, 4550ea98; <br>Minuta 7                     |
| F-030 | Navegación contextual      | Acceso directo entre dashboard, materias, exámenes y perfil                       | ✅     | 5cda332f, 0da004e4, 1b38b051, 1dd6ffba; <br>Minuta 6          |
| F-031 | Sidebar y novedades        | Barra lateral adaptada para alumno con novedades y navegación                     | ✅     | 5cda332f, 0da004e4, a840ca6d; <br>Minuta 6, 7                 |
| F-032 | Visualización responsive   | Interfaz adaptativa para dispositivos móviles y escritorio                        | ✅     | a840ca6d, e70552df; <br>Minuta 6                              |

**Progreso:** 9/9 (100%) ✅

### Frontend - Dashboard Docente

**Objetivo**: Interfaz para profesores

| ID    | Feature                   | Descripción                                                            | Estado | Commit / Minuta / Fecha                                       |
| ----- | ------------------------- | ---------------------------------------------------------------------- | ------ | ------------------------------------------------------------- |
| F-033 | DashboardDocente          | Página principal para docentes, muestra dictados, materias y novedades | ✅     | 5cda332f, 0da004e4, 1b38b051, 1dd6ffba, 09cba39; <br>Minuta 6 |
| F-034 | Listar dictados           | Visualización y navegación de dictados y materias a cargo              | ✅     | 5cda332f, 0da004e4, 1b38b051;<br>Minuta 6                     |
| F-035 | Gestión de exámenes       | Acceso y navegación para crear, editar, eliminar exámenes              | ✅     | f65aa3f, bb2448a4, 4550ea98; <br>Minuta 7                     |
| F-036 | Subida y edición de notas | Subida, edición y publicación de notas de alumnos en cada examen       | ✅     | c83298ec, 4550ea98; <br>Minuta 7                              |
| F-037 | Barra lateral docente     | Sidebar adaptada para docente con novedades y navegación entre vistas  | ✅     | 5cda332f, a840ca6d, e70552df; <br>Minuta 6, 7                 |
| F-038 | Visualización responsive  | Interfaz adaptativa para dispositivos móviles y escritorio             | ✅     | a840ca6d, e70552df; <br>Minuta 6                              |
| F-039 | Navegación contextual     | Acceso entre dashboard, dictados, exámenes, perfil y notas             | ✅     | 5cda332f, 0da004e4, 1b38b051, 1dd6ffba; <br>Minuta 6          |
| F-040 | Detalle de dictado        | Visualización detallada de dictado, materia, curso y alumnos           | ✅     | f65aa3f, bb2448a4; <br>Minuta 6, 7                            |

**Progreso:** 8/8 (100%) ✅

---

### Backend Requisitos

| ID    | Feature                                          | Estado |
| ----- | ------------------------------------------------ | ------ |
| B-001 | Backend en JavaScript                            | ✅     |
| B-002 | Framework web (Express.js)                       | ✅     |
| B-003 | API REST expuesta                                | ✅     |
| B-004 | BD persistente externa (MySQL)                   | ✅     |
| B-005 | ORM/Mapper (Sequelize)                           | ✅     |
| B-006 | Arquitectura por capas                           | ✅     |
| B-007 | Validación de entrada y manejo de errores        | ✅     |
| B-008 | package.json dependencias                        | ✅     |
| B-009 | Tests automatizados backend (aprobación directa) | 🚩     |
| B-010 | Test de integración backend (aprobación directa) | 🚩     |
| B-011 | Login con autenticación y niveles de acceso      | 🚩     |
| B-012 | Proteger rutas según nivel de acceso             | 🚩     |
| B-013 | Definición de ambientes (.env)                   | ✅     |

### Frontend Requisitos Regulares y de Aprobación

| ID    | Feature                                                 | Estado |
| ----- | ------------------------------------------------------- | ------ |
| F-001 | Frontend en React                                       | ✅     |
| F-002 | Uso de HTML5                                            | ✅     |
| F-003 | CSS con metodología (ej. Tailwind/Bulma/Bootstrap/etc.) | ✅     |
| F-004 | Mobile-first CSS                                        | 🔄     |
| F-005 | Breakpoints SM, MD, LG                                  | 🔄     |
| F-006 | Buenas prácticas UX/UI                                  | 🔄     |
| F-007 | Manejo de eventos                                       | ✅     |
| F-008 | Manejo de errores visuales                              | 🔄     |
| F-009 | Reactividad y estado                                    | ✅     |
| F-010 | Input/Output property                                   | ✅     |
| F-011 | Implementar al menos un servicio                        | ✅     |
| F-012 | Modelos con clases/interfaces/types                     | ✅     |
| F-013 | Patrón de diseño (opcional)                             | 🔄     |
| F-014 | package.json dependencias                               | ✅     |
| F-015 | Test unitario de componente (aprobación directa)        | 🚩     |
| F-016 | Test end-to-end frontend (aprobación directa)           | 🚩     |
| F-017 | Login con protección de rutas                           | 🚩     |
| F-018 | Definir ambientes (.env)                                | ✅     |

### Requisitos Funcionales

| ID     | Feature                                         | Estado |
| ------ | ----------------------------------------------- | ------ |
| FN-001 | 1 CRUD simple por integrante                    | ✅     |
| FN-002 | 1 CRUD dependiente cada 2 integrantes           | ✅     |
| FN-003 | Listado con filtro cada 2 integrantes           | ✅     |
| FN-004 | Detalle por elemento en cada listado            | ✅     |
| FN-005 | 1 epic o CUU cada 2 integrantes                 | ✅     |
| FN-006 | CRUDs de todas las clases de negocio            | 🚩     |
| FN-007 | 1 epic o CUU por integrante                     | 🚩     |
| FN-008 | 2 CUU relacionados (data compartida)            | 🚩     |
| FN-009 | Listados complejos/funcionalidad extra/opcional | 🔄     |

**Leyenda de estados:**

- ✅ = Completado
- 🔄 = En progreso
- ⏳ = No iniciado, pendiente para el próximo período
- 🚩 = Pendiente para la etapa de aprobación directa (no realizado aún)

  
## Link de Pull Request

[Pull Request](https://github.com/utnfrrodsw/tp/pull/192)

## Documentación de la API

_Pendiente para AD_

## Evidencia de ejecución de test automáticos

_Pendiente para AD_

## Video demo de app

_Pendiente para regularidad_

---

Desarrollado por Martiniano Correa, Jonatan Achares y Lara Varrenti para la materia Desarrollo de Software - UTN - Ingeniería en sistemas - 2025
