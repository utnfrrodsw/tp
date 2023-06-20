# Propuesta TP DSW

## Grupo
### Integrantes
* 49186 - Clemente Alvarez, Federico
* 48085 - Ferrari, Mauro
* 48909 - Mendiaz, Francisco
* 47979 - Ortenzi, Fabrizio

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
*Aplicación Web para realizar pedidos de productos, de distintos tipos, comercializados por diversos locales. La misma cuenta con cuatro niveles de acceso (tipos de usuario): cliente (estándar o prémium), gestor de local, repartidor y admin. El cliente puede realizar pedidos de combinaciones de productos de un local, cada uno con una forma de pago. El gestor de local tiene la capacidad de registrar locales y crear productos dentro de los mismos, perteneciendo cada uno a una categoría de producto y contando con un histórico de precios. Por otro lado, el repartidor puede aceptar repartos de pedidos, de los cuales gana una comisión que luego puede retirar. Por último, el admin tiene permisos para realizar ABM's sobre las clases independientes (como categorías de productos o tipos de locales).*

### Modelo
![imagen del modelo]()

*Link*: https://drive.google.com/file/d/1nUSzv9a-WtSwrQWbd6s3NHWHf1WG2hX_/view?usp=sharing

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

