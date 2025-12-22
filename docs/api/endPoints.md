> **[Portal de Documentación](../README.md)** / **[API](./README.md)** / Endpoints

# Endpoints de la API

Nuestra API utiliza los principales métodos HTTP para interactuar con los recursos: `GET`, `POST`, `PUT`, `PATCH` y `DELETE`. Las rutas están organizadas por módulos funcionales, cada uno implementando las operaciones CRUD correspondientes.

---

## Convenciones Generales

### Formato de Rutas

Todas las rutas siguen el formato: `/api/nombre-recurso`

### Métodos HTTP

Los métodos HTTP se utilizan según su propósito semántico:

| Método     | Propósito                                       | Idempotente |
| :--------- | :---------------------------------------------- | :---------: |
| `GET`      | Obtener datos del servidor                      |     Sí      |
| `POST`     | Enviar nuevos datos al servidor                 |     No      |
| `PUT`      | Reemplazar completamente un recurso existente   |     Sí      |
| `PATCH`    | Actualizar parcialmente un recurso existente    |     No      |
| `DELETE`   | Eliminar un recurso existente                   |     Sí      |

### Paginación

Los endpoints que retornan listas soportan paginación mediante parámetros query:

- `page`: Número de página (por defecto: 1)
- `limit`: Cantidad de items por página (por defecto: 10)

**Ejemplo:**
```
GET /api/courses?page=2&limit=20
```

### Autenticación

Los endpoints marcados con **[Auth]** requieren autenticación mediante JWT en el header:
```
Authorization: Bearer <token>
```

Los endpoints pueden requerir roles específicos: **[Professor]**, **[Student]**, **[Admin]**

---

## Autenticación (`/api/auth`)

| Método | Endpoint                     | Descripción                                    | Requiere |
| :----- | :--------------------------- | :--------------------------------------------- | :------: |
| POST   | `/auth/register`             | Registrar nuevo usuario                        |    -     |
| POST   | `/auth/login`                | Iniciar sesión                                 |    -     |
| POST   | `/auth/refresh`              | Renovar token de acceso                        |    -     |
| POST   | `/auth/logout`               | Cerrar sesión e invalidar tokens              |   Auth   |
| POST   | `/auth/forgot-password`      | Solicitar email de recuperación de contraseña  |    -     |
| POST   | `/auth/reset-password`       | Restablecer contraseña con token               |    -     |
| GET    | `/auth/profile`              | Obtener perfil del usuario autenticado         |   Auth   |

---

## Usuarios (`/api/users`)

| Método | Endpoint                   | Descripción                          | Requiere |
| :----- | :------------------------- | :----------------------------------- | :------: |
| GET    | `/users/profile`           | Obtener perfil del usuario actual    |   Auth   |
| PUT    | `/users/profile`           | Actualizar perfil del usuario actual |   Auth   |
| PUT    | `/users/profile/picture`   | Actualizar foto de perfil            |   Auth   |

---

## Cursos (`/api/courses`)

| Método | Endpoint                                       | Descripción                              | Requiere    |
| :----- | :--------------------------------------------- | :--------------------------------------- | :---------: |
| GET    | `/courses`                                     | Obtener todos los cursos publicados      |      -      |
| GET    | `/courses/trending`                            | Obtener cursos en tendencia              |      -      |
| GET    | `/courses/my-courses`                          | Obtener mis cursos (inscritos o creados) |    Auth     |
| GET    | `/courses/:id`                                 | Obtener detalles de un curso             |      -      |
| POST   | `/courses`                                     | Crear nuevo curso                        | Professor   |
| PUT    | `/courses/:id`                                 | Actualizar curso                         | Professor   |
| DELETE | `/courses/:id`                                 | Eliminar curso                           | Professor   |
| POST   | `/courses/:id/units`                           | Agregar unidad al curso                  | Professor   |
| PUT    | `/courses/:id/units/:unitId`                   | Actualizar unidad del curso              | Professor   |
| DELETE | `/courses/:id/units/:unitId`                   | Eliminar unidad del curso                | Professor   |
| POST   | `/courses/:id/units/:unitId/activities`        | Agregar actividad a la unidad            | Professor   |
| POST   | `/courses/:id/units/:unitId/materials`         | Agregar material a la unidad             | Professor   |

**Filtros disponibles para `GET /courses`:**
- `search`: Búsqueda por nombre o descripción
- `courseType`: Filtrar por tipo de curso (ID)
- `isFree`: Filtrar cursos gratuitos (true/false)

---

## Inscripciones (`/api/enrollments`)

| Método | Endpoint              | Descripción                            | Requiere |
| :----- | :-------------------- | :------------------------------------- | :------: |
| GET    | `/enrollments`        | Obtener todas las inscripciones        |   Auth   |
| GET    | `/enrollments/:id`    | Obtener detalles de una inscripción    |   Auth   |
| POST   | `/enrollments`        | Inscribirse en un curso                |   Auth   |
| PUT    | `/enrollments/:id`    | Actualizar progreso de inscripción     |   Auth   |

---

## Profesores (`/api/professors`)

| Método | Endpoint                | Descripción                        | Requiere  |
| :----- | :---------------------- | :--------------------------------- | :-------: |
| GET    | `/professors`           | Obtener todos los profesores       |     -     |
| GET    | `/professors/:id`       | Obtener detalles del profesor      |     -     |
| GET    | `/professors/profile`   | Obtener perfil propio de profesor  | Professor |
| PUT    | `/professors/profile`   | Actualizar perfil de profesor      | Professor |

---

## Estudiantes (`/api/students`)

| Método | Endpoint               | Descripción                          | Requiere |
| :----- | :--------------------- | :----------------------------------- | :------: |
| GET    | `/students/:id`        | Obtener detalles del estudiante      |   Auth   |
| GET    | `/students/profile`    | Obtener perfil propio de estudiante  | Student  |
| PUT    | `/students/profile`    | Actualizar perfil de estudiante      | Student  |

---

## Instituciones (`/api/institutions`)

| Método | Endpoint                | Descripción                         | Requiere |
| :----- | :---------------------- | :---------------------------------- | :------: |
| GET    | `/institutions`         | Obtener todas las instituciones     |    -     |
| GET    | `/institutions/:id`     | Obtener detalles de la institución  |    -     |
| POST   | `/institutions`         | Crear nueva institución             |  Admin   |
| PUT    | `/institutions/:id`     | Actualizar institución              |  Admin   |
| DELETE | `/institutions/:id`     | Eliminar institución                |  Admin   |

---

## Tipos de Curso (`/api/coursetypes`)

| Método | Endpoint              | Descripción                        | Requiere |
| :----- | :-------------------- | :--------------------------------- | :------: |
| GET    | `/coursetypes`        | Obtener todos los tipos de curso   |    -     |
| GET    | `/coursetypes/:id`    | Obtener detalles del tipo de curso |    -     |
| POST   | `/coursetypes`        | Crear nuevo tipo de curso          |  Admin   |
| PUT    | `/coursetypes/:id`    | Actualizar tipo de curso           |  Admin   |
| DELETE | `/coursetypes/:id`    | Eliminar tipo de curso             |  Admin   |

---

## Solicitudes de Profesor (`/api/appeals`)

| Método | Endpoint         | Descripción                              | Requiere |
| :----- | :--------------- | :--------------------------------------- | :------: |
| GET    | `/appeals/me`    | Obtener mis solicitudes                  |   Auth   |
| GET    | `/appeals`       | Obtener todas las solicitudes            |  Admin   |
| GET    | `/appeals/:id`   | Obtener detalles de una solicitud        |   Auth   |
| POST   | `/appeals`       | Enviar solicitud para ser profesor       |   Auth   |
| PUT    | `/appeals/:id`   | Actualizar estado de solicitud           |  Admin   |

---

## Evaluaciones (`/api/assessments`)

| Método | Endpoint                           | Descripción                         | Requiere  |
| :----- | :--------------------------------- | :---------------------------------- | :-------: |
| GET    | `/assessments`                     | Obtener evaluaciones                |   Auth    |
| GET    | `/assessments/:id`                 | Obtener detalles de una evaluación  |   Auth    |
| POST   | `/assessments`                     | Crear nueva evaluación              | Professor |
| PUT    | `/assessments/:id`                 | Actualizar evaluación               | Professor |
| DELETE | `/assessments/:id`                 | Eliminar evaluación                 | Professor |
| GET    | `/assessments/:id/attempts`        | Obtener intentos del estudiante     |   Auth    |
| POST   | `/assessments/:id/attempts`        | Iniciar nuevo intento               |  Student  |

---

## Pagos (`/api/payments`)

| Método | Endpoint                  | Descripción                       | Requiere |
| :----- | :------------------------ | :-------------------------------- | :------: |
| POST   | `/payments/create`        | Crear orden de pago               |   Auth   |
| GET    | `/payments/:id/status`    | Verificar estado del pago         |   Auth   |
| POST   | `/payments/webhook`       | Webhook para notificaciones       |    -     |

---

## Administración (`/api/admin`)

| Método | Endpoint              | Descripción                         | Requiere |
| :----- | :-------------------- | :---------------------------------- | :------: |
| GET    | `/admin/analytics`    | Obtener estadísticas de plataforma  |  Admin   |
| GET    | `/admin/users`        | Obtener todos los usuarios          |  Admin   |

---

## Contacto (`/api/contact`)

| Método | Endpoint   | Descripción                 | Requiere |
| :----- | :--------- | :-------------------------- | :------: |
| POST   | `/contact` | Enviar mensaje de contacto  |    -     |

---

## Solicitudes de Unión (`/api/join-requests`)

| Método | Endpoint                 | Descripción                                    | Requiere |
| :----- | :----------------------- | :--------------------------------------------- | :------: |
| GET    | `/join-requests`         | Obtener solicitudes de unión a institución     |   Auth   |
| PUT    | `/join-requests/:id`     | Actualizar estado de solicitud de unión        |   Auth   |
