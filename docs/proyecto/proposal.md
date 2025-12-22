> **[Portal de Documentación](../README.md)** / 🎯 Propuesta del Proyecto

# Propuesta TP DSW

## Grupo

### Integrantes

- 52154 - Gugliermino Zuñiga, Carlos Ricardo
- 52451 - Pedemonte, Nicolás
- 52325 - Trincavelli, Luca
- 53110 - Zariaga, Franco

### Repositorios

- [frontend app](https://github.com/upskill-team/Front-End-DSW)
- [backend app](https://github.com/upskill-team/Back-End-DSW)

## Tema

### Descripción

Desarrollaremos una plataforma de aprendizaje virtual. La solución consistirá en una página web con acceso a cursos donde los estudiantes podrán acceder, examinar recursos y realizar actividades. Estos cursos podrán ser gratuitos o pagos, depende como lo prefiera el instructor.

### Modelo Inicial

![Proposal MD](https://github.com/user-attachments/assets/90899d01-8de4-4a2d-a44d-42ed2b67a1f7)

[link del modelo](https://drive.google.com/file/d/1le9JNA73D_ulgn7CgIJh6w_V4lcplNSn/view?usp=sharing)

### Modelo Actual

[link al modelo actual](./model.md)

## Alcance Funcional

### Alcance Mínimo

Regularidad:

| Req                     | Detalle                                                                                                                                                                                                                  |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CRUD simple             | 1. CRUD Alumnos<br>2. CRUD Instructores<br>3. CRUD Tipos de Cursos<br>4. CRUD Instituciones                                                                                                                              |
| CRUD dependiente        | 1. CRUD Cursos {depende de} CRUD Tipos de Cursos e Instructores<br>2. CRUD Solicitud {depende de} CRUD Instructor                                                                                                        |
| Listado<br>+<br>detalle | 1. Listado de cursos filtrado por nombre, institución, instructor y tipo de curso => detalle Información de los contenidos<br>2. Listado de solicitudes filtrado por fecha de solicitud => detalle Texto de la Solicitud |
| CUU/Epic                | 1. Crear un curso nuevo para ser publicado en la plataforma<br>2. Completar curso                                                                                                                                        |

Adicionales para Aprobación

| Req      | Detalle                                                                                                                                                                                                            |
| :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CRUD     | 1. CRUD Alumnos<br>2. CRUD Instructores<br>3. CRUD Tipos de Cursos<br>4. CRUD Instituciones<br>5. CRUD Cursos<br>6. CRUD Actividades<br>7. CRUD Material<br>8. CRUD Solicitudes<br>9. CRUD Unidad<br>10. CRUD Pago |
| CUU/Epic | 1. Matricularse a un nuevo curso<br>2. Publicar actividad en el curso para los alumnos<br>3. Completar actividad del curso<br>4. Dar de baja una unidad<br>5. Pagar curso                                          |

### Alcance Adicional Voluntario (Actualizado)

| Req      | Detalle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Listado de instituciones<br>2. Listado de intentos de evaluación con filtros por curso y estudiante<br>3. Listado de evaluaciones con filtrado por curso<br>4. Listado de mis cursos con progreso y estado de inscripción<br>5. Listado de profesores                                                                                                                                                                                                                                                                                                                                                                                                          |
| CUU/Epic | 1. Solicitar unión a institución como profesor<br>2. Publicar Material<br>3. Realizar evaluaciones formales con temporizador y límite de intentos<br>4. Ver resultados de evaluaciones con feedback detallado<br>5. Gestionar evaluaciones como profesor (crear, editar, eliminar, ver estadísticas)<br>8. Ver panel de analíticas para administrador (métricas de usuarios, cursos, ingresos, crecimiento)<br>9. Ver panel de analíticas para profesor (ingresos, estudiantes, ventas mensuales)<br>10. Enviar mensaje de contacto con sistema de tickets                                                                                                            |
| Otros    | 1. Integración de Redes Sociales reales: Enlaces a Facebook, Twitter/X, Instagram y YouTube en el footer<br>2. Sistema de Progreso de Curso: Tracking de unidades completadas y porcentaje de progreso<br>3. Sistema de Calificaciones: Gestión de notas y aprobación de cursos<br>4. FAQ y Páginas Informativas: Página de preguntas frecuentes, Acerca de Nosotros y Contacto<br>5. Gestión de Perfil de Usuario: Actualización de datos personales y foto de perfil<br>6. Sistema de Instituciones: Gestión completa de instituciones educativas con managers y solicitudes de unión<br>7. Filtrado y Búsqueda Avanzada: Búsqueda con debounce, ordenamiento y paginación en múltiples entidades<br>8. Dominio personalizado con Name.com<br>9. Integración con Cloudflare<br>10. Better Stack para gestión de logs<br>11. Codecov para cobertura de código en el Backend<br>12. Sistema de envío de emails<br>13. Cypress Cloud trial de 1 mes para seguimiento y análisis de resultados de tests |
