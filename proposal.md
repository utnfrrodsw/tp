# Propuesta TP DSW

## Grupo
### Integrantes
* 51354 - Santilli, Maximo Gabriel (COM 301)
* 50319 - Valle, Micaela (COM 301)
* 51607 - Morales, Juan Pablo (COM 301)
* 50549 - Stefanini, Agustin (COM 304)

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
Gestion de torneos para un predio de Futbol 5.

### Descripción
Una aplicacion web que esta pensada para 3 tipos de usuarios:
- El "espectador" solo podra ver las tablas de posiciones de los diferentes torneos.
- El usuriario de tipo "participante" ademas podra registrarse, iniciar sesion, inscribirse en un torneo de futbol 5.
- EL usuario de tipo "admin" podra iniciar sesion, ver y administrar las tablas de posiciones y los usuarios participantes.

### Modelo

https://drive.google.com/file/d/1crx1n02jI2IXG_3mSn7VQyo8sVDRmhAR/view?usp=sharing

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo_participante<br>2. CRUD Usuario<br>3. CRUD Localidad|
|CRUD dependiente|1. CRUD Equipo {depende de} CRUD Inscripcion<br>2. CRUD Resultado_partido {depende de} CRUD Partido|
|Listado<br>+<br>detalle| 1. Listado de posiciones filtrado por id_equipo, muestra id_equipo y puesto => detalle CRUD Puesto_equipo<br> 2. Listado de torneos filtrado por localidad, muestra nombre de torneo, estado del torneo y cantidad de equipos => detalle muestra datos completos del torneo|
|CUU/Epic|1. Registrar inscripcion de un torneo<br>2. Actualizar resultado del partido|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo_participante<br>2. CRUD Usuario<br>3. CRUD Localidad<br>4. CRUD Sucursal<br>5. CRUD Equipo<br>6. CRUD Partido<br>7. CRUD Torneo<br>8. CRUD Inscripcion<br>9. CRUD Resultado_partido<br>10. CRUD Participante<br>11. CRUD Admin|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

