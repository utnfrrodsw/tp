# Propuesta TP DSW

## Grupo
### Integrantes
* 48706 - Feldkircher, Valentin
* 51836 - Capiglioni, Bruno
* 51462 - Forestello, García Joaquín

### Repositorios
* [frontend app](https://github.com/joaquingarciaf9/TP-DSW-Front.git)
* [backend app](https://github.com/joaquingarciaf9/TP-DSW-Back.git)

## Tema
### Descripción
Tienda de informática, dedicada a la venta de insumos informáticos y hardware. Las compras se realizan solamente por la página web, por lo que no es necesario lugar físico para atención al público. A la hora de comprar los usuarios tienen que registrarse en la página. Se cuenta con un depósito para los productos. Se cuenta con una red de proveedores y se realizan envíos a domicilio a todo el país.

### Modelo
[imagen del modelo](https://drive.google.com/file/d/1tspmmrd7tE3pIv9yotZqhfCTolZ3Ts9E/view?usp=drive_link)

## Alcance Funcional 

### Alcance Mínimo
 
Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Producto<br>2. CRUD Cliente<br>3. CRUD Proveedor|
|CRUD dependiente|1. CRUD Producto {depende de} CRUD Proveedor<br>2. CRUD |
|Listado<br>+<br>detalle| 1. Listado de pedidos filtrado por cliente, muestra detalles de los pedidos y detalle de los productos de esos pedidos<br> 2. Listado con pedidos filtrados por estado, muestra datos completos del pedido y datos del cliente que realizó el mismo|
|CUU/Epic|1. Realizar compra<br>2. Registrar nuevo usuario|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Producto<br>2. CRUD Cliente<br>3. CRUD Proveedor<br>4. CRUD Pedido<br>5. CRUD Empleado<br>6. CRUD <br>7. CRUD |
|CUU/Epic|1. <br>2. <br>3. |


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. <br>2. |
|CUU/Epic|1. <br>2. |
|Otros|1. |

