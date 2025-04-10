# Propuesta TP DSW

## Grupo
### Integrantes
* 49621 - Renzi, Alvaro
* 50249 - Papaolo, Francisco

### Repositorios
* [frontend app]()
* [backend app]()

## Tema
### Descripción
Tienda Online de Productos para Gimnasio.
Se desarrollará una aplicación para la venta de productos enfocados al ámbito del fitness y gimnasio. En la tienda listaremos suplementos, ropa deportiva, accesorios y otros productos relacionados, y nos encargaremos de ofrecer distintas formas de pago con el fin de facilitar la compra online y la gestión de pedidos.

### Modelo
![imagen](https://github.com/user-attachments/assets/c558e9aa-f5d8-47fc-ad8a-59486acd48bc)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Categoria<br>2. CRUD Usuario|
|CRUD dependiente|1. CRUD Producto {depende de} CRUD Categoria|
|Listado<br>+<br>detalle| 1. Listado de Producto filtrado por Categoria, muestra nombre de Categoria => nombre, precio e imagen CRUD Producto|
|CUU/Epic|1. Realizar orden<br>2.|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Producto<br>2. CRUD Categoria<br>3. CRUD Proveedor<br>4. CRUD DetalleCarrito<br>5. CRUD Carrito<br>6. CRUD Usuario<br>7. CRUD Revision<br>8. CRUD DetalleOrden<br>9. CRUD Orden<br>10. CRUD Cupon <br>11. CRUD Pago|
|CUU/Epic|1. Realizar orden<br>2. Realizar pago<br>3. (Dar alta producto) demas|


### Alcance Adicional Voluntario (completaremos despues de consulta y a medida que avancemos)

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. -- <br>2. --|
|CUU/Epic|1. --<br>2. --|
|Otros|1. --|

