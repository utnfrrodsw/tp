# Propuesta TP DSW

## Grupo
### Integrantes
* 52133 - Alfieri, Agustín
* 51871 - Toloza, Laureano Yoel
* 52726 - Garrido, Alejo
* 51086 - Santos, Juan Pablo

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
Sistema de gestión de turnos de un consultorio médico.
### Descripción
La solución web permitirá la gestión de turnos de un consultorio medico, con profesionales de diversas especialidades. Incluyendo la gestión de los profesionales, las especialidades, los horarios de consulta, prácticas médicas y cobertura por parte de las obras sociales. Contará con distintos perfiles de usuario para los pacientes, médicos, administrativos y cargos gerenciales, con los permisos correspondientes.


### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Especialidad médica<br>2. CRUD Obra social<br>3. CRUD Profesional<br>4. CRUD Paciente|
|CRUD dependiente|1. CRUD Práctica {depende de} CRUD Especialidad médica<br>2. CRUD Turno {depende de}  CRUD Profesional/CRUD Paciente/CRUD Práctica<br>3.CRUD Estado turno {depende de} CRUD turno|
|Listado<br>+<br>detalle| 1. Listado de turnos realizados filtrado por rango de fechas, muestra fecha del turno, profesional y práctica => detalle CRUD Turno<br> 2. Listado de pacientes que poseen un turno |
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |5. CRUD Administrativo<br>CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

