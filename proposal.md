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
|CRUD simple|1. CRUD Usuario <br>2. CRUD TipoServicio <br>3. CRUD Turno <br>4. CRUD Zona|
|CRUD dependiente|1.CRUD Horarios depende de Prestatario <br>2. CRUD Prestatario depende de Tipo de Servicios y de Horarios <br>
|Listado<br>+<br>detalle| 1. Listado de prestatario filtrado por tipo de servicios, tarifa, puntuacion y horarios <br> 2. Historial de reservas realizadas para volver a contactar a algun prestatario|
|CUU/Epic|1. Realizar reserva de un servicio con un prestatario <br> 2. Realizar una reseña de una reserva con un Prestatario|
Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario <br>2. CRUD TipoServicio <br>3. CRUD Turno <br>4.CRUD Zona <br> 5. CRUD Servicio |
|CRUD dependiente|1. CRUD Agenda depende Turno y Horarios <br>2. CRUD Prestatario depende de Tipo de Servicios <br> 3. CRUD Turno depende Servicio <br> 4. CRUD Reseña depende de Turno <br> 5. CRUD Tarea depende de TipoServicio <br> 6. CRUD Horario depende de Prestatario
|Listado<br>+<br>detalle| 1. Listado de prestatario filtrado por tipo de servicios, tarifa, puntuacion y horarios <br> 2. Historial de reservas realizadas para volver a contactar a algun prestatario|
|CUU/Epic|1. Mandar mail de recordatorio de reserva tanto al prestatario como al que lo contrata<br> 2. Implementar pagos online (stripe o mercado pago) <br> 3. Implementar moderación de resenas por IA.|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                                        |
| :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Mostrar datos de los prestatarios mejores evaluados <br>                                                                                                                    |
| CUU/Epic | 1. Cancelar reserva realizada <br>                                                                                                                                             |
| Otros    | 1. Envío de recordatorio de reserva por email <br>2.Implementar planes de suscripción para los prestatarios. <br>3.Guiar al Prestatario via google maps hacia su destino. <br> |
