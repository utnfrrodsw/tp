# Propuesta TP DSW

## Grupo
### Integrantes

* 49704 - Boggio, Valentino.
* 49687 - Dominio, Constanza.
* 50556 - Gutiérrez, Ramiro.
* 48947 - Sarkissian, Milton.

### Repositorios
*No realizado aún*
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Se pretende crear un sitio web para una ONG que realiza distintas actividades en las que se relacionan administradores (Jefes de grupos) con voluntarios. A su vez se cuenta con suscriptores parciales que reciben información sobre la página en general.

### Modelo
![imagen del modelo](https://github.com/valentttino/tp-dsw-utn/blob/main/MD.jpg)

*Atributos de las clases aún no definitivos*

## Alcance Funcional 

### Alcance Mínimo

Regularidad
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Administrador<br>2. CRUD Voluntario<br>3. CRUD Actividad<br>4. CRUD Grupo|
|CRUD dependiente|1. CRUD Informe {depende de} CRUD Actividad<br>2. CRUD Encuesta {depende de} CRUD Actividad|
|Listado<br>+<br>detalle| 1. Listado de actividades disponibles, muestra título, descripción y fecha de inicio => detalle CRUD Actividad<br> 2. Listado de ranking de porcentajes, muestra los porcentajes de aquellos que accedan a la categoría Administrador, título y fecha incio de la actividad => detalle CRUD Encuesta y CRUD Actividad<br> 3. Listado de voluntarios que puedan aplicar a ser administradores, muestra sus ID, nombre, apellido, cantidad de actividades participadas y su valoración general => detalle CRUD Voluntario|
|CUU/Epic|1. Realizar inscripción a una actividad<br>2. Consultar resultados de una encuesta post finalización de una actividad<br> 3. Consultar listado de voluntarios que reunan condiciones para ser administradores|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Administrador<br>2. CRUD Voluntario<br>3. CRUD Actividad<br>4. CRUD Grupo<br>5. CRUD Encuesta<br>6. CRUD Suscriptor<br>7. CRUD Informe<br>8. CRUD Newsletter|
|CUU/Epic|1. Registrar un administrador<br>2. Registrar un suscriptor<br>3. Registrar un voluntario<br>4. Crear una actividad<br>5. Crear grupos de la actividad<br>6. Unirse a un grupo<br>7. Realizar informe periódicamente (CUU que se repite)<br>8. Redactar y enviar un newsletter (CUU que se repite)<br>9. Realizar encuesta<br>10. Consultar resultados de la encuesta|


### Alcance Adicional Voluntario 

*Aún no definido*
