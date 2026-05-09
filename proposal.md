# Propuesta TP Desarrollo de Software

### Integrante
* 51035 - Parisi Ramiro

### Repositorios
* https://github.com/Ramiroparisi/concesionario-front
* https://github.com/Ramiroparisi/Concesionario-Back

## Tema
### Descripción
Software de gestión de una concesionaria de autos que vende vehículos propios, donde los clientes pueden señarlos.

### Modelo
<img width="806" height="631" alt="Concesionaria (3)" src="https://github.com/user-attachments/assets/9810db6e-b773-4192-8e69-0c7578a00324" />


## Alcance Funcional 

### Alcance Mínimo
Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Marca|
|CRUD dependiente|1. CRUD Modelo {depende de} CRUD Marca<br>2. CRUD Vehículo {depende de} CRUD Modelo <br>3. CRUD Reserva {depende de} CRUD Vehiculo|
|Listado<br>+<br>detalle| 1. Listado de vehículos filtrado por marca, modelo, año desde, año hasta, precio desde, precio hasta => detalle CRUD Vehículo <br> |
|CUU/Epic|1. Realizar reserva de auto|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario|
|Listado | 1. Listado de empleados <br> 2. Listado de reservas <br> 3. Listado de ventas <br> 4. Listado de marcas <br> 5. Listado de modelos
|CUU/Epic|1. Login y registro de usuario|


### Alcance Adicional Voluntario


|Req|Detalle|
|:-|:-|
|Otros|1. Integración de Mercado Pago para las reservas <br> 2. Envío de recordatorio de reserva por mail |
