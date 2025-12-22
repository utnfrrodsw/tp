> **[Portal de Documentación](../README.md)** / Documentación de la API

# Documentación de la API de UpSkill

## Documentación Interactiva (Swagger)

La forma más completa de explorar la API es a través de **Swagger UI**, que proporciona documentación interactiva con todos los endpoints, esquemas y la posibilidad de probar las peticiones directamente.

### Acceso en Desarrollo

1. Inicia el servidor backend:
   ```bash
   npm run dev
   ```

2. Accede a la documentación en:
   ```
   http://localhost:3000/api-docs
   ```

La interfaz de Swagger permite:
- Explorar todos los endpoints organizados por módulos
- Ver los esquemas completos de petición y respuesta
- Probar endpoints directamente desde el navegador
- Revisar los códigos de estado y errores posibles

---

## Principios de Diseño

Nuestra API se adhiere a los siguientes estándares para garantizar la consistencia, previsibilidad y seguridad:

| Principio                 | Descripción                                                                                                                                            |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquitectura RESTful**  | Métodos HTTP estándar (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) para interactuar con los recursos                                                      |
| **Formato JSON**          | Todas las respuestas en formato `application/json` con estructura consistente                                                                           |
| **Autenticación JWT**     | Rutas protegidas mediante JSON Web Token en el header `Authorization`                                                                                   |
| **Documentación OpenAPI** | Especificación completa siguiendo el estándar OpenAPI/Swagger                                                                                           |

---

## Recursos Principales

La API proporciona operaciones CRUD para gestionar las siguientes entidades:

- **Autenticación** - Registro, login, tokens y recuperación de contraseña
- **Usuarios** - Perfiles de alumnos, profesores y administradores
- **Cursos** - Gestión completa de cursos, unidades y materiales
- **Tipos de Curso** - Categorización de cursos
- **Instituciones** - Administración de instituciones educativas
- **Inscripciones** - Inscripción y seguimiento de progreso
- **Profesores** - Perfiles y cursos creados
- **Estudiantes** - Perfiles y cursos inscritos
- **Evaluaciones** - Cuestionarios y seguimiento de intentos
- **Solicitudes (Appeals)** - Peticiones para convertirse en profesor
- **Pagos** - Procesamiento de pagos para cursos premium
- **Contacto** - Mensajes de contacto
- **Solicitudes de Unión** - Peticiones para unirse a instituciones

---

## Índice de Documentación

| Documento                                    | Descripción                                                                     |
| :------------------------------------------- | :------------------------------------------------------------------------------ |
| **[Endpoints](./endPoints.md)**              | Lista completa de endpoints organizados por módulos                             |
| **[Formato de Respuesta](./formatoRespuesta.md)** | Estructura de respuestas JSON para operaciones exitosas y errores          |
| **[Seguridad](./seguridad.md)**              | Autenticación JWT, protección de rutas y validación                             |

---

## URL Base

Todos los endpoints están prefijados con `/api`:

- **Desarrollo**: `http://localhost:3000/api`
- **Producción**: *(Por definir al momento del despliegue)*
