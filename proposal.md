# Propuesta TP DSW

## Grupo
### Integrantes
* 51454 - Arfuso, Maria de los Angeles
* 51752 - Maurutto, Francesca
* 50473 - Diodati, Regina
* 50353 - Mansilla, Delfina

### Repositorios
* [frontend app](https://github.com/franmaurutto/frontend_dsw)
* [backend app](https://github.com/franmaurutto/backend_dsw)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
El sistema a desarrollar consiste en la presentación de cursos online orientados al desarrollo de sistemas de información que permite el inicio de sesión y el registro de usuarios. Los usuarios podrán inscribirse a un curso mediante formularios y un profesor podrá postularse a dar clases virtuales en el curso. Los cursos tendrán un parcial y un trabajo práctico que deberán ser aprobados para poder conseguir la certificación del curso.

### Modelo
![imagen del modelo]()
https://drive.google.com/drive/folders/17aejEDyp7ZbN4p7J21DdS0g-YX2c3g3c?usp=sharing
*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

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

