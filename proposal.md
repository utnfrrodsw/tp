# Propuesta TP DSW

## Grupo
### Integrantes
* D'Alleva, Berenice (Leg. 48846)

* Giannone, María Belen (Leg. 51349)

* Calvi Alfie, María Laura (Leg. 51465)

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
*2 a 6 líneas describiendo el negocio (menos es más)*

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Producto<br>2. CRUD Tipo Cliente<br>3. CRUD Tipo Empleado|
|CRUD dependiente|1. CRUD Cliente {depende de} CRUD Tipo Cliente<br>2. CRUD Producto {depende de} CRUD Tipo Producto|
|Listado<br>+<br>detalle| 1. Listado de productos filtrado por tipo de producto, muestra el id y tipo de producto => detalle CRUD Producto.<br> 2. Listado de pedidos filtrado rango por fecha, muestra id pedido,fecha de compra,nombre cliente y estado => detalle muestra datos completos del cliente y del pedido.|
|CUU/Epic|1. Realizar la compra de los productos<br>2. Controlar el stock disponible|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Producto<br>2. CRUD Tipo Cliente<br>3. CRUD Tipo Empleado<br>4. CRUD Envio<br>5. CRUD Cliente<br>6. CRUD Producto<br>7. CRUD Empleado|
|CUU/Epic|1. Realizar la compra de los productos<br>2. Controlar el stock disponible<br>3. Registrar pedido|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Reporte de ventas en un periodo de tiempo (diario, semanal, mensual) <br>2. Lista de productos más vendidos por período de tiempo, mostrando los productos más populares y su cantidad de ventas|
|CUU/Epic|1. .Cancelación de pedido<br>2. Registrar a un cliente|
|Otros|1. Envío de aviso de compra por email|

