# Propuesta TP DSW

## Grupo
### Integrantes
* 50791 Cardone, Juan Ignacio (COM 301)
* 51004 Donzino, Yamila (COM 303)
* 51632 Tanchi, Candela (COM 303)
* 50925 Variego, Manuel (COM 302)

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
A raiz de la necesidad de sintetizar la cantidad de vehículos que circulan en el microcentro de la ciudad buscando una cochera para estacionar, nos vamos a enfocar en realizar una aplicación web que permita realizar reserva previa de lugar de estacionamiento. 

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Reserva<br>2. CRUD Vehículo<br>3. CRUD Localidad<br>4. CRUD Cliente|
|CRUD dependiente|1. CRUD Reserva {depende de} CRUD Tipo Reserva<br>2. CRUD Cochera {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado mensual de reservas filtrado por cochera, muestra datos de la cochera y cantidad de reversas, => detalle CRUD Reserva<br> 2. Listado de reservas filtrado por cliente y rango de fecha, muestra cuit cochera, datos de la reserva => detalle muestra datos completos de la reserva|
|CUU/Epic|1. Reservar estadía<br>2. Registrar usuario|


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

