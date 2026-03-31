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
La plataforma permite a los profesores crear clases, donde pueden asignar proyectos a los alumnos matriculados. También pueden añadir materiales de referencia a cada clase para que los estudiantes accedan al contenido necesario. Cada proyecto requiere de una entrega por parte de los alumnos, la cual es corregida por el profesor. Este ciclo de entregas y correcciones facilita el seguimiento del progreso académico de los alumnos.


### Modelo

https://drive.google.com/file/d/1z0ebVkI44QbNnX34mp9VIiEHgLDePpAk/view?usp=sharing

## Alcance Funcional 

### Alcance Mínimo
Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Correccion<br>3. CRUD Tipo Proyecto|
|CRUD dependiente|1. CRUD Material {depende de} CRUD Tipo Material<br>2. CRUD Proyecto {depende de} CRUD Tipo Proyecto|
|Listado<br>+<br>detalle| 1. Listado de alumnos aprobados que tiene un proyecto => detalle CRUD Correccion <br> 2. Listado de proyectos pendientes de entrega que tiene un alumno => detalle CRUD Proyecto|
|CUU/Epic|1. Gestion de clase<br>2. Gestion de proyecto|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Proyecto<br>3. CRUD Tipo Proyecto<br>4. CRUD Entrega<br>5. CRUD Corrección<br>6. CRUD Clase<br>7. CRUD Material|
|CUU/Epic|1. Gestion de clase<br>2. Gestion de proyecto <br>3. Gestion de Entregas y Correcciones|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados | |
|CUU/Epic|1. <br>2. <br>3. |
|Otros|1. Envío de recordatorio de entrega pendiente proximo a fecha limite de proyecto|

