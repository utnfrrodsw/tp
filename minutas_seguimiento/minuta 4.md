# Minuta 4

**Período de la Minuta:** 17/07/2025 - 06/08/2025    
**Fecha de Generación de la Minuta:** 08/08/2025    
**Modalidad de Trabajo:** Asincrónica con Comunicación Continua y Reuniones Virtuales Sincrónicas. 

---

## 1. Asistentes / Participantes

**24/07/2025 (Reunión Virtual):**

- `Achares, Jonatan Francisco Angel`
- `Correa, Martiniano León`
- `Varrenti, Lara`

**30/07/2025 (Reunión Virtual):**

- `Achares, Jonatan Francisco Angel`
- `Correa, Martiniano León`
- `Varrenti, Lara`

**06/08/2025 (Consulta Virtual Prof. Meca)**

---

## 2. Temas Tratados y Decisiones Clave

- **24/07/2025 - Reunión Virtual - Asignación de CRUDs y Elección de Base de Datos:**

  - **Tema:** Definición y asignación de los CRUDs simples para la regularidad, y elección de la base de datos.
  - **Decisión:** Se decidió utilizar mySQL como sistema de gestión de bases de datos por la familiaridad de los integrantes a la herramienta. Además, se asignaron los CRUDs simples de la siguiente manera:
    - Correa: CRUD Materia
    - Achares: CRUD Docente
    - Varrenti: CRUD Curso
  - **Consideración:** Surgió la duda sobre la implementación del CRUD Alumno, ya que si bien solo se requieren tres CRUDs para la regularidad (uno por integrante), el CRUD Alumno es fundamental para el funcionamiento básico de la aplicación.
  - **Acciones Pendientes:** Investigar la viabilidad de una único clase Usuario o Persona en lugar de Docente y Alumno en esta etapa.

- **24/07/2025 - Reunión Virtual - Reporte de avance en los CRUDs:**

  - **Tema:** Se charló sobre el avance individual de cada participante en el CRUD que se le había asignado, se acordó un mismo formato para todos y se charló brevemente sobre el FrontEnd.
  - **Decisión:** Quienes habían avanzado en su CRUD mostraron sus avances y charlaron dudas o sugerencias que le fueron ocurriendo en el proceso. Se acordó llevar una arquitectura de capas con la creación de las carpetas `\controllers`, `\models`, `\routes` y `\services`. Se concluyó que realizaremos una única clase Persona que tendrá un diferencial numérico para saber si se trata de un Alumno, Profesor u otro. Se debatió sobre aspectos del FrontEnd peró se harán efectivos más adelante en el proyecto.
  - **Acciones Pendientes:** Concluir todos los CRUDs simples y comenzar a crear en conjunto los CRUDs dependientes

- **06/08/2025 - Clase de Consulta con el Profesor:**
  - **Tema:** Revisión del avance del backend, estructura de capas y estrategia para la gestión de usuarios.
  - **Decisión:** Se confirmó que la arquitectura de capas y la estrategia de CRUD Persona eran correctas, por lo que Achares ahora se encargará del CRUD Persona. Se discutió la necesidad de separar claramente las responsabilidades del servidor, usando Express para servir únicamente la API, y un framework como Vite para el frontend.
  - **Acciones Pendientes:** Corregir la línea de código en el backend que servía el frontend con Express directamente, y reestructurar la carpeta src del frontend para una mejor modularidad.  

---

## 3. Avances del Proyecto

### 3.1. Frontend

**Cambios Realizados**: _No se han implementado avances en el frontend en este período._

- **Adiciones**: _No se han implementado adiciones en el frontend en este período._
- **Sustracciones**: _No se han realizado sustracciones en el frontend en este período._


### 3.2. Backend

- **25/07/2025 - Avance en Conexión a Base de Datos:**

  - **Cambios Realizados:** Se avanzó significativamente con la configuración y prueba de la conexión a la base de datos MySQL.
  - **Adiciones:** Se creó la base de datos `Secundaria`

- **26/07/2025 - Avance en CRUD Materia (Correa):**
  - **Cambios Realizados:** El compañero Correa avanzó con la implementación del CRUD Materia.
  - **Adiciones:** Se comenzó a utilizar Sequelize como ORM para la interacción con la base de datos, facilitando las operaciones CRUD.

- **26/07/2025 - Reorganización del proyecto en capas:**

  - **Cambios Realizados:** Se reorganizó el sistema de paquetes y archivos del backend para adherirse a una arquitectura de capas, buscando una mejor modularidad y separación de responsabilidades. Como parte de esta refactorización, se redujeron las responsabilidades del archivo index.js, y se creó un nuevo archivo app.js para la ejecución principal de la aplicación.

- **06/08/2025 - Se confeccionaron los primeros tres CRUDs simples**

  - **Cambios Realizados:** Los tres integrantes realizaron los modelos, controladores, servicios y rutas de sus respectivos CRUDs.
  - **Adiciones:** Los compañeros pendientes de elaborar sus CRUD (Curso y Persona) finalmente los implementaron en el proyecto.

---

## 4. Nuevas Tecnologías / Herramientas Exploradas o Integradas

- **MySQL:** Sistema de gestión de bases de datos relacionales, elegido para la persistencia de datos del proyecto.
- **MySQL Workbench:** Herramienta visual unificada para desarrolladores de bases de datos.
- **Sequelize:** ORM (Object-Relational Mapper) para Node.js, utilizado para facilitar la interacción con bases de datos relacionales como MySQL.

---

## 5. Obstáculos / Desafíos Identificados

- **Reflexión sobre el CRUD Alumno:** La decisión sobre si implementar el CRUD Alumno en esta etapa, considerando que no es estrictamente necesario para la regularidad pero sí para la funcionalidad básica, es un desafío. Se terminó pensando en un único CRUD Persona en lugar de uno Docente y otro Alumno por separado.

- **Gestión de Usuarios:** La duda sobre si desarrollar un CRUD Usuario completo con validación o usar usuarios predeterminados es un punto a resolver que impactará la complejidad del backend si se apunta a la regularidad.

- **Coordinación de Desarrollo Backend:** Con tres integrantes trabajando en CRUDs separados y la reestructuración de la arquitectura de capas, mantener la coherencia y la integración fluida del código fue un desafío constante.

- **Implementación del CRUD Persona:** Se concluye en conjunto con el grupo y el profesor en realizar una única clase Persona en lugar de diferenciarlas en Alumno, Docente y Personal (a futuro) diferenciandolas con atributo "tipoCodigo".

---

## 6. Próximos Pasos y Objetivos para la Siguiente Minuta

- **Abordar la Gestión de Usuarios:** Definir la estrategia para la gestión de usuarios (CRUD completo o predeterminados) y proceder con su implementación si corresponde.
  
  - **Responsable(s):** Todos los integrantes.
  - **Fecha Límite Sugerida:** 20/08/2025

- **Configuración y Primeros Pasos del Frontend:** Comenzar a configurar el proyecto de React y desarrollar los primeros componentes básicos. El objetivo es realizar un GET ALL desde el frontend hacia uno de los CRUDs ya implementados en el backend.

  - **Responsable(s):** Todos los integrantes.
  - **Fecha Límite Sugerida:** 15/08/2025

- **Comenzar el desarrollo de los CRUDs dependientes:** El próximo paso en cuanto a requisitos para la regularidad es realizar los CRUDs Dictado y Examen ahora que ya se tienen los CRUDs simples de los cuales dependen.
- 
  - **Responsable(s):** Todos los integrantes.
  - **Fecha Límite Sugerida:** 31/08/2025
---

## 7. Anexos / Referencias

- *-*

---
