{# Propuesta TP DSW

## Grupo
### Integrantes
* 53477 - Fornells, Nuria Belen
* 52812 - Gerbaudo Milena Luz


### Repositorios
* [frontend app](https://github.com/nuriafornells/frontendTP.git)
* [backend app](https://github.com/nuriafornells/backendTP.git)


## Tema
### Descripción
El proyecto consiste en el desarrollo de una aplicación web full stack para una agencia de viajes. Los usuarios podrán ver distintos paquetes turísticos con destinos nacionales e internacionales, con su precio, fechas de salida/llegada, y detalles de los servicios incluidos, junto a las formas de contacto disponibles para realizar la reserva o consultas. La app también incluirá funciones para que los administradores puedan gestionar los paquetes disponibles. 


### Modelo
MD: https://drive.google.com/file/d/1fIw_y52k2I7hz1cHX3uEgDLWok7ewhlU/view?usp=sharing 

## Alcance Funcional 
cuus para los crud
CUU 1.1 Seleccionar paquete
CUU 1.2 Consultar viajes reservados
CUU 1.3 Confirmar viaje
CUU 1.4 Ingresar cliente
CUU 1.5 Registrar cliente

Casos de Uso adicionales o de Mantenimiento
CUU 2.1 Gestionar paquetes de viajes(hotel, actividades, duracion)
CUU 2.2 Gestiónar categorias
CUU 2.3 Gestionar destinos(destino, paquetes de viaje)

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

