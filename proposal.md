# Propuesta TP DSW

## Grupo
### Integrantes
52594 - Garcia, Candela
52547 - Vega, Lucila Bianca
52958 - Cassina, Fiorella

### Repositorios
* [Frontend] https://github.com/fiocassina/Backend-TP-DS.git
* [Backend] https://github.com/fiocassina/Backend-TP-DS.git

*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Una plataforma diseñada para que los docentes puedan crear, asignar y realizar un seguimiento de proyectos académicos, organizada por materias y grupos de estudiantes. Cada alumno, deberá matricularse a una materia donde podrá unirse o crear un grupo, el cual subirá entregas de proyectos, visualizará correcciones y permitirá ver un seguimiento claro del progreso general del equipo.



### Modelo
https://drive.google.com/file/d/1hfN_84HRdzsZLP-DmqMR-2_YcM8cXIp6/view?usp=sharing

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Persona<br>2. CRUD Materia<br>3. CRUD Proyecto|
|CRUD dependiente|1. CRUD Entrega {depende de} CRUD Proyecto<br>2. CRUD Corrección {depende de} CRUD Entrega|
|Listado<br>+<br>detalle| 1. Listado de proyectos con entregas aprobadas en un rango de fechas determinadas => detalle CRUD Proyecto <br> 2. Listado de proyectos pendientes de entrega que tiene un alumno => detalle CRUD Entrega|
|CUU/Epic|1. Crear proyecto<br>2. Realizar entrega|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Persona<br>2. CRUD Materia<br>3. CRUD Proyecto<br>4. CRUD Entrega<br>5. CRUD Corrección<br>6. CRUD Bibliografia<br>7. CRUD Grupo|
|CUU/Epic|1. Realizar matriculacion a materia<br>2. Crear proyecto<br>3. Realizar entrega|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados | |
|CUU/Epic|1. Crear grupo<br>2.Realizar correccion de entrega<br>3. Modificar entrega|
|Otros|1. Envío de recordatorio de entrega pendiente proximo a fecha limite de proyecto|

