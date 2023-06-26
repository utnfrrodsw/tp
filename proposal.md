# TP-DSW: Compra-Venta de Libros

Repositorio para el trabajo práctico integrador de la materia Desarrollo de Software

## Integrantes

| Alumno           | Legajo |
| :--------------- | -----: |
| Iturburu Ignacio |  46100 |
| Ortigosa Brian   |  47350 |
| Zapata Mayra     |  42969 |

## Tema

### Descripción

Nuestra plataforma en línea es un mercado virtual de compra y venta de libros. Con interfaz y funciones de búsqueda para libros, los cuales se identificarán con un nombre y un género.

### Modelo

![modelo](https://i.ibb.co/cJh4V4N/DSW-Modelo.jpg)

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Rol<br>2. CRUD Género<br>3. CRUD Autor|
|CRUD dependiente|1. CRUD Libro {depende de} CRUD Género, CRUD Autor & CRUD Editorial<br>2. CRUD Usuario {depende de} CRUD Rol|
|Listado<br>+<br>detalle| 1. Listado de Libros filtrado por género y autor => detalle CRUD Libro<br> 2. Listar transacciones de un usuario|
|CUU/Epic|1. Realizar una compra<br>2. Publicar un libro para la venta|

Adicionales para Aprobación:
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Rol<br>2. CRUD Género<br>3. CRUD Autor<br>4. CRUD Libro<br>5. CRUD Usuario<br>6. CRUD Editorial<br>7. CRUD Compra|
|CUU/Epic|1. Reseñar un libro comprado|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                     |
| :------- | :-------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Listado de compras y ventas de un usuario, muestra el nombre del libro y, si es una venta, muestra quién es el comprador |
| CUU/Epic | 1. Ofertas de libros<br>2. Tipos de envío                                                                                   |
| Otros    | 1. Notificación de una venta vía mail                                                                                       |
