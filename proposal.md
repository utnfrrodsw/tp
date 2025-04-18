# Propuesta TP DSW

## Grupo
### Integrantes
* 52533 - Giusti, Santiago.
* 54646 - Faraone, Samuel.
* 45210 - Sandoval, Ezequiel.
* 52218 - Irisarri, Magalí.
### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
*Esta web será diseñada con el objetivo de automatizar e independizar el pedido de turnos para una peluquería (que también ofrece servicios de manicura), mostrando los horarios disponibles, los servicios ofrecidos y sus precios.
Además de esto, se desea gestionar los procesos de pago, haciendo que también sean automáticos; es decir, que puedan realizarse mediante la página sin necesidad de que la dueña del local intervenga.
Como última instancia, también se implementará un sistema de gestión de promociones, las cuales estarán disponibles en un apartado de nuestra página.
*

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Horario<br>2. CRUD Tipo de servicio<br>3. CRUD Cliente<br>4. CRUD Promoción|
|CRUD dependiente|1. CRUD Turno {depende de} CRUD Horario<br>2. CRUD Servicio {depende de} CRUD Tipo de servicio|
|Listado<br>+<br>detalle|1. Listado de turnos filtrado por fecha, muestra nro cliente, horario de inicio y horario de fin => detalle CRUD Servicios<br>2. Listado de servicios por tipo, muestra tipo, codigo, nombre, y descripción => detalle CRUD Servicio|
|CUU/Epic|1. Registrar un horario<br>2. Reservar un turno|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Material<br>2. CRUD Insumo<br>3. CRUD Herramienta<br>4. CRUD Precio<br>5. CRUD Seña<br> |
|CUU/Epic|1. Registrar un horario<br>2. Reservar un turno<br>3. Modificar turno<br>4. Cancelar turno|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de materiales por servicio, muestra herramientas e insumos => detalle CRUD Herramientas y CRUD Insumos|
|CUU/Epic|1. Registrar una Herramienta<br>2. Actualizar Herramienta<br>3. Registrar Insumo<br>4. Actualizar stock Insumo<br>|
|Otros| 1. Recordatorio SMS o Mail de reserva de turno|

