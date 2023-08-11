# Propuesta TP DSW

## Grupo
### Integrantes
* 50020 - Cravero, Pablo César
* 49485 - Roba Martinez, Manuel
* 50180 - Pérez Fontela, Simón
* 48835 - Soletti, Sol Agustina

### Repositorios
* [frontend app](https://github.com/Neirus2/TP_DSW_FrontEnd)
* [backend app](https://github.com/Neirus2/TP_DSW_BackEnd)

## Tema
### Descripción
_La empresa objeto de estudio es un mayorista de componentes tecnológicos de
computación que funciona como distribuidora nacional. Su director ejecutivo nos encargó
desarrollar un sistema que permita mejorar la organización de stock y venta de sus
productos. También le interesa que el sistema lleve un registro de sus proveedores y
clientes, otorgándoles a estos últimos determinados beneficios dependiendo de su
longevidad en la empresa._

### Modelo
[[imagen del modelo](https://drive.google.com/file/d/1rE7JBDxMoVrunm7Eg7wIwMXfd-HO5HSi/view?usp=drive_link)]

## Alcance Funcional 

El alcance de nuestro negocio abarca procesos de compra, venta y registro de stock de una distribuidora de componentes de computación.

### Alcance Mínimo


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



