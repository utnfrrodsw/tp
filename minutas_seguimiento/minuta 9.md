# Minuta 9

**Período de la Minuta:** 19/03/2026 - 16/04/2026  
**Fecha de Generación de la Minuta:** 09/04/2026  
**Modalidad de Trabajo:** Sincrónica (Reunión Virtual) / Asincrónica (Trabajo Separado)

---

## 1. Asistentes / Participantes

**19/03/2026 (Reunión Virtual):**

- `Achares, Jonatan Francisco Angel`
- `Correa, Martiniano León`
- `Varrenti, Lara`

---

## 2. Temas Tratados y Decisiones Clave

- **19/03/2026- Avances y dificultades en la transicion:**

  - **Tema:** Exposición y debate de el trabajo individual de transición (sequelize/MikroORM y JS/TS) y sus dificultades y revisión de proposal para definir próximos pasos.
  - **Decisión:** Se decidió comenzar a trabajar con el inicio de sesión y autenticación de usuarios. 
  - **Acciones Pendientes:** Se acordó comenzar el trabajo de investigación de tecnologias de autenticación y su posterior implementación al proyecto.

-

## 3. Avances del Proyecto

### 3.1. Frontend

- **Cambios Realizados:**

  - Se implementó la pantalla de inicio de sesión con selector de rol (alumno/docente), validación de campos y manejo de errores de conexión/credenciales.
  - Se integró la navegación a login desde la pantalla principal y se ajustaron rutas para redirigir correctamente a dashboard de alumno o docente.
  - Se normalizó el consumo de datos del backend en múltiples pantallas para soportar cambios de estructura en respuestas y nombres de campos.
  - Se corrigieron filtros y orden de exámenes por fecha en vistas de alumno y docente, contemplando formatos de fecha heterogéneos.
  - Se robusteció la carga de datos en carga de notas y páginas de calendario/exámenes/perfil para reducir fallas por respuestas parciales o formatos distintos.

- **Adiciones:**

  - Creación del componente de login y estilos dedicados.
  - Persistencia de sesión en cliente con almacenamiento de token y rol, incluyendo reingreso automático cuando hay sesión válida.
  - Componente de protección de rutas para restringir acceso sin token.
  - Normalización de campos en frontend: `curso.id`, `nroLetra`, `fechaExamen/fecha_examen` y lectura estandarizada de arreglos en `data`.
  - Mejoras de mensajes de error y estados vacíos según filtros activos.

- **Sustracciones:**
  
  - Eliminación de supuestos de estructura plana de respuesta (por ejemplo, uso exclusivo de `cursoId` o listas directas sin `data`).
  - Eliminación de dependencias a endpoints/formatos previos no alineados con la API actual.
  - Limpieza de sesión ampliada eliminando token y rol al cerrar sesión.

### 3.1. Backend

- **Cambios Realizados:**

  - Se refactorizó la validación de `evaluaciones` y `examenes` separando esquemas de creación y actualización, incluyendo soporte específico para actualización batch.
  - Se incorporó validación de consultas para búsqueda de dictados por curso/materia y rutas por persona.
  - Se mejoró la creación/actualización de personas para gestionar correctamente la relación con curso.
  - Se sincronizó el alta de alumnos con la creación automática de usuario autenticable, incluyendo hash de contraseña.
  - Se normalizó el manejo de fechas de exámenes en create/update y seeders para evitar inconsistencias de formato.
  - Se implementó el módulo de autenticación con endpoint dedicado de login, desacoplando responsabilidades de usuarios y auth.

- **Adiciones:**

  - Módulo `auth` con controlador, servicio, rutas y esquema de validación de request.
  - Centralización de configuración JWT y utilidades para generar/verificar tokens.
  - Mejora del middleware de autenticación para aceptar Bearer token.
  - Validaciones de registro/login de usuario con sanitización y controles de unicidad de email.
  - Incorporación de dependencias de seguridad/autenticación y tipados asociados.
  - Expansión de colección Postman para pruebas de endpoints y actualización de exclusiones en repositorio para secretos/config local.

- **Sustracciones:**
  
  - Eliminación de definiciones intermedias redundantes de validación en módulos de examen/evaluación.
  - Eliminación de IDs redundantes en personas dentro del seeder de demo.
  - Eliminación de uso directo de secretos hardcodeados para JWT en servicios/middleware.

---

## 4. Nuevas Tecnologías / Herramientas Exploradas o Integradas

- **Autenticación JWT:** Se formalizó el uso de tokens para login y autorización de rutas protegidas.
- **bcrypt**: Se integró hashing de contraseñas para almacenamiento seguro de credenciales.
- **Esquemas Joi por operación (create/update/batch):** Se adoptó una validación más granular para mejorar robustez de API.
- **MikroORM Migrations:** Se incorporó soporte de migraciones para ordenar la evolución del esquema de datos.
- **Postman Collection estructurada:** Se amplió el set de pruebas manuales para endpoints funcionales y de autenticación.

---

## 5. Obstáculos / Desafíos Identificados

- **Estabilización del flujo de autenticación:** Hubo que definir y ajustar responsabilidades entre módulos de `user` y `auth`, persistencia de sesión y navegación por rol.
- **Validaciones batch y ruteo de evaluaciones:** Se presentaron conflictos funcionales que exigieron refactor de esquemas y orden de rutas para evitar colisiones.
- **Sincronización de entidades relacionadas:** La creación conjunta de `Persona` y `User` para alumnos demandó controles adicionales de consistencia y unicidad.

---

## 6. Próximos Pasos y Objetivos para la Siguiente Minuta

- 
  - **Responsable(s):**
  - **Fecha Límite Sugerida:** 

## 7. Anexos / Referencias

- 

---