# Propuesta TP DSW

## Grupo
### Integrantes
* 41980 - Valenti, Sofia
* 48318 - Merino, Federico
* 

### Repositorios
* [frontend app](https://github.com/fedemerino/dsw-frontend)
* [backend app](https://github.com/fedemerino/dsw-backend)

## Tema

### Descripción

Aplicación web que permite a propietarios publicar alojamientos para alquiler temporario, y a usuarios consultar disponibilidad, buscar por ubicación o fechas, y realizar reservas de forma directa.

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo de alojamientos<br>2. CRUD Provincias<br>3. CRUD Localidades<br>4. CRUD Usuarios
|CRUD dependiente|1. CRUD Publicaciones {depende de} CRUD Tipo de alojamientos, provincia, ciudad, usuario<br>2. CRUD Reservas {depende de} CRUD Publicaciones<br>3. CRUD Review de alojamientos {depende de} Publicaciones|
|Listado<br>+<br>detalle| 1. Listado de publicaciones filtrado por localidad, fecha y cantidad de huéspedes <br> 2. Listado de alojamientos favoritos (*)
|CUU/Epic|1. Reservar un alojamiento para la estadía<br>2. Cancelar una reserva<br>3. Publicar una propiedad<br>4. Modificar una publicación<br>5. Remover una publicación<br>6. Realizar una consulta sobre una publicación<br>7. Registrar un usuario (*) |


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

