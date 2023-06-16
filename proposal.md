# Propuesta TP DSW

## Grupo
### Integrantes
* Bertea, Tomás - 49607 
* Gini, Luca - 49497  
* Zampa, Gino - 49504 


### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)


## Tema
### Descripción
Se requiere desarrollar un sistema de gestión de ventas para un emprendimiento de impresión 3D. Actualmente no tienen un sistema informático para controlar los productos y diseñadores. Se deben registrar datos de diseñadores y clientes. Los productos se organizan en categorías y tienen precios que varían. Se registran pedidos de clientes con productos y cantidades. Además, se manejan descuentos según el monto final de la venta. Los clientes pueden dejar calificaciones y elegir entre pagar en cuotas o de contado.

### Modelo
![image](https://github.com/LucaGini/TP-DSW-Bertea-Gini-Zampa/assets/64549503/8e15be0c-9ddc-48e8-8364-62427556453c)

### Link
https://app.diagrams.net/#G1B66BqLrEqd38_YH4V3yYTDvdR3sEhuAV

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Categoría<br>2. CRUD Diseñador<br>3. CRUD Provincia|
|CRUD dependiente|1. CRUD Producto {depende de} CRUD Categoría<br>2. CRUD Localidad {depende de} CRUD Provincia|
|Listado<br>+<br>detalle| 1. Listado de productos por categoría muestra idProducto y categoría(descripción)  => detalle CRUD producto.<br> 2. Listado de pedidos por rango de fechas, estado.|
|CUU/Epic|1. Realizar el pedido<br>2. Realizar el pago de un pedido|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Localidad<br>2. CRUD Provincia<br>3. CRUD Cliente<br>4. CRUD Pedido<br>5. CRUD Producto<br>6. CRUD Diseñador<br>7. CRUD Categoría.<br>8. CRUD Cuotas<br>9. CRUD Descuento|
|CUU/Epic|1. Realizar el pedido<br>2. Realizar el pago de un pedido<br>3. Calificar producto|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |TBD|
|CUU/Epic|1. Realizar entrega del pedido<br>2. Cancelación de pedido|
|Otros|1. Envío de recordatorio de entrega por mail TBD|

