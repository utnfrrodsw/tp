# Propuesta TP DSW

## Grupo

### Integrantes

- 52935 Agustín Dana
- 52933 Luis Parmigiani
- 52986 Juan Bautista Perez
- 52150 Santiago Malet

### Repositorios

- [fullstack app](https://github.com/Anfibio0010/tpDSW)

## Tema

### Descripción

La idea del Trabajo Practico es hacer una web que permite a la gente contratar servicios para su casa. Estos servicios podrían ser plomeria, gasista, pintor, cerrajero, etc....
Los prestatarios de los servicios van a poder registrarse en la página para indicar que servicios van a brindar.

### Modelo

![ modelo ](DER.png)

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario <br>2. CRUD TipoServicio <br>3. CRUD Estado de turno <br>4.CRUD Zona|
|CRUD dependiente|1. CRUD Agenda depende Estado de turno<br>2. CRUD Prestatario depende de Tipo de Servicios y Usuario <br>
|Listado<br>+<br>detalle| 1. Listado de prestatario filtrado por tipo de servicios, tarifa, puntuacion y horarios <br> 2. Historial de reservas realizadas para volver a contactar a algun prestatario|
|CUU/Epic|1. Realizar una reseña de una reserva con un Prestatario <br>2. Realizar reserva de un servicio con un prestatario|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario <br>2. CRUD Cliente <br>3. CRUD Servicio <br> |
|CRUD dependiente|1. CRUD Agenda depende Estado de turno<br>2. CRUD Prestatario depende de Tipo de Servicios <br> 3. CRUD Reserva depende Prestatario, Cliente y Tipo de Servicio <br> 4. CRUD Reseña depende de reserva
|Listado<br>+<br>detalle| 1. Listado de prestatario filtrado por tipo de servicios, tarifa, puntuacion y horarios <br> 2. Historial de reservas realizadas para volver a contactar a algun prestatario|
|CUU/Epic|1. Mandar mail de recordatorio de reserva tanto al prestatario como al que lo contrata<br> 2. Implementar pagos online (stripe o mercado pago) <br> 3. Implementar moderación de resenas por IA.|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                                        |
| :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Mostrar datos de los prestatarios mejores evaluados <br>                                                                                                                    |
| CUU/Epic | 1. Cancelar reserva realizada <br>                                                                                                                                             |
| Otros    | 1. Envío de recordatorio de reserva por email <br>2.Implementar planes de suscripción para los prestatarios. <br>3.Guiar al Prestatario via google maps hacia su destino. <br> |
|          |
