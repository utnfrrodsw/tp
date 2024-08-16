# Propuesta TP DSW

## Grupo

### Integrantes

- 48615 - Miño, Jeremias
- 49805 - Frias, Josias

### Repositorios

- [frontend app](...)
- [backend app](https://github.com/jeremias4/tp-dsw-2024/tree/dev)

## Tema

### Descripción

Plataforma digital que simule una tienda virtual mediante la cual se puedan vender eventos, comprar entradas a los mismos y hacer control del ingreso a los mismos.

### Modelo

https://excalidraw.com/#room=ec9c537f13bc7465ca39,k6N2wRI6GB18O8f39rdWiQ

## Alcance Funcional

### Alcance Mínimo

_Nota_: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Evento<br>3. CRUD Entrada|
|CRUD dependiente|1. CRUD Entrada {depende de} CRUD Tipo Entrada<br>2. CRUD Usuario {depende de} CRUD Entrada|
|Listado<br>+<br>detalle| 1. Listado de eventos filtrado por tipo de evento, muestra nro y tipo de habitación => detalle CRUD Eventos<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de Entrada, fecha y nombre del usuario => detalle muestra datos completos del evento y del usuario|
|CUU/Epic|1. Comprar un evento siendo usuario<br>2. Vender evento siendo usuario|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Eventos<br>2. CRUD Entradas<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD TipoEntrada<br>6. CRUD TipoUsuario<br>|
|CUU/Epic|1. Comprar un tipo de entrada especifico para un evento<br>2. Vender distintos tipos de entrada para un evento<br>3|

### Alcance Adicional Voluntario

_Nota_: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

| Req      | Detalle                                                                                                                                                                                                                                                                                 |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Eventos del día filtrado por fecha, usuario vendedor, tipo de entradas y precios<br>2. Eventos filtrados por usuario, muestra datos del usuario comprador y de cada reserva de eventos -> estado cantidad de entradas vendidas<br>3. Envio de mail con QR generado por la aplicacion |
| CUU/Epic | 1. Generacion de QR<br>2. Envio de emails                                                                                                                                                                                                                                               |
| Otros    | 1. Envío de recordatorio de eventos por email                                                                                                                                                                                                                                           |
