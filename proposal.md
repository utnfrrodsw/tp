# Propuesta TP DSW

## Grupo
### Integrantes
* 47884 - Ramirez, Ignacio - (Com 305)
* 48947 - Sarkissian, Milton - (Com 304)
* 49687 - Dominio, Constanza - (Com 304)

### Repositorios
* [frontend app](https://github.com/Ignacioramirez98/Tp-Dsw-FrontEnd)
* [backend app](https://github.com/Ignacioramirez98/Tp-Dsw-BackEnd)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
*Se pretende crear CRM para una empresa donde *

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cliente<br>2. CRUD Venta<br>3. CRUD Producto|
|CRUD dependiente|1. CRUD Venta {depende de} CRUD Cliente<br>2. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de Clientes, muestra idCliente, nombre, apellido, localidad, mail y telefono  => detalle CRUD Cliente<br> 2. Listado de Ventas filtrado por rango de fecha => detalle muestra datos completos de la Venta|
|CUU/Epic|1. Solicitar un Servicio<br>2. Concretar Venta|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cliente<br>2. CRUD Venta<br>3. CRUD Producto<br>4. CRUD Vendedor<br>5. CRUD Servicio<br>6. CRUD Operario|
|CUU/Epic|1. Solicitar un Servicio<br>2. Concretar Venta<br>3. Realizar facturación de la Venta|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

