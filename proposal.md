# Propuesta TP DSW

## Grupo
### Integrantes
* 49670 - Griva, Corina
* 47942 - Gutierrez, Luisina
  
### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)

## Tema
### Descripción
Negocio a cargo de la venta al por mayor y menor de carteras, riñoneras y billeteras, dentro de cada una de las mismas podemos encontrar distintas categorías que las clasifican también y también cuenta con un servicio de envío dependiendo la ciudad a la que pertenezca el cliente. Además, se lleva registro de los proveedores con los cuales se debe poner en contacto el administrador cuando el stock de cierto producto que comercializa está bajo.

### Modelo
![image](https://github.com/luisinagutierrez/TpDesarrolloGriva-Gutierrez/assets/111407721/703448fe-fde7-48d7-bcbf-3d8be3025000)
(https://drive.google.com/file/d/1Qt_15EN60WmYoQoQII8v9mV3cJwoB6qz/view?usp=sharing)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD ProductCategory<br>2. CRUD  Supplier<br>|
|CRUD dependiente|1. CRUD Product {depende de} CRUD ProductCategory|
|Listado<br>+<br>detalle| 1. Listado de producto filtrado por categoría producto, muestra nombre de producto, precio, disponibilidad, detalles y medidas => CRUD product<br> |
|CUU/Epic|1. Realizar una compra<br>|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Clients<br>2. CRUD Order<br>3. CRUD City<br>4. CRUD Province<br>5. CRUD Shipment<br>|
|CUU/Epic|1. Registrar nuevo client<br>2. Registrar nuevo supllier<br>|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de pedidos filtrado por rango de fecha, muestra nombre cliente, fecha de pedido, tipo de cliente, tipo de producto, cantidad de producto, precio total y ciudad<br>2. Listado de proveedores filtrado producto que provee, muestra nombre proveedor, contacto, fecha último pedido y cantidad pedida|
|CUU/Epic|1. Actualizar el precio del producto <br>|
|Otros|1. Envío de recordatorio de reserva por email|

