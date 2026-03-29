# Propuesta TP DSW

## Grupo
### Integrantes
* 50556 - Gutierrez Ramiro
* 51857 - Nicolás Pedro

### Repositorios
* [frontend app](https://github.com/PedroNicolas14/Repo-DSW-Frontend)
* [backend app](https://github.com/Totym1/Repo-de-DSW)

## Tema
### Descripción
Tienda de indumentaria online, para realizar compras con envío a domicilio en la ciudad de Rosario y alrededores.

### Modelo
https://drive.google.com/file/d/16wx9dorp1LS-VKZn0KN8y0uN5ydn0qPg/view?usp=sharing


## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Categoria <br>2. CRUD Marca<br>3. CRUD Direccion|
|CRUD dependiente|1. CRUD Indumentaria {depende de} CRUD Categoria <br>2. CRUD Envio {depende de} CRUD Direccion <br>3. CRUD Indumentaria {depende de} CRUD Marca|
|Listado<br>+<br>detalle| 1. Listado de indumentaria filtrado por stock => detalle|
|CUU/Epic|1. Realizar un pedido|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Categoria<br>2. CRUD Marca<br>3. CRUD Usuario<br>4. CRUD Indumentaria<br>5. CRUD Envio<br>6. CRUD Localidad<br>7. CRUD Empleado|
|CUU/Epic|1. Realizar un pedido<br>2. Realizar un pago<br>3. Mostar recomendaciones|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

