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
Desarrollaremos una plataforma de autoservicio para la planificación y organización de eventos, diseñada para simplificar el proceso desde la concepción hasta la ejecución final. Nuestra aplicación permite crear, compartir, buscar y participar en actividades apasionantes y enriquecedoras. Ofrecemos una solución integral que incluye funciones como listados de eventos y seguimiento del estado de cada evento. La plataforma facilita la organización y participación en estas actividades, asegurando una experiencia enriquecedora para todos los involucrados.

### Modelo
Imágen del modelo: [https://drive.google.com/file/d/1wY-0JDNo3SaRp6FMSnI9KMyycjABL7qq/view?usp=sharing](https://drive.google.com/file/d/11yjKW7JyxXlUM4UZs2uSc9BtodrLCimf/view?usp=sharing)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Lugar<br>2. CRUD Persona<br>3. CRUD Evento|
|CRUD dependiente|1. CRUD Evento {depende de} CRUD Persona y Tipo de evento<br>2. CRUD Pedido {depende de} CRUD Persona y evento |
|Listado<br>+<br>detalle| 1. Listado de lugares filtrado por localidad, muestra nombre, direccion y capacidad del lugar => detalle CRUD Lugar<br> 2. Listado de eventos filtrado por rango de fechas, muestra fecha de evento, hora desde, hora hasta, estado y cantidad de invitados|
|CUU/Epic|1. Crear un nuevo evento<br>2. Agregar o sacar invitados|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Lugar<br>2. CRUD Tipo Evento<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Anfitrión<br>6. CRUD Evento<br>|
|CUU/Epic|1. Crear un nuevo evento<br>2. Acceder a eventos<br>3. Cancelar evento|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Nombre y apellido de personas que asisten a un evento <br>2. Eventos pendientes, completados y cancelados filtrados por anfitrion muestra datos del anfitrión y de cada evento: fecha, cantidad de personas que asisten, lugar y estado |
|CUU/Epic|1. Consultar invitados <br>2. Cancelar Evento|
|Otros|1. Envío de recordatorio de reserva por email|

