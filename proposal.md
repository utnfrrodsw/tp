# Propuesta TP DSW

## Grupo
### Integrantes

* 49069 - Tarrago, Juan Manuel
* 42710 - Portillo, Lucía
* 44038 - Domingo, Ana Clara
* 48035 - Cia, Victoria

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
* Informes y análisis: Ofrece informes y análisis para ayudar a los equipos a mejorar su rendimiento.*

### Modelo
https://drive.google.com/file/d/1Miob85r-dn_M9zWg0FZaVY0_oawiB9GY/view?usp=drive_link

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Incidencia<br>3. CRUD Tipo Incidencia|
|CRUD dependiente|1. CRUD Comentario {depende de} CRUD Incidencia<br>2. CRUD Sprint {depende de} CRUD Proyecto |
|Listado<br>+<br>detalle| 1. Listado de incidencias filtrado por tipo, muestra nro y tipo de incidencia => detalle CRUD Incidencia<br> 2. Listado de Incidencias filtrado por rango de fecha, muestra nro de incidencia, fecha inicio y fin fin, estado y nombre del usuario responsable => detalle muestra datos completos de las incidencias|
|CUU/Epic|1. Usuario da de alta un proyecto y un sprint dentro del mismo.<br>2. Usuario realiza una carga de una incidencia. <br>3. Usurio modifica un estado de una incidencia.


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

