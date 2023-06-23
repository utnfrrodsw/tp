# Propuesta TP DSW

## Grupo
### Integrantes
* 48843 - Chiara, Agostina
* 49459 - Aguaya, Julia
* 49823 - Andriollo, Isabella
* 49419 - Matteucci, Andrea
* 49767 - Ambrosio, Facundo

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Es un sistema de gestión de venta de libros que proporciona a los usuarios una plataforma conveniente y fácil de usar para buscar, explorar y comprar una amplia variedad de libros en formato físico. 

### Modelo
![image](https://github.com/AgostinaChiara/tpDSW/assets/45924448/739070a1-68fc-4c2b-bf16-77c272789cfb)

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Libro<br>2. CRUD Cliente<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Editorial<br>6. CRUD Categoria<br>7. CRUD Pedido<br>8. CRUD Administrador|
|CRUD dependiente|1. CRUD Cliente {depende de} CRUD Localidad<br>2. CRUD Libro {depende de} CRUD Categoria<br>3. CRUD Localidad {depende de} CRUD Provincia|
|Listado<br>+<br>detalle| 1. Listado de libros filtrado por tipo de categoría, muestra titulo, nombre, autor => detalle CRUD Libro<br> 2. Listado de pedidos filtrado por rango de fechas, muestra fecha de pedido, monto total, direccion de envio y libro/s enviados => detalle muestra datos completos del pedido y libro|
|CUU/Epic|1. Realizar un pedido de un libro<br>2. Cargar un libro|

