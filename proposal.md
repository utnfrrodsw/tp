
# Propuesta TP DSW

## Grupo
### Integrantes
* 52935 Agustín Dana
* 52933 Luis Parmigiani
* 52986 Juan Bautista Perez
* 52150 Santiago Malet 

### Repositorios
* [fullstack app](https://github.com/Anfibio0010/tpDSW)


## Tema
### Descripción
La idea del Trabajo Practico es hacer una web que permite a la gente contratar servicios para su casa. Estos servicios podrían ser plomeria, gasista, pintor, cerrajero, etc....
Los prestatarios de los servicios van a poder registrarse en la página para indicar que servicios van a brindar.

### Modelo
![ modelo ](https://app.diagrams.net/#G1rKTdFM0r134sMtxcFLbaQx926Cvg2ucL#%7B%22pageId%22%3A%22kqA0DOtl2Mj1x9Ki2wMO%22%7D)  
 

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario <br>2. CRUD TipoServicio <br>3. CRUD Estado de turno |
|CRUD dependiente|1. CRUD Agenda depende Estado de turno<br>2. CRUD Prestatario depende de Tipo de Servicios y Usuario <br> 3. CRUD Reserva depende Prestatario, Cliente y Tipo de Servicio <br> 4. CRUD Cliente depende de Usuario
|Listado<br>+<br>detalle| 1. Listado de prestatario filtrado por tipo de servicios, tarifa, puntuacion y horarios <br> 2. Historial de reservas realizadas para volver a contactar a algun prestatario|
|CUU/Epic|1. Mandar mail de confirmación de reserva tanto al prestatario como al que lo contrata <br>2. Realizar reserva de un servicio con un prestatario|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario <br>2. CRUD Cliente <br>3. CRUD Servicio <br>4. CRUD Estado de turno <br> |
|CRUD dependiente|1. CRUD Agenda depende Estado de turno<br>2. CRUD Prestatario depende de Tipo de Servicios <br> 3. CRUD Reserva depende Prestatario, Cliente y Tipo de Servicio <br> 4. CRUD Reseña depende de reserva 
|Listado<br>+<br>detalle| 1. Listado de prestatario filtrado por tipo de servicios, tarifa, puntuacion y horarios <br> 2. Historial de reservas realizadas para volver a contactar a algun prestatario|
|CUU/Epic|1. Mandar mail de confirmación de reserva tanto al prestatario como al que lo contrata <br>2. Realizar reserva de un servicio con un prestatario <br> 3. Realizar una reseña de una reserva con un Prestatario <br> 4. Mostrar un mapa al prestatario con la localización del cliente|

### Alcance Adicional Voluntario


|Req|Detalle|
|:-|:-|
|Listados |1. Mostrar datos de los prestatarios mejores evaluados <br>|
|CUU/Epic|1. Cancelar reserva realizada <br> |
|Otros|1. Envío de recordatorio de reserva por email <br>2.Implementar planes de suscripción para los prestatarios. <br>3.Guiar al Prestatario via google maps hacia su destino. <br>4.Implementar pagos via billetera virtual entre Clientes y Prestatarios
  |


