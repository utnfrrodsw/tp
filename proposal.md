# Propuesta TP DSW

## Grupo
### Integrantes
* 52242 - Finelli, Constantino
* 51499 - Lier, Lautaro

### Repositorios
* [frontend app](https://github.com/lucianoacosta23/frontend)
* [backend app](https://github.com/ConstanFinelli/back-dsw)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Un dueño de una o más canchas de fútbol se da de alta de sistema siendo habilitado por un administrador dependiendo la legitimidad de la cancha. Una vez sea habilitado, da de alta las canchas disponibles. El usuario se da de alta y consulta los negocios registrados con canchas disponibles y su descripción. El usuario reserva la cancha preferida, abona la seña según indique la empresa. Al finalizar el turno, el resto del precio total será abonado y se le sugiere al usuario realizar una reseña del servicio. 

### Modelo
![imagen del modelo]([https://github.com/Alberto-ll/TP-DSW-2025-Acosta-Lier-Finelli/blob/main/Modelo%20de%20dominio.jpg](https://github.com/Alberto-ll/TP-DSW-2025-Acosta-Lier-Finelli/blob/main/Modelo%20de%20dominio2.svg))

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad|
|CRUD dependiente|1. CRUD Habitación {depende de} CRUD Tipo Habitacion<br>2. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de habitaciones filtrado por tipo de habitación, muestra nro y tipo de habitación => detalle CRUD Habitacion<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de habitación, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva|


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

