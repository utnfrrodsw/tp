# Propuesta TP DSW

## Grupo
### Integrantes
* 47048 - Zarate, Exequiel
* 47094 - Martinez, Bruno
* 43814 - Aieta, Federico
* 42775 - Reinoso, Alfredo

### Repositorios
* [frontend app]https://github.com/exe72418/DDS-FRONTEND
* [backend app]https://github.com/exe72418/DDS-BACKEND

## Tema
### Descripción
La empresa de nuestro trabajo es un supermercado "FAST" que quiere desarrollar una página web para que los clientes puedan realizar pedidos de forma online.

### Modelo
![MODELO drawio](https://github.com/user-attachments/assets/02736185-525f-454a-827a-dcd07a5516a6)

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD TipoProducto<br>2. CRUD Cliente<br>3. CRUD Repartidor<br>4. CRUD Producto|
|CRUD dependiente|1. CRUD Pedido<br>2. CRUD Entrega|
|Listado<br>+<br>detalle| 1. Listado de productos filtrado por tipo de producto, nro de producto y precio<br> 2. Listado de pedidos filtrado por rango de fecha, por nro de pedido|
|CUU/Epic|1. Dar de alta Cliente<br>2. Realizar un pedido |


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD TipoProducto<br>2. CRUD Cliente<br>3. CRUD Repartidor<br>4. CRUD Producto<br>5. CRUD Pago<br>6. CRUD Precio<br>7. CRUD LineaProducto<br>8. CRUD Entrega<br>9. CRUD Pedido|
|CUU/Epic|1. Modificar Pedido<br>2. Dar de baja productos<br>3. Modificar productos|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1.Listado de entregas filtrado por rango de fecha y por cliente|
|CUU/Epic|1. Dar de baja pedido<br>2. Dar de baja cliente|
|Otros|1. Envío de recordatorio del pedido por mail|
