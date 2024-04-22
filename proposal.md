# Propuesta TP DSW

## Grupo
### Integrantes
46835 - Foix, Gaston.
45892 - Viana, Tomas

### Repositorios
* [frontend app](https://github.com/TomasViana/DSW-Frontend)
* [backend app]((https://github.com/TomasViana/DSW-Backend))
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
La app está orientada a la venta de autos, permite comprar autos, cada auto cuenta con su descripción de características/componentes que trae, ofrece planes de pagos de varios modelos, esta app cuenta con logueo, además permite gestionar el estado de las ventas realizadas (vista admin), mostrar el historial de compras (vista usuario).

### Modelo
[![imagen del modelo]()](https://drive.google.com/drive/folders/1XytVZ18GBPN25elY4XCvuNaCU8McACQT)


## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Auto<br>2. CRUD Plan<br>3. CRUD Localidad|
|CRUD dependiente|1. CRUD Auto {depende de} CRUD Tipo Auto<br>2. CRUD Seguro {depende de} CRUD Auto<br>3. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de autos filtrado por tipo de auto, muestra modelo y tipo de auto => detalle CRUD Auto<br> 2. Listado de compras filtrado fecha; muestra modelo y tipo de auto, y nombre del cliente => detalle muestra datos completos de las compras y del cliente.|
|CUU/Epic|1. Comprar un auto.<br>2. Ver historial de compra|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Auto<br>2. CRUD Plan<br>3. CRUD Localidad<br>4. CRUD Auto<br>5. CRUD Empleado<br>6. CRUD Cliente|
|CUU/Epic|1. Comprar un auto|


### Alcance Adicional Voluntario



|Req|Detalle|
|:-|:-|
|Listados |1. Ventas realizadas online, filtrado por tipo y/o modelo de auto, cliente, fecha<br>2. Planes(pago en cuotas), filtrado por promociones(estado)|
|CUU/Epic|1. Consultar ventas.<br>2. Consumir plan|
|Otros|1. Envío de recordatorio de compra por email|

