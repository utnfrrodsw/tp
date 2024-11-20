# Propuesta TP DSW

## Grupo
### Integrantes
* 49822 - Sesana, Octavio
* 50029 - Di Marco, Martin
* 49373 - Salvía, Camila
* 50026 - Vivas, Martin Ariel

### Repositorios
* frontend: https://github.com/camila-salvia/frontend-tp-dws2024/tree/master
* backend: https://github.com/OctavioSesana/backend

## Tema
### Descripción
Sistema de alquiler de canchas de fútbol de dos tipos: Fútbol 5 y Fútbol 7.

### Modelo

Link Drive: https://drive.google.com/drive/folders/1Spls67U-GuqDTieQFtbJXADwzbpLSfh7


## Alcance Funcional 

### Alcance Mínimo
PROXIMA ENTREGA: se realizará la CRUD Cliente

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Cancha<br>2. CRUD Cliente<br>3. CRUD Reserva|
|CRUD dependiente|1. CRUD Cancha {depende de} CRUD Tipo Cancha<br>2. CRUD Reserva {depende de} CRUD Tipo de cancha|
|Listado<br>+<br>detalle| 1. Listado de canchas disponibles filtrado por tipo de cancha, muestra código y tipo => detalle CRUD Canchas<br> 2. Listado de reservas filtrado por rango de fecha, muestra código de cancha, fecha, y hora de inicio y fin, nombre y dni del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Reservar una cancha para jugar<br>2. Cobrar alquiler de cancha|


