# Propuesta TP DSW

## Grupo gestor de ventas online para un supermercado
### Integrantes
* 53566 - Corsalini, ignacio
* 52365 - Echeveste, Luciana
* 52216 - Ramos, Tomás 
### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
*Este sistema está diseñado para optimizar la gestión de ventas en supermercados, permitiendo a los usuarios registrarse y realizar compras desde la comodidad de su hogar. Además, cada cliente puede ser asignado a un distribuidor específico, mejorando así la eficiencia en la entrega y la organización interna del negocio.*

### Modelo
![Tp_DesarrolloFinal](https://github.com/user-attachments/assets/a8636253-781b-4743-8e0c-c12c355a5b5c)


## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cliente<br>2. CRUD Categoría<br>3. CRUD Zona|
|CRUD dependiente|1. CRUD Distribuidor  {depende de zona} <br>2. CRUD Artículo {depende de categoría} |
|Listado<br>+<br>detalle| 1. Listado de productos filtrados por categoría <br> 2. Listado de ventas filtrado por precio|
|CUU/Epic|1. Realizar pedido<br>2. Gestionar stock|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cliente<br>2. CRUD Artículo<br>3. CRUD Categoría<br>4. CRUD Zona<br>5. CRUD Distribuidor<br>6. CRUD Pedido
|CUU/Epic|1. Realizar pedido<br>2. Gestionar stock<br>3. Realizar o cancelar pago|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. listado articulos sin stock|
|CUU/Epic|1. Cancelar venta|
|Otros|1. Enviar email de pedido enviado|

