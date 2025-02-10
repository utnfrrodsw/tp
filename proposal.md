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


|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Hamburguesa (primer CRUD propuesta)<br>2. CRUD Cliente<br>3. CRUD Ingrediente <br>4. CRUD Precio <br>5. CRUD Pedido |
|CRUD dependiente|1. CRUD Precio {depende de} CRUD Hamburguesa <br>2. CRUD Pedido {depende de} CRUD Hamburguesa |
|Listado<br>+<br>detalle| 1. Listado de hamburguesas, muestra id, nombre y descripción <br> 2. Listado de clientes, muestra id, nombre, apellido, telefono, email, dirección <br> 3. Listado de ingredientes, muestra descripción y stock <br> 4. Listado de pedidos ordenados, muestra idPedido, idCliente, modalidad, monto, estado, hamburguesas(nombre, cantidad y precio) => detalle: botón de confirmación de pedido ENTREGADO 
|CUU/Epic|1.Realizar un pedido <br>2. Rellenar y enviar formulario en Contacto|
|Otros|1. Recepción del formulario rellenado en contacto <br> 2. Código de validación para ingreso del administrador al sistema <br> 3. Recepción de email al momento de finalizar un pedido


