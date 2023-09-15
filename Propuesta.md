# Propuesta TP DSW

## Grupo “Los tiburones”
### Integrantes
* 44123-Milanesi Renzo
* 49499-Condori Sosa Juan Ignacio
* 46291-Gamba Emiliano Francisco
* 48808-Facundo Manuel Ramírez 


### Repositorios
*  [FRONTEND app](https://github.com/gitgamba/Frontend-DSW.git)
* [BACKEND app](https://github.com/gitgamba/Backend-DSW.git)

## Tema
### Descripción
Vamos a crear un E-commerce que va a ser un simulacro de una página real.
Las funcionalidades que van a tener fijas son las opciones de listar productos, mostrar detalles de los productos, crear carro de compras, eliminar producto del carrito de compras, manejar una base de usuarios en MYSQL, agregar productos nuevos a la página, administrar envíos (historial por usuario)


### Modelo

![Imgur](https://i.imgur.com/Cvsi2WT.png)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD categoría<br>2. CRUD modo de envío<br>3. CRUD Localidad<br>4. CRUD provincia|
|CRUD dependiente|1-CRUD usuario que depende de CRUD localidad<br>2-CRUD producto depende de CRUD categoría|
|Listado<br>+<br>detalle| 1-Listado de productos en carrito, filtrado por tipo de productos, muestra código de producto y tipo => detalle CRUD<br>2-Listado Historial de usuario|
|CUU/Epic|1-Realizar un pedido de compra<br>2-Envío|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1-CRUD producto<br>2-CRUD provincia<br>3-CRUD usuario<br>4-CRUD localidad<br>5-CRUD modo de envío<br>6-CRUD categoría<br>7-CRUD ESTADO COMPRA/ENVIO depende de modo de envió<br>8-CRUD Compra depende de usuario y producto<br>9-CRUD Compra detalle depende de compra<br>|
|CUU/Epic|1-Realizar compra<br>2-Cancelar envió/compra (mientras se envía el producto)<br>3-Crear ofertas (por el administrador, en un rango de fecha)<br>4-Envío (epic)<br>|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1-Listado de productos con stock<br>2-Listado de productos en oferta|
|CUU/Epic||
|Otros|1-Envío de comprobante de compra y llegada por mail|
