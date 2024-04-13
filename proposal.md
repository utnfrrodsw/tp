# Propuesta TP DSW

## Grupo
### Integrantes
* 51638 - Berlanda, Octavio (Comisión 304)
* 50956 - Tourne, Lautaro (Comisión 304)
* 51308 - Tuccori, Renzo (Comisión 302)

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Elegimos desarrollar una plataforma para gestionar la organización de eventos. Nuestra aplicación de planificación y organización de eventos tiene como objetivo simplificar el proceso de planificación y ejecución tanto de eventos sociales como corporativos. Ofreceremos una plataforma integral que abarca todas las etapas del proceso, desde la concepción del evento hasta su realización final, ofreciendo funciones como gestión de invitados, seguimiento de presupuesto, listados de eventos, seguimiento del estado del evento, seguimiento de las tareas necesarias para el evento y selección de proveedores. 

### Modelo
Imágen del modelo: https://drive.google.com/file/d/1wY-0JDNo3SaRp6FMSnI9KMyycjABL7qq/view?usp=sharing

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Lugar<br>2. CRUD Servicio<br>3. CRUD Anfitrión|
|CRUD dependiente|1. CRUD Servicio {depende de} CRUD Tipo Servicio<br>2. CRUD Evento {depende de} CRUD Tipo Evento|
|Listado<br>+<br>detalle| 1. Listado de lugares filtrado por localidad, muestra nombre, direccion y capacidad del lugar => detalle CRUD Lugar<br> 2. Listado de eventos filtrado por rango de fechas, muestra fecha de evento, hora desde, hora hasta, estado y cantidad de invitados|
|CUU/Epic|1. Crear un nuevo evento<br>2. Agregar o sacar invitados|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Lugar<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Anfitrión<br>6. CRUD Evento<br>7. CRUD Tipo Evento|
|CUU/Epic|1. Crear un nuevo evento<br>2. Agregar o sacar invitados<br>3. Cancelar evento|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Nombre y apellido de inviatados a un evento <br>2. Eventos pendientes, completados y cancelados filtrados por anfitrion muestra datos del anfitrión y de cada evento: fecha, cantidad de invitados, lugar y estado |
|CUU/Epic|1. Consultar invitados <br>2. Alquilar servicios<br>3. Cancelar Evento|
|Otros|1. Envío de recordatorio de reserva por email|


