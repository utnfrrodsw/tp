Propuesta TP DSW




Grupo

Integrantes


48177 - Vivas, Magali


49847 - Birchmeyer, Alex


47286 - Battista, Jonatan


49384 - Sacchini, Tomas








Repositorios


frontend app Nota: aún no fue creado.


backend app Nota: aún no fue creado.









Tema


“Sistema para pinturería”


Descripción


El sistema se encargará de proveer servicios para una pinturería familiar con múltiples sucursales. Servirá como un sistema de gestión interno para realizar el control de stock, actualización de precios y administración de los productos que se encuentren a la venta. También, le otorgará al cliente la posibilidad de acceder a un listado de los productos que se encuentran disponibles y si lo desea, realizar la compra desde la comodidad de su hogar.







Modelo


Alcance Funcional

![TP DSW drawio](https://github.com/MaguiVivasDSW/TP-DSW-2024-/assets/166454023/ccefe73c-069a-4196-bed4-37946a9b6b15)






Req
Detalle




CRUD simple


1 - CRUD Persona


2 - CRUD Localidad


3 - CRUD Producto


4 - CRUD Sucursal





CRUD dependiente


1 - CRUD Pedido {depende de} CRUD Producto


2 - CRUD Ítem {depende de} CRUD pedido


3 - CRUD Envío {depende de} CRUD Pedido


4 - CRUD Venta {depende de} CRUD Pedido


5 - CRUD Cliente {depende de} CRUD Persona


6 - CRUD Vendedor {depende de} CRUD Persona


7 - CRUD Proveedor {depende de} CRUD Persona











Listado + detalle


1 - Listado de productos filtrado por tipo de producto, muestra producto y precio => detalle CRUD Producto


2 - Listado de ventas filtrado por rango de fecha muestra venta, producto, cliente => detalle muestra datos completos del pedido, cliente y envío en caso de ser necesario.


3 - Listado de productos filtrado por tipo de producto, muestra producto y cantidad disponible => detalle muestra CRUD Producto








CUU/Epic


1 - Realizar la compra de un producto.


2 - Realizar la preparación de un pedido.


3 - Actualización de stock de un producto.


4 - Cancelación de un pedido realizado.






Otros


Envío de correo al cliente cuando realiza la compra





 
Primer CRUD a presentar


CRUD Sucursal
