# Propuesta TP DSW

## Grupo
### Integrantes
* 51836 - Capiglioni, Bruno

### Repositorios
* [frontend app](https://github.com/brunocapiglioni/proyecto-dsw)
* [backend app](https://github.com/brunocapiglioni/proyecto-dsw-back)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Un software pensado para los alumnos de la facultad, para que puedan registrarse como estudiantes de una cierta carrera, compartir material con otros compañeros, armar grupos de estudio y resolver dudas. Además que cada usuario pueda crear carpetas donde agrupar el contenido, y un calendario, para organizar las fechas de parciales, tp, etc.
### Modelo
https://app.diagrams.net/#G1PR08dfqftK6npTTpZ6HmEGqlNiXfCBbF#%7B%22pageId%22%3A%228YNqjsFgYrRHH0SMi45v%22%7D
## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Carrera<br>2. CRUD Usuario<br>3. CRUD Materia|
|CRUD dependiente|1. CRUD Grupo {depende de} CRUD Usuario<br>2. CRUD Material {depende de} CRUD Usuario, Crud Materia|
|Listado<br>+<br>detalle| 1. Listado de usuarios que aportaron material para una materia específica ordenados por fecha, muestra id y nombre del usuario<br> 2. Listado de material aportado para una carrera específica, ordenado por valoración. Muestra materia y fecha de subida|
|CUU/Epic|1. Registrar un nuevo usuario<br>2. Registrar nueva Materia|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Carrera<br>2. CRUD Usuario<br>3. CRUD Materia<br>4. CRUD PlanEstudio<br>5. CRUD Grupo<br>6. CRUD Material<br>7. CRUD Carpeta|
|CUU/Epic|1. Registrar un nuevo usuario<br>2. Registrar nueva Materia<br>3. Registrar nuevo material|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

