# Propuesta TP DSW

## Grupo
### Integrantes
* 48453 Mercado, Martin.
* 49951 Higonet, Juan Ignacio

### Repositorios
* [frontend app](https://github.com/JuaniHigo/TP-DSW-2024/tree/main/Proyecto%20DSW/FrontEND)
* [backend app](https://github.com/JuaniHigo/TP-DSW-2024/tree/main/Proyecto%20DSW/BackEND)


## Tema
### Descripción
La pagina "nombre" se dedica a la venta de entradas online a eventos deportivos de Futbol en la ciudad de Rosario. El sitio web recibe de cada club una lista de Socios habilitados para la compra de entradas. Dedica servicios de venta y administracion a cualquier persona que quiera asistit a un evento de cualquier equipo de Futbol de la ciudad de Rosario. 
   "nombre" trabaja con los clubes Rosario Central, Newells Old Boys, Argentino de Rosario y Central Cordoba. 

### Modelo
![imagen del modelo](https://github.com/JuaniHigo/TP-DSW-2024/blob/main/Proyecto%20DSW/Imagenes/Modelo%20de%20Dominio%20DSW.drawio.png)


## Alcance Funcional 
Desde que el Socio inicia sesion hasta que se registra la venta del ticket deportivo en el historial de ventas. 
 
### Alcance Mínimo



Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD <br>2. CRUD Servicio<br>3. CRUD Localidad|
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

