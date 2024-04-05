# Propuesta TP DSW

## Grupo
### Integrantes
* Foresi, Alejandro
* Pecoraro, Lucio
* Berto, Leandro

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)


## Sistema de gestión de reservas de restaurantes
### Descripción
Los clientes realizan reservas a través del sistema, ingresando su información personal y registrándose en el restaurante.
Una vez registrados, para reservar seleccionan la fecha y hora deseadas y cantidad de personas; se verifica si hay mesas disponibles en el momento solicitado, confirmando o rechazando la reserva.
La administración interna permite gestionar las reservaciones existentes y modificarlas según sea necesario, además de poder registrar la llegada del cliente para evaluar cuantas reservas son incumplidas.

### Modelo
![restaurante-model](https://github.com/chipcasla/tp/assets/103225088/1c4beaa9-14e0-40e0-9a4a-3420bc7a5e6f)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Categoría<br>2. CRUD Cliente<br>3. CRUD Mesa|
|CRUD dependiente|1. CRUD Reserva {depende de} CRUD Mesa y Cliente<br>2.|
|Listado<br>+<br>detalle| 1. Lista de reservas filtrado por dia/rango horario, muestra datos de reserva=> detalles completos de cliente.<br> 2. Listado de mesas filtrado por día/hora y estado, muestra nombre de cliente(si está reservada), capacidad y ubicacion => detalle adicionales como cantidad de personas, hora|
|CUU/Epic|1. Reservar una mesa en el restaurante(cliente)<br>2. Realizar el registro de cumplimiento de una reserva(restaurante)|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cliente<br>2. CRUD Reseña<br>3. CRUD Plato|
|Listados | 1. Listado de calificaciones filtrado por puntaje, muestra titulo y puntaje => detalle adicional del comentario completo|
|CUU/Epic|1. Reservar una mesa en el restaurante<br>2. Realizar el registro de cumplimiento de una reserva<br>3. Realizar reseña de restaurante(cliente)<br>4. Cancelación de reserva|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Promociones |
|Listados | 1. Listado con promociones o descuentos disponibles en un momento dado del restaurantes.<br>2. Listado de menú del restaurante, muestra todos los platos con su descripción breve => detalle adicional de ingredientes, método, imagen.<br>3. Reservas filtradas por cliente muestra datos del cliente y de cada reserva fechas, estado, cantidad de personas|
|CUU/Epic|1. Realizar reserva de evento especial (aniversario,cumpleaños,etc)(cliente)|
|Otros|1. Envío de confirmacion/recordatorio de reserva por email|

