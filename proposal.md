# Propuesta TP DSW

## Grupo
### Integrantes
* 48944- DIAZ, IÑAKI (com 301)
* 51705- PALMIERI, AUGUSTO (com 304)

### Repositorios
* [frontend app](https://github.com/AugustoPalmieri/DSW-frontend)
* [backend app](https://github.com/AugustoPalmieri/DSW-backend)


## Tema
### Descripción
Sistema de atención y gestión para una hamburguesería con el objetivo de  facilitar el manejo de los recursos ya sean clientes, ingredientes, pedidos y hamburguesas contemplando pedidos takeaway o vía delivery.

### Modelo
![](https://github.com/AugustoPalmieri/DSW2024-DIAZ-COSTAMAGNA-PALMIERI/blob/main/DERDSWFINAL.drawio.png)

## Reglas de Negocio

* El registro de los clientes es un número incremental.
* montoTotal es el calculo de la suma de los precios de hamburguesas.
* El Stock no puede ser un valor negativo, stock 0 no se puede agregar la hamburguesa al pedido.
* Si el cliente se equivoco en el pedido, la modificación solo la puede realizar el administrador a traves del sistema.
* La modalidad que figura en el pedido es TAKEAWAY O DELIVERY.
* El estado del pedido puede ser EN PROCESO O TERMINADO.
* Un pedido puede ser eliminado unicamente si se encuentra en estado ENTREGADO.
* Un ingrediente puede ser eliminado unicamente si antes se elimina la hamburguesa que lo utiliza.
* Una hamburguesa puede ser eliminada unicamente si no se encuentra en un pedido en estado EN PROCESO.


## Alcance Funcional 

### Alcance Mínimo


|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Hamburguesa (primer CRUD propuesta)<br>2. CRUD Cliente<br>3. CRUD Ingrediente <br>4. CRUD Precio <br>5. CRUD Pedido
|CRUD dependiente|1. CRUD Precio {depende de} CRUD Hamburguesa <br>2. CRUD Pedido {depende de} CRUD Hamburguesa |
|Listado<br>+<br>detalle| 1. Listado de hamburguesas, muestra id, nombre y descripción  => detalle CRUD Habitacion<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de habitación, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar un pedido|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

