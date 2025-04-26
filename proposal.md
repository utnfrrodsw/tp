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

## Tema
### Descripción
*Esta web será diseñada con el objetivo de automatizar e independizar el pedido de turnos para una peluquería (que también ofrece servicios de manicura), mostrando los horarios disponibles, los servicios ofrecidos y sus precios.
Además de esto, se desea gestionar los procesos de pago, haciendo que también sean automáticos; es decir, que puedan realizarse mediante la página sin necesidad de que la dueña del local intervenga.
Como última instancia, también se implementará un sistema de gestión de promociones, las cuales estarán disponibles en un apartado de nuestra página.
*

### Modelo
![Captura de pantalla 2025-04-23 100723](https://github.com/user-attachments/assets/ba9ee26f-d98b-4f8e-b77a-9598b78a62f7)


## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Horario<br>2. CRUD Tipo de servicio<br>3. CRUD Cliente<br>4. CRUD Material|
|CRUD dependiente|1. CRUD Insumo {depende de} CRUD Material<br>2. CRUD Servicio {depende de} CRUD Tipo de servicio<br>3.CRUD Herramienta {depende de} CRUD Material|
|Listado<br>+<br>detalle|1. Listado de turnos filtrado por fecha, muestra nro cliente, horario de inicio y horario de fin => detalle CRUD Servicios<br>2. Listado de servicios por tipo, muestra tipo, codigo, nombre, y descripción => detalle CRUD Servicio|
|CUU/Epic|1.Reservar un turno<br>2. Registrar seña|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Precio<br>2. CRUD Promocion|
|CUU/Epic|3. Modificar turno<br>4. Cancelar turno|


### Alcance Adicional Voluntario


|Req|Detalle|
|:-|:-|
|Listados |1. Listado de materiales por servicio, muestra herramientas e insumos => detalle CRUD Herramientas y CRUD Insumos|
|CUU/Epic|5. Registrar pago|
|Otros| 1. Recordatorio SMS o Mail de reserva de turno|

