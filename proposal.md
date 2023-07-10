# Propuesta TP DSW

## Grupo
### Integrantes
* legajo - Apellido(s), Nombre(s)

### Repositorios
* [frontend app](https://github.com/gaaston14/TP_CertificacionDeTareas/tree/main/frontend)
* [backend app](https://github.com/gaaston14/TP_CertificacionDeTareas/tree/main/backend)


## Tema
### Descripción
La empresa SPM tecnologias en instalacion, esta en busca de un software que le permita llevar adelante la gestion de sus empleados y flota de vehiculos, actualemnte se vienen manejando con un archivo de excel, necesitan poder controlar a los tecnicos, las tareas cumplidas por cada tecnico y el gasto de combustible hecho por cada movil de cada tecnico, cada movil esta compuesto de 1 io mas tecnicos, y las tareas a la hora de pagar los sueldos, se parte de un basico por categoria y varia segun el horario de cumplimiento, ya que se paga un extra por produccion. Se desea tener una liquidacion mensual y ademas, en ciertos casos individual por cada tecnico

### Modelo
<html>
<img src="adicionales/modelo_peliminar.jpeg">
</html>

## Alcance Funcional 



### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad|
|CRUD dependiente|1. CRUD Habitación {depende de} CRUD Tipo Habitacion<br>2. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de habitaciones filtrado por tipo de habitación, muestra nro y tipo de habitación => detalle CRUD Habitacion<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de habitación, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva|


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

