# Propuesta TP DSW

## Grupo
### Integrantes
* 50347 - Tasselli Tomás
* 50556 - Gutierrez Ramiro
* 51857 - Nicolás Pedro

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Tienda de indumentaria online, para realizar compras con envío a domicilio en la ciudad de Rosario. 

### Modelo
https://drive.google.com/file/d/16wx9dorp1LS-VKZn0KN8y0uN5ydn0qPg/view?usp=sharing


## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Categoria <br>2. CRUD Pedido<br>3. CRUD Cliente|
|CRUD dependiente|1. CRUD Indumentaria {depende de} CRUD Categoria <br>2. CRUD Envio {depende de} CRUD Pedido <br>3. CRUD Pago {depende de} CRUD Pedido|
|Listado<br>+<br>detalle| 1. Listado de indumentaria filtrado por categoria, muestra nombre y descripción => detalle CRUD indumentaria <br> 2. Listado de pedidos filtrado por rango de fecha, muestra id de pedido, fecha, estado y nombre del usuario => detalle muestra datos completos del pedido y del usuario|
|CUU/Epic|1. Realizar un pedido <br>2. Realizar un pago|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Categoria<br>2. CRUD Pedido<br>3. CRUD Cliente<br>4. CRUD Indumentaria<br>5. CRUD Envio<br>6. CRUD Pago<br>7. CRUD Empleado|
|CUU/Epic|1. Realizar un pedido<br>2. Realizar un pago<br>3. Mostar recomendaciones|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

