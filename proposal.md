# Propuesta TP DSW

## Grupo
### Integrantes

* 49069 - Tarrago, Juan Manuel
* 42710 - Portillo, Lucía

### Repositorios
* [frontend app](https://github.com/juanma414/dswFrontend)
* [backend app](https://github.com/juanma414/dswBackend)

## Tema
Aplicación para gestión de tareas estilo Trello o Jira
### Descripción
El objetivo principal de la aplicación es organizar y gestionar el trabajo de forma eficiente. Permitiendo a los usuarios crear, organizar y realizar un seguimiento de tareas, proyectos y objetivos, tanto individualmente como en equipo.

Funciones principales:
* Creación de tareas: Permite crear tareas con diferentes niveles de detalle, incluyendo título, descripción, etiquetas, prioridad, fecha límite y asignación a un responsable.
* Organización de tareas: Las tareas se pueden organizar en diferentes tableros, listas o categorías, según el flujo de trabajo del proyecto.
* Seguimiento del progreso: Permite realizar un seguimiento del progreso de las tareas, incluyendo su estado actual, avance y tiempo restante.
* Colaboración: Facilita la colaboración entre equipos y usuarios, permitiendo la comunicación y el intercambio de información sobre las tareas.
* Informes y análisis: Ofrece informes y análisis para ayudar a los equipos a mejorar su rendimiento.

### Modelo
Desde Draw.io con las diferentes versiones --> https://drive.google.com/file/d/1Miob85r-dn_M9zWg0FZaVY0_oawiB9GY/view?usp=drive_link

Versión final del Modelo: 
```mermaid
---
config:
  layout: elk
  look: neo
---
erDiagram
	direction LR
	USERS {
		number userId PK ""  
		string userName  ""  
		string userLastName  ""  
		string userRol  ""  
		string userEmail  ""  
	}

	PROJECT {
		number projectId PK ""  
		string projectDescription  ""  
	}

	SPRINT {
		number idSprint PK ""  
		number nroSprint
		date startDate  ""  
		date endDate  ""  
		string description  ""  
		int idProject FK ""  
	}

	ISSUE {
		number issueId PK ""  
		string issueDescription  ""  
		date issueCreateDate  ""  
		date issueEndDate  ""  
		string issueStatus  ""  
		string issuePriority  ""  
		int idProject FK ""  
		int idSprint FK ""  
		int typeIssue FK ""  
		int issueSupervisor FK ""  
	}

	COMMENT {
		number idComment PK ""  
		date createDate  ""  
		string description  ""  
		int idIssue FK ""  
		int idUser FK ""  
	}

	TYPEISSUE {
		number typeIssueId PK ""  
		string typeIssueDescription  ""  
	}

	PROJECT||--|{SPRINT:"has"
	PROJECT||--|{ISSUE:"contains"
	SPRINT||--o{ISSUE:"includes"
	ISSUE||--o{COMMENT:"has"
	ISSUE||--||TYPEISSUE:"categorized_as"
	USERS||--o{ISSUE:"supervises"
	USERS||--o{COMMENT:"writes"
```

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario <br>2. CRUD Incidencia <br>3. CRUD Proyecto|
|CRUD dependiente|1. CRUD Comentario {depende de} CRUD Incidencia<br>2. CRUD Incidencia {depende de} CRUD Proyecto |
|Listado<br>+<br>detalle| 1. Listado de incidencias filtrado por tipo, muestra nro y tipo de incidencia => detalle CRUD Incidencia<br> 2. Listado de Incidencias filtrado por rango de fecha, muestra nro de incidencia, fecha inicio y fin fin, estado y nombre del usuario responsable => detalle muestra datos completos de las incidencias|
|CUU/Epic|1. Armar una Sprint. <br>2. Registro del avance de una Incidencia en donde se ve si se completó y que estado tienen las mismas.


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario <br>2. CRUD Incidencia <br>3. CRUD Proyecto <br>4. CRUD Tipo de Incidencia  <br>5. CRUD Sprint|
|CUU/Epic|1. Reporte con toda la información dentro de un Sprint|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de incidencias filtrado por usuario asignado mostrando detalles como título, prioridad, estado y fecha creación  <br>2. Listado de tareas de un Sprints de un determinado proyecto.|
|CUU/Epic|1. Dashboard de progreso de un Sprint: visualiza el total de incidencias del Sprint, distribuidas por estado y prioridad <br>2. Mover una incidencia entre estados del Sprint, actualizando su estado automáticamente según el destino |

