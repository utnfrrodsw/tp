# Propuesta TP DSW

## Grupo
### Integrantes
* 46627 - Nicolás, García
* 47216 - Mateo, Rindello

### Repositorios
* [frontend app](https://github.com/nicogarcia98/muebleria-frontend)
* [backend app](https://github.com/nicogarcia98/muebleria-backend)

## Tema
### Descripción
Vamos a realizar un sitio de para una mueblería. La propuesta es para ver las ventas de artículos (muebles) de cada vendedor. Cada articulo tiene un tipo de artículo. En la sección ventas se podrá ver los muebles vendidos por cada vendedor y tambien se van a calcular los tipos de artículos más vendidos. Las ventas se identifican con un código, además se registra el cliente y el vendedor que la realizó. Una vez registrada la venta se arma una "entrega" de los articulos de la venta. Las entregas están codificadas y poseen fecha de entrega y direccion de envío.

### Modelo
![imagen del modelo](https://github.com/nicogarcia98/muebleria-frontend/blob/main/diagrams/DER.png)

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Mueble<br>2. CRUD Cliente<br>3. CRUD Vendedor<br>4. CRUD Entrega|
|CRUD dependiente|1. CRUD Mueble depende de CRUD Tipo Mueble<br>2. CRUD Venta depende de CRUD Cliente,Vendedor<br>3. CRUD Venta_Mueble depende de CRUD Venta y Mueble|
|Listado<br>+<br>detalle| 1. Listado de muebles filtrado por tipo de mueble, muestra codigo, descripcion tipo mueble, descripcion mueble, stock => detalle CRUD Mueble<br> 2. Ejemplo: //Listado de ventas filtrado por vendedor, muestra codigo venta, nombre y apellido cliente, fecha entrega, direccion entrega, celda clickeable que abra un pop up mostrando el detalle de los muebles que vendió el vendedor en dicha venta => detalle muestra datos completos de la venta y de la entrega|
|CUU/Epic|1. Registrar una venta.<br>2. Agregar un mueble con su stock|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

