# Minuta 7

**Período de la Minuta:** 1/10/2025 - 23/10/2025  
**Fecha de Generación de la Minuta:** 3/10/2025  
**Modalidad de Trabajo:** Sincrónica (Reunión Virtual) / Asincrónica (Trabajo Separado)

---

## 1. Asistentes / Participantes

**9/10/2025 (Reunión Virtual):**

- `Achares, Jonatan Francisco Angel`
- `Correa, Martiniano León`
- `Varrenti, Lara`

**16/10/2025 (Reunión Virtual):**

- `Achares, Jonatan Francisco Angel`
- `Correa, Martiniano León`
- `Varrenti, Lara`

---

## 2. Temas Tratados y Decisiones Clave

- **9/10/2025- Revisión de cambios del código y decisión de nombre y logo:**

  - **Tema:** Presentación y revisión de los avances asincrónicos en el proyecto durante la semana y debate sobre el nombre, logo y slogan de la app.
  - **Decisión:** Se validó el trabajo realizado y se decidió por el nombre y legajo Skola: conecta tu futuro.
  - **Acciones Pendientes:** Se acordó continuar con la el testeo de ingreso de datos para hallar posibles errores y fallos de la app en general.

- **23/10/2025- Exposición de nuevas bibliotecas y últimos ajustes:**

  - **Tema:** Repasamos grupalmente las últimas bibliotecas implementadas Yup y Toastify de manejo de mensajes para el Front-end y recapitulamos pequeños errores solucionados y aún pendientes para la defensa del proyecto.
  - **Decisión:** Acuerdo del uso homogéneo de las notificaciones y de las responsabilidades de cada uno en cuanto a la lista de minor fixes pendientes que se realizó.
  - **Acciones Pendientes:** Resolver la lista que se generó de errores pendientes de resolución.

---

## 3. Avances del Proyecto

### 3.1. Frontend

- **Cambios Realizados:**

  - Mejora del aspecto del calendario y sus eventos (exámenes).
  - Mejora del funcionamiento del boton `Atrás` de la Sidebar.
  - Ajustes en el diseño del perfil para hacerlo más atractivo visualmente.

- **Adiciones:**

  - Implementación de las vistas `Nuevo Examen`, `Editar Examen`, `Eliminar Examen` y `Subir Notas`.
  - Incorporación de la vista de exámenes en el calendario para el Docente.
  - Centralización de las llamadas a la API en archivos de servicios (`src/services/`) para mejorar la mantenibilidad y reducir la duplicación de código.
  - Implementación de notificaciones visuales utilizando `Toastify` para mejorar la experiencia del usuario.
  - Validaciones de formularios con `Yup` y `React Hook Form`.

- **Sustracciones:**
  - Reducción de validaciones redundantes en el frontend.

### 3.2. Backend

- **Cambios Realizados:**

  - El perfil ahora permite editar datos y estos se guardan en la base de datos, previamente quedaban en memoria.
  - Optimización de validaciones del service de la clase alumnos.
  - Implementación de validaciones con Joi para estandarizar y robustecer la validación de datos en las rutas de `Persona`.
  - Refactorización del manejo de errores con middlewares globales (`errorHandler `y `notFound`) para centralizar la gestión de errores y estandarizar las respuestas.
  - Implementación de nuevas rutas en el módulo `evaluacion` para obtener evaluaciones por `examenId`, `alumnoId` y combinaciones de ambos.
  - Refactorización de validaciones en los controladores de `persona` y `curso` para utilizar sanitización de datos con `sanitizeObjectStrings`.
  - Eliminación de validaciones redundantes en los modelos de `evaluacion` y `persona`.
  - Ajustes en el controlador de `curso` para validar parámetros con esquemas de Joi.

- **Adiciones:**

  - Creación de nueva clase `Evaluación` con su respectivo CRUD para conectar `Exámenes` y `Alumnos`.
  - Implementación de funcionalidad en la BD de las páginas `Nuevo exámen`, `Editar exámen`, `Eliminar exámen` y `Subir notas`.
  - Estandarización de las respuestas de error en formato JSON con los campos `success`, `message` y `errors`.
  - Creación de archivos .schema.js y .definitions.js para mejor validación de atributos de todas las clases.
  - Incorporación de la biblioteca `sanitize-html` para sanitizar datos de entrada.

- **Sustracciones:**

  - Eliminación del archivo `materia.seed.js` que contenía datos iniciales para la entidad `Materia`.

---

## 4. Nuevas Tecnologías / Herramientas Exploradas o Integradas

- **Joi:** biblioteca de validación de esquemas de objetos para `Node.js`.
- **Yup:** biblioteca de JavaScript que ayuda a definir esquemas de datos en formularios.
- **Toastify:** Biblioteca de React que genera notificaciones gráficas con facilidad.
- **React Hook Form Resolvers:** Función de validación de esquemas de objetos muy simple para yup, joi, etc.
- **Sanitize HTML:** Biblioteca que limpia y valida contenido HTML (proveniente de usuarios) para prevenir ataques de inyección de código.

---

## 5. Obstáculos / Desafíos Identificados

- **Creación de clase Evaluación:** Con el desarrollo de la app descubrimos la necesidad de crear una clase `Evaluación` que conecte los alumnos con los exámenes para así poder implementar la Epic "Subir notas".
- **Testeo de ingreso de datos:** Se concluye que se debe realizar un arduo testeo para identificar como procesa los errores la app y como se los notifica al usuario sin romperse.`
- **Validación de datos en el backend con Joi y sanitize HTML:** desafío inicial para integrar `Joi` con los controladores existentes sin romper la funcionalidad previa. Ajuste de los controladores para delegar la validación al middleware `validateRequest`.

## 6. Próximos Pasos y Objetivos para la Siguiente Minuta

- **Depurar y verificar la app en general:** Rechequear todo el código y buscar faltantes y/o errores previo a la defensa del proyecto.

  - **Responsable(s):** Todos los integrantes.
  - **Fecha Límite Sugerida: 17/10/25**

## 7. Anexos / Referencias

- Posible logo, nombre y slogan.  
   <img width="454" height="209" alt="image" src="https://github.com/user-attachments/assets/869bdef6-6c03-4633-b219-5b501ba499f3" />

---
