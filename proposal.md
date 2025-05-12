# Propuesta TP DSW

## Grupo
### Integrantes
* 48028 Bertone Valentin
* 47779 Lotar Baigorria
* 48026 Ignacio Di Martino

### Repositorios
* [Backend App](https://github.com/Lotar17/TPbackend)

* [Frontend App](https://github.com/Lotar17/TPFrontend)

*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Representa una plataforma web de compra y venta de productos que se diseñó para facilitar a los usuarios ya sea para solicitar o publicar productos, además es una herramienta util para aquellos empleados de correos para llevar los productos a su destino de forma optima. Nuestra plataforma se esfuerza por brindar una eficiente y efectiva tanto para los solicitantes de productos como para los que proveen dichos productos.

### Modelo
![GAUCHO BUY_DER](https://github.com/user-attachments/assets/9875978c-3739-4939-9712-640011c5ae8a)


*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

##Primer CRUD a desarrollar
1. CRUD Persona

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Persona <br>2. CRUD Producto<br>3. CRUD  Categoria<br>4. CRUD Categoria<br>|
|CRUD dependiente|1. CRUD Historico precio {depende de} CRUD Producto<br>2. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de productos filtrado por descripcion, muestra descripcion y precio => detalle CRUD Producto<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de habitación, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Realizar una compra<br>|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Personas<br>2. CRUD Productos<br>3. CRUD Categoria<br>4. CRUD Localidades<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Realizar compra de un producto a traves de carrito o de forma directa<br>2. Realizar devolucion de item/s de la compra<br>3. Realizar seguimiento de el/los items de una compra


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de compras,ventas, devoluciones comprador, devoluciones vendedor, estados seguimiento asociados al empleado <br>2. Producto filtrados por descripcion<br>3. Compras filtradas por mes, vendedor y no materializadas <br>4.Devoluciones filtradas por estado y codigo devolucion <br>5.Ventas filtradas por mes|

|Otros|1. Comunicacion en una compra via mail, proceso de seguimiento entre empleados via mail, proceso de devolucion entre vendedor y cliente via mail|

