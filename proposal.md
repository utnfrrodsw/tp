# Propuesta TP DSW

## Grupo
### Integrantes
Montini Agostino 50757
Azul Gomez 48107
Collaud Maria Victoria 51766
Decima Ivan 48624

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
Sistema de gestion de prestamos de biblioteca
### Descripción
Es un sistema para gestionar los prestamos de una biblioteca, abarca el Alta y baja de socios, categorias, libros, editoriales, autores. 
El sistema (con alcance de regularidad) esta pensado para ser usado solo por el bibliotecario, el socio no interactua con el sistema.
Por ello no se hace uso de un usuario y contraseña. El sistema con alcance de AD puede contar con un FrontEnd en el que los socios puedan realizar consultas(prestamos,sanciones, libros disponibles).

### Modelo
https://imgur.com/gB6MXtc

Nota: Todavia resta determinar atributos de informacion para editorial y autor, al lado del modelo hay aclaraciones en base a reglas de negocio inventadas.
El sistema podria complejizarse agregando o modificando reglas de negocio.

## Alcance Funcional 

### Alcance Mínimo

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Categoria<br>2. CRUD Editorial<br>3. CRUD Autor<br>4.CRUD Socio|
|CRUD dependiente|1. CRUD Prestamo {depende de} CRUD Libro y CRUD Socio<br>2. CRUD Libro {depende de} CRUD Editorial, CRUD Categoria y CRUD Autor|
|Listado<br>+<br>detalle| 1. Listado de prestamos filtrado por libro(codigo).<br> 2. Listado de libros filtrado por autor|
|CUU/Epic|1. Realizar un prestamo.<br>2. Realizar la devolucion de un prestamo|

Nota: Obligatoriamente hay que hacer el CRUD de la clase PoliticasBiblioteca.


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

