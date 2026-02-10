# Minuta 6

**Período de la Minuta:** 30/08/2025 - 30/09/2025  
**Fecha de Generación de la Minuta:** 12/09/2025  
**Modalidad de Trabajo:** Sincrónica (Reunión Virtual) / Asincrónica (Trabajo Separado)

---

## 1. Asistentes / Participantes

**04/09/2025 (Reunión Virtual):**

- `Achares, Jonatan Francisco Angel`
- `Correa, Martiniano León`
- `Varrenti, Lara`

**11/09/2025 (Reunion Virtual):**

- `Achares, Jonatan Francisco Angel`
- `Correa, Martiniano León`
- `Varrenti, Lara`

## 2. Temas Tratados y Decisiones Clave

- **04/09 - Informe de avance del código:**

  - **Tema:** Presentación y revisión de los avances asincrónicos en el proyecto durante la semana.
  - **Decisión:** Se validó el trabajo realizado y se identificaron puntos clave para futuras mejoras y refactorizaciones.
  - **Acciones Pendientes:** Se acordó continuar con la refactorización y estandarización del código para una mejor integración.

- **11/09 - Revisión y planificación de objetivos:**

  - **Tema:** Análisis de los avances de la semana y establecimiento de los próximos pasos y objetivos concretos para el período siguiente.
  - **Decisión:** Se definieron los TO-DOs principales para el desarrollo del proyecto, enfocados en la funcionalidad real de la aplicación.
  - **Acciones Pendientes:** Se asignaron tareas específicas para la conexión del frontend con el backend y la implementación de funcionalidades clave.

---

## 3. Avances del Proyecto

### 3.1. Frontend

- **Cambios Realizados:**

  - Refactorización y optimización de formularios para usar react-hook-form.
  - Corrección de la lógica de carga y visualización de materias y exámenes en los dashboards.
  - Ajustes en estilos para mejorar la visualización en diferentes dispositivos (responsividad).

- **Adiciones:**

  - Nueva página con funcionalidad DictadoPage para visualizar los dictados, alumnos y modificar examenes.
  - Creación de las páginas DictadoPage, NuevoExamenPage, EditarExamenPage, BorrarExamenPage y SubirNotasPage.
  - Implementación del filtro por fecha y ordenamiento del listado de exámenes del alumno.
  - Creación de las vistas para el perfil del alumno y la lógica de edición.
  - Integración de un botón de cerrar sesión con un icono en la barra lateral.
  - El foro ahora muestra el nombre y apellido del usuario logueado, pero los mensajes no persisten.

- **Sustracciones:**
  - Eliminación del fetch redundante en el dashboard del docente para optimizar el rendimiento.

### 3.2. Backend

- **Cambios Realizados:**

  - Migración y refactorización de modelos y servicios para usar clases Sequelize.
  - Corregidas y simplificadas las asociaciones entre entidades (Dictado, Persona).
  - Ajuste de los servicios y controladores para estandarizar las respuestas de la API.
  - Se mejoraron los endpoints y servicios para una correcta integración con el frontend.
  - Se incluyeron los alumnos del curso en el servicio de dictado.

- **Adiciones:**

  - Se agregó un archivo seed para poblar la base de datos con datos de demostración.
  - Se configuró sequelize-cli para utilizar variables de entorno.
  - Se agregaron endpoints para obtener materias por DNI de alumno.

- **Sustracciones:**
  - Se eliminaron métodos y rutas obsoletas.

---

## 4. Nuevas Tecnologías / Herramientas Exploradas o Integradas

- **react-hook-form:** Biblioteca para la gestión de formularios en React.
- **sequelize-cli:** Herramienta de línea de comandos para Sequelize que simplifica las migraciones y el seeding.

---

## 5. Obstáculos / Desafíos Identificados

- **Conexión de datos en el frontend:** Se necesita asegurar que las páginas muestren los datos reales de la base de datos.
- **Funcionalidad de formularios:** Es necesario garantizar que el formulario de registro de alumnos y la gestión de exámenes se conecten de manera fluida con el backend.
- **Funcionalidad de la vista del perfil:** Se deben poder leer los datos del usuario actual y

---

## 6. Próximos Pasos y Objetivos para la Siguiente Minuta

- **Editar datos del perfil:** Vincular el perfil de usuario a la base de datos para darle funcionalidad al `editar perfil`.

  - **Responsable(s):** Todos los integrantes.
  - **Fecha Límite Sugerida: 30/09/25**

- **Calendario funcional:** Asegurar que el calendario solo muestre los exámenes del curso del usuario logueado.

  - **Responsable(s):** Todos los integrantes.
  - **Fecha Límite Sugerida: 30/09/25**

- **Registrar alumno:** Verificar que el formulario funcione correctamente y registre nuevos alumnos.

  - **Responsable(s):** Todos los integrantes.
  - **Fecha Límite Sugerida: 30/09/25**

- **Funcionalidad a páginas de Exámenes:** Darle funcionalidad completa a las páginas de gestión de exámenes (Crear, Editar, Borrar) en la vista del docente.

  - **Responsable(s):** Todos los integrantes.
  - **Fecha Límite Sugerida: 30/09/25**

---

## 7. Anexos / Referencias

---
