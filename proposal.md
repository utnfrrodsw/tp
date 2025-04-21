# Propuesta TP DSW

## Grupo
### Integrantes
* 47216 - Rindello, Mateo Miguel
* 47539 - Riquelme, Patricio
* 43833 - Romagnoli, Julieta
* 42704 - Ariati Servio, Juan Cruz

### Repositorios
* [frontend app](https://github.com/mateorindello1/DSW2025-TPI-FE)
* [backend app](https://github.com/mateorindello1/DSW2025-TPI-BE)

## Tema
### Descripción
Este sistema modela el funcionamiento de una plataforma de alquileres temporarios de propiedades, similar a servicios como Airbnb, donde usuarios pueden reservar estancias en propiedades ofrecidas por anfitriones particulares. La plataforma se encarga de gestionar la disponibilidad, reservas, pagos y valoraciones tanto de los huéspedes como de los anfitriones.

### Modelo

[Link de draw.io](https://drive.google.com/file/d/1FgWUKIjy_D_iMDXbeRd3oQTgtm5AbhMP/view?usp=sharing)

![imagen del modelo](https://github.com/Patricionrp/tp-dsw-2025/blob/main/AlquileresTemporarios.drawio%20(1).png)



## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

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

