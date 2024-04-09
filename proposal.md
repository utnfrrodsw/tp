# Propuesta TP DSW

## Grupo
### Integrantes
* 43081 - Bozio, Rodrigo Ezequiel
* 44830 - Piernas, Delfina

### Repositorios
* [frontend app](http://link)
* [backend app](http://link)

## Tema
### Descripción
Nuestro proyecto es una landing page del negocio "La Española - RestoBar", en la que detallamos su carta de productos (platos, postres, tragos, etc), iframe con localización, horarios, links de contacto, e-commerce a modo de delivery, con posibilidad del agregado de más funcionalidades a futuro. Contará tambien con un sistema de puntuación (5 estrellas o likes) y tendrá una funcionalidad de reserva de mesas.
En la pantalla de admin: Podrá hacer un CRUD de los productos, y los clientes que se encuentran en el local (Controlados por numero de mesa)
El metodo de logueo será Google Auth.

### Modelo
![imagen del modelo]()

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD producto <br>2. CRUD pedido <br>3. CRUD mesa <br> 4. CRUD cliente <br> 5.CRUD reserva|
|CRUD dependiente|1. CRUD pedido {depende de} CRUD producto <br>2. CRUD pedido {depende de} CRUD cliente|
|Listado<br>+<br>detalle| 1. Listado de prodcutos filtrado por categoría, ordenado por precio <br> 2. Listado de pedidos filtrados por cliente|
|CUU/Epic|1. Reservar una mesa <br>2. Realizar un pedido <br> 3.Calificar la atención/el plato/ etc.|
