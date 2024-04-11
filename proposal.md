# Propuesta TP DSW

## Grupo
### Integrantes
* 42062 - Lautaro Coria
* 47787 - Agustin Pacheco
* 48833 - Leandro Soler

### Repositorios
* [frontend app](https://github.com/aguspach93/frontend)
* [backend app](https://github.com/aguspach93/backend).
## Tema
  Sistema autogestion en supermercado
Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad|
|CRUD dependiente|1. CRUD Habitación {depende de} CRUD Tipo Habitacion<br>2. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de habitaciones filtrado por tipo de habitación, muestra nro y tipo de habitación => detalle CRUD Habitacion<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de habitación, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva|
