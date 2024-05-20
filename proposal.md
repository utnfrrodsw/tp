# Propuesta TP DSW

## Grupo
### Integrantes
* 50791 Cardone, Juan Ignacio (COM 301)
* 51004 Donzino, Yamila (COM 303)
* 51632 Tanchi, Candela (COM 303)
* 50925 Variego, Manuel (COM 302)

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](https://github.com/manuvariego/DSW-BackEnd)

## Tema
### Descripción
A raiz de la necesidad de minimizar la cantidad de vehículos que circulan en el microcentro de la ciudad de Rosario buscando una cochera para estacionar, nos vamos a enfocar en realizar una aplicación web que permita reservar un lugar de estacionamiento con anticipación o consultar por lugares libres en cocheras. 

### Modelo
![(https://app.diagrams.net/#G1WzmEB14T3WE1MX64y5hkTwGVi79-o4oO#%7B%22pageId%22%3A%22s9Nc4J8RNfQUfUdQi-DX%22%7D)]

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo estadía<br>2. CRUD Vehículo<br>3. CRUD Localidad<br>4. CRUD Cliente|
|CRUD dependiente|1. CRUD Reserva {depende de} CRUD Tipo Reserva<br>2. CRUD Cochera {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado mensual de reservas filtrado por cochera, muestra el cuit de la cochera, el mes al que corresponde y cantidad de reversas de ese mes, => detalle CRUD Reserva<br> 2. Listado de reservas filtrado por cliente en un rango de fecha, muestra cuit de las cocheras en las que se registró una reserva y datos de dicha reserva => detalle muestra datos completos de la reserva|
|CUU/Epic|1. Reservar estadía<br>2. Registrar usuario|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo estadía<br>2. CRUD Vehículo<br>3. CRUD Localidad<br>4. CRUD Cliente<br>5. CRUD Reserva<br>6. CRUD Lugar<br>7. CRUD Cochera<br> 8. CRUD Tipo vehiculo<br>9. CRUD Cochera-TipoVehiculo<br>|
|CUU/Epic|1. Reservar estadía<br>2. Registrar usuario<br>3. Cancelar reserva<br>4. Realizar pago|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados | 1. Listado mensual de reservas canceladas. |
|CUU/Epic|1. Solicitar servicios|
|Otros|1. Envío de recordatorio de reserva por email|

