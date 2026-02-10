# Minuta 3

**Período de la Minuta**: 18/05/2025 - 16/07/2025  
**Fecha de Generación de la Minuta**: 27/07/2025  
**Modalidad de Trabajo**: Asincrónica con Comunicación Continua y Reuniones Virtuales Sincrónicas.

## 1. Asistentes / Participantes

**12/06/2025 (Reunión Virtual):**

- `Correa, Martiniano Leon`
- `Varrenti, Lara`

**A partir del 10/07/2025 (Trabajo Asincrónico):**

- `Achares, Jonatan Francisco Angel`
- `Correa, Martiniano León`
- `Varrenti, Lara`

## **2. Temas Tratados y Decisiones Clave**

**12/06/2025 - Inicio de Conversación Frontend/Backend y Estructura de Repositorios:**

- **Tema:** Discusión sobre la arquitectura de la aplicación, específicamente la separación de frontend y backend.
- **Decisión:** Se planteó la idea inicial de tener dos repositorios separados para cada parte de la aplicación. Se intentó implementar esta separación utilizando submódulos de un mismo repositorio, pero esta aproximación fue descartada debido a su complejidad. Finalmente, se decidió crear dos repositorios independientes: frontendapp_tpGS para el frontend y backendapp_tpGS para el backend.
- **Acciones Pendientes:** Crear los repositorios y establecer un esqueleto inicial.

**12/06/2025 - Reunión Virtual - Esbozo Inicial y Definición de Tecnologías:**

- **Tema:** Creación de un esqueleto básico de la aplicación y definición de las tecnologías principales.
- **Decisión:** Se esbozó un esqueleto inicial de la aplicación, creando algunos archivos básicos necesarios para el desarrollo. Se definieron las tecnologías a utilizar:
  - **Backend:** JavaScript (con posibilidad de TypeScript), Node.js y npm para la gestión de paquetes y código.
  - **Frontend:** HTML, CSS y React.
- **Avance:** Se intentó iniciar el modelado de las clases Alumno y Maestro en el backend, pero el avance fue mínimo.
- **Acciones Pendientes:** Continuar con el modelado de clases y la configuración inicial de los entornos.

**Período Intermedio (Post 12/06 - Pre 10/07) - Pausa en el Desarrollo:**

- **Tema:** Interrupción en el desarrollo activo del proyecto.
- **Decisión:** Se observó una reducción en la actividad de desarrollo debido a que los participantes debían atender el cursado de otras materias.
- **Acciones Pendientes:** Retomar el desarrollo una vez superados los compromisos académicos.

**10/07/2025 - Retoma del Desarrollo Asincrónico y Ajustes de Equipo:**

- **Tema:** Reanudación de las actividades de desarrollo y cambios en la composición del equipo.
- **Decisión:** Se retomó el desarrollo del proyecto de manera asincrónica. Se registró la baja de la compañera Evelyn Lopez del proyecto.

Acciones Pendientes: Redistribuir responsabilidades si es necesario y mantener la comunicación fluida.

Comunicación General: Todos los cambios o adiciones individuales realizadas durante este período fueron discutidas y comprendidas por el resto del grupo, asegurando una visión unificada del progreso.

## 3. Avances del Proyecto

- En el modelo de dominio se llegó a la versión 1.5 y por ahora se trabajará con esta versión.

### 3.1. Frontend

- **Cambios Realizados:**
  Se creó el repositorio `frontendapp_tpGS`, se agregaron archivos base y tras un tiempo se modificaron levemente para testear si funcionaban las peticiones en el backend con el uso de botones.
- **Adiciones**: Se agregaron los archivos `index.html` y `styles.css` como base inicial genérica del proyecto
- **Sustracciones**: _No se han realizado sustracciones en el frontend en este período._

### 3.2. Backend

**Cronología de Cambios y Adiciones :**

| Fecha      | Responsable        | Descripción del Cambio/Adición                                                                                                                                                                                      |
| ---------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10/07/2025 | Correa, Martiniano | Inicio del desarrollo del backend. Se comenzó a utilizar la herramienta nodemon para facilitar el desarrollo. Se decidió integrar yarn para la gestión de paquetes y dotenv para el manejo de variables de entorno. |
| 12/07/2025 | Correa, Martiniano | Se estableció la relación entre el archivo index.js del backend y el entorno del frontend, preparando la comunicación inicial entre ambas partes de la aplicación.                                                  |
| 14/07/2025 | Varrenti, Lara     | Implementación del entorno de trabajo Express.js en el backend, sentando las bases para la creación de rutas y APIs.                                                                                                |
| 16/07/2025 | Varrenti, Lara     | Aplicación de middlewares en Express.js para servir archivos estáticos, lo que permitirá al frontend acceder a recursos como HTML, CSS y JavaScript.                                                                |

## 4. Nuevas Tecnologías / Herramientas Exploradas o Integradas

- **Nodemon:** Herramienta para reiniciar automáticamente la aplicación Node.js cuando se detectan cambios en los archivos.
- **Yarn:** Gestor de paquetes alternativo a npm, utilizado para la gestión de dependencias del proyecto.
- **Dotenv:** Biblioteca para cargar variables de entorno desde un archivo .env en el proceso de Node.js.
- **Express.js:** Framework web para Node.js, utilizado para construir APIs y aplicaciones web.

## 5. Obstáculos / Desafíos Identificados

- **Complejidad en la Estructura de Repositorios:** El intento inicial de usar submódulos en un único repositorio resultó ser demasiado complejo y fue descartado, lo que generó una breve demora en la configuración inicial.
- **Discontinuidad en el Desarrollo:** El período de baja actividad debido a compromisos académicos externos representó un desafío para mantener el ritmo y la inercia del proyecto.
- **Modelado Inicial de Clases:** El avance limitado en el modelado de clases `Alumno` y `Maestro` en el backend sugiere que se necesita de dedicar más tiempo a esta fase de diseño.

## 6. Próximos Pasos y Objetivos para la Siguiente Minuta

- **Continuar con el Desarrollo del Backend:** Avanzar en la implementación de las clases del modelo de dominio (`Alumno`, `Maestro`, `Materia` y `Curso`) y la creación de los primeros endpoints API.

  - **Responsable(s):** Todos los integrantes
  - **Fecha Límite Sugerida:** 15/08/2025

- **Configuración Inicial del Frontend:** Establecer el proyecto React, configurar los primeros componentes y la conexión con el backend.

  - **Responsable(s):** Todos los integrantes
  - **Fecha Límite Sugerida:** 15/08/2025

- **Asignar responsabilidades de los CRUDs simples** Identificar los CRUDs simples que se deben hacer para alcanzar la regularidad y asignarlos a los distintos integrantes.

  - **Responsable(s):** Todos los integrantes
  - **Fecha Límite Sugerida:** 01/08/2025

- **Integrar Base de Datos Persistente en Backend:** Conectar el backend a una base de datos persistente externa y configurar un ORM/ODM/Mapper para la interacción con los datos.

  - **Responsable(s):** Todos los integrantes
  - **Fecha Límite Sugerida:** 13/08/2025

- **Desarrollar un GET ALL en Frontend:** Implementar el consumo de un endpoint GET ALL desde el frontend al backend ya desarrollado, para listar múltiples elementos de una colección.
  - **Responsable(s):** Todos los integrantes
  - **Fecha Límite Sugerida:** 30/08/2025

## 7. Anexos / Referencias

- [Repositorio Frontend](https://github.com/MartinianoLeonCorrea/frontndapp_tpGS)
- [Repositorio Backend](https://github.com/MartinianoLeonCorrea/backendapp_tpGS)

---
