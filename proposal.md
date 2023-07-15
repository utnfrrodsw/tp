# Propuesta TP DSW

## Grupo
### Integrantes
* Martin Lambrecht <martinoscarlambrecht@gmail.com> 47860
* Franco Giangiordano <frangiangiordano@gmail.com> 46802
* Gonzalo Turconi <gonzaturconi@gmail.com> 46730

### Repositorios
* [frontend app](https://github.com/franGiangiordano/TTADS-Frontend.git)
* [backend app](https://github.com/franGiangiordano/TTADS-Backend.git)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
*GFM Logistics es una empresa líder en el sector de la logística y el transporte de mercancías por carretera. Al ser su principal activo los camiones, una flota moderna y diversa que cumple con los más altos estándares de calidad y seguridad, resulta de gran utilidad un sistema de gestión para su flota, que permita automatizar la carga de datos sobre sus vehículos, choferes y viajes, su presentación sin dejar de lado la seguridad de sus datos y accesos.*

### Modelo
![Imagen del Modelo](https://i.postimg.cc/DwjvFtB3/MD.png)

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Batea<br>2. CRUD Acoplado<br>3. CRUD Chofer|
|CRUD dependiente|1. CRUD Equipo (Depende de CRUD Batea, Acoplado y Chofer)<br>2. CRUD de gastos de viaje depende de Viaje|
|Listado<br>+<br>detalle| 1. Listado de Equipos a la fecha<br> 2. Listado de Choferes a la fecha<br> 3. Viajes con filtro por equipo, chofer y tiempo<br> 4 Generar planilla con viajes por chofer en el mes|
|CUU/Epic|1. Viaje (registrar/definir lo relativo al viaje)<br>2. Reparaciones/Mantenimiento|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario|
|CUU/Epic|Aplicar geolocalización y mapas al sistema|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

