# Propuesta TP DSW

## Grupo
### Integrantes
* 52950 - Muntaabski, Felipe
* 53471 - Cotorruelo, Valentín
* 53465- Carbó, Santiago
### Repositorios
* [Link Monorepo](https://github.com/SantiagoCarboUTN/fullstack-repo-dsw)


## Tema
### Descripción
Teniamos pensado hacer un sistema para gestionar cocheras en una estacionamiento, con perfiles de administrador y usuario. El administrador puede crear cocheras y modificar las tarifas según el tipo de vehiculo (Auto/Moto) y el tipo de servicio (Anual/Mensual/Trimestral). Se registrará con la patente al vehículo y el tipo en el sistema el cual calculará las tarifas a abonar. Cualquier servicio que sea fijo, se solicitará dni, nombre, etc al cliente.

### Modelo
![imagen del modelo](DERcocheraDSW.drawio%20(1).png)


## Alcance Funcional 

### Alcance Mínimo



Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Vehiculo<br>2. CRUD Tipo Servicio<br>3. CRUD Cliente|
|CRUD dependiente|1. CRUD Vehículo {depende de} CRUD Tipo Vehículo <br>2. CRUD Reserva {depende de} CRUD Tipo Servicio <br>3.CRUD Cochera {depende de} Tipo Vehículo|
|Listado<br>+<br>detalle| 1. Listado de cocheras filtrado por estado => detalle CRUD Vehículo<br> 2.Listado de reservas filtradas por vehiculo muestra patente del vehiculo  y datos de cada reserva |
|CUU/Epic|1.Registrar cliente <br>2. Pagar Cuota de reserva|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Vehículo<br>2. CRUD Tipo Servicio<br>3. CRUD Cliente<br>4. CRUD Vehiculo<br>5. CRUD Reserva<br>6. CRUD Cochera<br>7. CRUD Cuota| 
|CUU/Epic|1. Registrar Reserva<br>2.Ingresar un vehículo para cliente <br>3. Crear cochera para nuevo tipo de vehiculo|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de clientes filtrado por nombre => Muestra nombre, email,dni,telefono del cliente |
|CUU/Epic|1.Cancelación de reserva <br>
|Otros|1. Envío de recordatorio de vencimiento de reserva|

