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
Coco purse es una plataforma de ecommerce de la venta de carteras, billeteras y mochilas.
Tenemos dos privilegios en el mismo, cliente y administrador, primero puede realizar la compra de los productos y ver las órdenes con sus estados ya realizados, y dentro de las primeras 24 horas de realizada la compra podrá cancelar el pedido. El administrador tiene acceso a todas las entidades y puede crear, editar o eliminar cualquiera de ellas siempre y cuando las mismas no tengan otras entidades hijas asociadas, de ser el caso primero se deberán de eliminar esas antes de poder eliminar las deseadas, respecto a las ordenes peude ver las de todos lo usuarios y puede cambiar a cancelado (mismas condiciones del cliente) y él solo puede cambiar a completado si lo desea( no hay restricción de tiempo)

### Modelo
![image](![image](https://github.com/user-attachments/assets/eb25064a-561d-4778-840e-2d14c81c3454)
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

