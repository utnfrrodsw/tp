# Propuesta TP DSW

## Grupo
### Integrantes
* 47651 - Gigli, Tomás Malcolm
* 46748 - Catalano, Daniela
* 50734 - Oldani, Marcos Alberto

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
*2 a 6 líneas describiendo el negocio (menos es más)*
* Se desarrollará la aplicación "" para el alquiler de vehículos. Ésta será capaz de registrar usuarios, dichos usuarios podrán realizar reservas para un vehículo. El usuario podrá también ver sus reservas o cancelarlas. El administrador podrá registrar nuevos vehículos, indicando el tipo de vehículo (Mini, Economy, Standard, etc) y su proveedor. Cada vehículo posee un costo por día y se mantiene un histórico de los mismos. Cada reserva podrá tener un descuento aplicado que dependerá de la cantidad de días de la misma. Los coches vienen de un proveedor, los proveedores están registrados y el administrador podrá acceder a sus datos.

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cliente<br>2. CRUD Proveedor<br>3. CRUD Tipo Vehiculo|
|CRUD dependiente|1. CRUD Vehiculo {depende de} CRUD Tipo Vehiculo, CRUD Proveedor<br>2. CRUD Reserva {depende de} CRUD Vehiculo, CRUD Cliente|
|Listado<br>+<br>detalle| 1. Listado de vehiculos filtrado por tipo de vehiculo, muestra datos del vehiculo. => detalle ?<br> 2. Listado de reservas filtrado por descuento aplicado, muestra datos del cliente y del vehiculo ? => detalle ?
|CUU/Epic|1. Reservar un vehiculo<br>2. Ver datos de una reserva|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Reservar un vehiculo<br>2. Ver datos de una reserva|<br>3. Cancelar una reserva|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo. (VER esto)

|Req|Detalle|
|:-|:-|
|Listados |1. "Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes"|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

