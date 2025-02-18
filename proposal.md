# Propuesta TP DSW

## Grupo
### Integrantes
* 49497 - Gini, Luca
* 49670 - Griva, Corina
* 47942 - Gutierrez, Luisina
  
### Repositorios
* [frontend app](https://github.com/luisinagutierrez/Desarrollo-front)
* [backend app](https://github.com/luisinagutierrez/Desarrollo-back)

## Tema
### Descripción
Negocio a cargo de la venta de carteras, riñoneras, billeteras mochilas y demás, cada una pertenece a una categoría en particular y tiene asociado un proveedor. Desde el lado del cliente el mismo puede registrarse y realizar las compras que quiera, dependiendo la ciudad con la cual se alla registrado trandrá un recargo relacionado con el envio, pero puede cambiar su dirección si esos desea, al igual que ver el estado de sus órdenes relaizadas y dentro de las 24 horas cancelar si eso desea.

### Modelo
![image](https://github.com/luisinagutierrez/TpDesarrolloGriva-Gutierrez/assets/111407721/703448fe-fde7-48d7-bcbf-3d8be3025000)
(https://drive.google.com/file/d/1Qt_15EN60WmYoQoQII8v9mV3cJwoB6qz/view?usp=sharing)

## Alcance Funcional 
Su funcionalidad abarca desde la gestión de productos y pedidos hasta la administración de usuarios, proveedores, provincias y ciudades.

### Alcance Mínimo
Permite la gestión básica de productos, incluyendo su creación, edición y eliminación. Los usuarios pueden registrarse, iniciar sesión y agregar productos a un carrito de compras, desde donde pueden generar pedidos y visualizar su historial. Respecto a la forma de pago de la orden es en efectivo por lo que no se contempla otra forma de pago.

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Categoría<br>2. CRUD  Proveedores<br>|
|CRUD dependiente|1. CRUD Producto {depende de} CRUD Categoría y de CRUD de proveedores|
|Listado<br>+<br>detalle| 1. Listado de productos filtados por categoría o por nombre de producto mostrando la infomación de esos productos (nombre - despcripció- precio)<br> |
|CUU/Epic|1. Realizar una compra<br>|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Clientes(dependiente de ciudad y de provincia)<br>2. CRUD Order(dependiente de usuario y de producto)<br>3. CRUD Ciudades(dependiente de provincia)<br>4. CRUD Provincias<br>5.|
|CUU/Epic|1. Olvidé mi contraseña<br>2. Cancelar la orden<br>|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de pedidos filtrado por rango de fecha, muestra nombre cliente, fecha de pedido,nombre producto, cantidad de producto, precio unitario, precio total (sumando el recargo por provincia)<br>2. Listado de productos, permitiendo la edición de sus datos o borrarlo y un filtrado por proveedores
|Otros|-|

