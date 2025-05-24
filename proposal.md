# Propuesta TP DSW

## Grupo
### Integrantes
* 52950 - Muntaabski, Felipe
* 53471 - Cotorruelo, Valentín
* 53465- Carbó, Santiago
### Repositorios
* [frontend app](https://github.com/FelipeMuntaabski/Frontend)
* [backend app](https://github.com/FelipeMuntaabski/backtend)


## Tema
### Descripción
Teniamos pensado hacer un sistema para gestionar cocheras en una estacionamiento, con perfiles de administrador y usuario. El administrador puede crear cocheras y modificar las tarifas según el tipo de vehiculo (Auto/Moto) y el tipo de servicio (Anual/Mensual/xHora). Se registrará con la patente al vehículo y el tipo en el sistema el cual calculará las tarifas a abonar. Cualquier servicio que sea fijo, se solicitará dni, nombre, etc al cliente.

### Modelo
![imagen del modelo](0a3044bf-9999-4233-bbed-dbce12eb4a0c.jpeg)


## Alcance Funcional 

### Alcance Mínimo



Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Vehiculo<br>2. CRUD Tipo Servicio<br>3. CRUD Cliente|
|CRUD dependiente|1. CRUD Vehículo {depende de} CRUD Tipo Vehículo <br>2. CRUD Servicio {depende de} CRUD Tipo Servicio <br>3.CRUD cochera {depende de} Tipo Vehículo|
|Listado<br>+<br>detalle| 1. Listado de cocheras filtrado por tipo de servicio, estado y tipo de vehículo => detalle CRUD Vehículo<br> 2. Listado de clientes filtrado por fecha hasta el próximo pago de tarifa fija => Muestra tipo de vehículo, patente y tarifa a abonar|
|CUU/Epic|1.Registrar cliente <br>2. Ingresar un vehículo para cochera con tarifa fija|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Vehículo<br>2. CRUD Tipo Servicio<br>3. CRUD Cliente<br>4. CRUD Vehiculo<br>5. CRUD Servicio<br>6. CRUD Cochera<br>7. CRUD PENDIENTE|
|CUU/Epic|1. Registrar Reserva<br>2.Ingresar un vehículo para cochera con tarifa fija <br>3. Registrar reserva temporal|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Reservas filtradas por cliente muestra datos del cliente y datos de su vehiculo y de cada reserva tipo de servicio |
|CUU/Epic|1.Cancelación de reserva <br>2. Añadir cochera |
|Otros|1. Envío de recordatorio de vencimiento de reserva|

