# Propuesta TP DSW

## Grupo
### Integrantes
* 50390 - Cabardos, Matias <br>
  52331 - Degiovanni, Bianca <br>
  52199 - Kasperczak, Ian <br>
  51350 -  Docheff, Valentino <br>

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)


## Tema
### Descripción
El gimnasio Power Trainer nos convocó para realizar un sistema que permita administrar el flujo de personas en el mismo. 
Diariamente los clientes ingresan a la aplicación para reservar un turno y realizar actividades dentro del gimnasio. A lo largo del día los profesores del gimnasio dictan dos tipos de clases: musculación y crossfit. Cada clase tiene una cantidad de cupos limitados para un determinado día y horario, es por ello que los clientes deberán anotarse con anticipación.   


### Modelo
(https://drive.google.com/file/d/1_nS8bmaKZF69zily-P3Q4HlUUluL-mYP/view?usp=sharing)

## Alcance Funcional 
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cliente <br>2. CRUD Profesor <br>3. CRUD Salon <br>4. CRUD Especialidad|
|CRUD dependiente|1. CRUD Actividad {depende de} CRUD Profesor y CRUD Salon <br>2. CRUD Membresia {depende de} CRUD Cliente  <br>3. CURD Rutina {depende de} CRUD Cliente y CRUD Profesor|
|Listado<br>+<br>detalle| 1. Listado de Clientes Muestra la lista de clientes junto al estado de la membresía => El Detalle muestra los datos del cliente y su Rutina asignada. <br> 2. Listado de clases del dia => detalle muestra los clientes anotados en la clase|
|CUU/Epic|CUU_1  Reservar turno para realizar una actividad en un determinado día y horario.<br> CUU2_ Registrar asistencia del alumno a la clase|

La data registrada por el CUU_1 sirve como Input para el CUU_2.


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

