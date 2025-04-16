# Propuesta TP DSW

## Grupo
### Integrantes
* 52805 - Laveggi, Valentino 
* 53402 - Murúa, Joaquín Tomás
* 52937 - Romero, Gabriel Tobías (Comisión 304)

### Repositorios
* [frontend app](https://github.com/Evenaut7/TP_DSW_FrontendApp.git)
* [backend app](https://github.com/Evenaut7/TP_DSW_BackendApp.git)


## Tema
### Descripción
El modelo de negocio planteado permite a un usuario conocer los puntos de interés de una localidad , actividades disponibles para realizar, su historia y los comentarios de otros usuarios acerca de dicha localidad. 

### Modelo
![image](Modelo_de_dominio-Page-2.png)
/Modelo_de_dominio-Page-2.png

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Localidad <br>2. CRUD Tag<br>
|CRUD dependiente|1. CRUD Usuario {depende de} CRUD ? <br>2. CRUD PuntoInteres{depende de} CRUD Localidad <br> 3. CRUD Evento {depende de} CRUD PuntoInteres|
|Listado<br>+<br>detalle| 1. Listado de Evento para una localidad y un rango de fechas determinado => Detalle muestra nombre del evento, una imagen de la actividad, su nombre, tipo de evento, fecha más próxima y horario.<br>2. Listado de Puntos de interés para una localidad determinada => Detalle muestra una imagen del punto de interés, nombre, y breve descripción|
|CUU/Epic|1. Evento (crear + notificación)<br>2. Valoración|


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

