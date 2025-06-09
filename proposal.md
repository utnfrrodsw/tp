# Propuesta TP DSW

## Grupo
### Integrantes
* 49621 - Renzi, Alvaro
* 50249 - Papaolo, Francisco

### Repositorios
* [frontend app](https://github.com/AlvaroRen/frontend-tp-dsw-2025.git)
* [backend app](https://github.com/Papaolofran/backend-tp-dsw-2025.git)

## Tema
### Descripción
Tienda Online de Productos para Gimnasio.
Es una plataforma de comercio electrónico especializada en la venta de productos enfocados al ámbito del fitness y gimnasio, en la cual se listarán de manera categorizada suplementos, ropa deportiva, accesorios y otros productos relacionados. Se contará con funcionalidades que mejorarán tanto la experiencia de los clientes como la de los administradores, como pueden ser la gestión de productos, pedidos, pagos, revisiones, etc.

### Modelo
![Modelo de Dominio 1 0 2](https://github.com/user-attachments/assets/7f2393e5-8351-4688-bd5c-67755fb30e37)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Categoria<br>2. CRUD Usuario|
|CRUD dependiente|1. CRUD Producto {depende de} CRUD Categoria|
|Listado<br>+<br>detalle| 1. Listado de Producto filtrado por Categoria, muestra nombre de Categoria => nombre, precio e imagen CRUD Producto|
|CUU/Epic|1. Realizar orden<br>|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Producto<br>2. CRUD Categoria<br>3. CRUD Usuario<br>4. CRUD Revision<br>5. CRUD DetalleOrden<br>6. CRUD Orden<br>7. CRUD Cupon <br>8. CRUD Pago|
|CUU/Epic|1. Realizar orden<br>2. Realizar pago<br>3. (Dar alta producto) demas|


### Alcance Adicional Voluntario (completaremos despues de consulta y a medida que avancemos)

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. -- <br>2. --|
|CUU/Epic|1. --<br>2. --|
|Otros|1. --|

