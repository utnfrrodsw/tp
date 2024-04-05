# Propuesta TP DSW

## Grupo
### Integrantes
* 51565 - Bonaroti, Francisco
* 49539 - Salerno, Nicolás
* 50708 - Vacs, Francisco

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Una ticketera virtual, la cual permita gestionar las entradas (codigos QR) para cada evento hosteado. Generando las mismas, para luego poder venderlas y distribuirlas a los consumidores. A su vez mantener un registro de las entradas utilizadas al momento del evento.

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo entrada <br>2. CRUD Usuario<br>3. CRUD Provincia|
|CRUD dependiente|1. CRUD Entrada {depende de} CRUD Tipo entrada <br>2. CRUD Evento {depende de} CRUD Provincia|
|Listado<br>+<br>detalle| 1. Listado de eventos filtrado por provincia, muestra productor, fecha, descripción, dirección => detalle tbd<br> 2. Listado de eventos filtrado por rango de fecha, muestra productor, fecha específica, descripción, dirección => detalle tbd|
|CUU/Epic|1. Crear evento<br>2. Comprar entrada<br>3. Actualizar estado de entrada|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Productor<br>2. CRUD Cliente<br>3. CRUD Comprobante<br>|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

