# Propuesta TP DSW

## Grupo
### Integrantes
* 51648 - Dowd Lucas
* 50470 - Silpituca Lorenzo
* 51357 - Rodriguez Martiniano

### Repositorios
* [frontend app](https://github.com/Lsilpituca/Front-End.git)
* [backend app](https://github.com/Lsilpituca/Back-End.git)

## Tema
### Descripción
*Sitio virtual, en donde se gestionará el comercio de diversos artículos, y poseerá diversas funciones como poder ver los artículos, tener un carrito de compras, la posibilidad de tener diferentes formas de pago, y el alta, baja y modificación de productos y usuarios

### Modelo
Link de draw.io: https://drive.google.com/file/d/1_P_jPA0Y0_qz-vjOBSoM8SY9cgfIt4Er/view?usp=sharing

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD localidad<br>2. CRUD tipo producto<br>3. CRUD cliente|
|CRUD dependiente|1. CRUD producto {depende de} CRUD tipo producto<br>2. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de producto filtrado por tipo de producto, muestra nro y tipo de producto => detalle CRUD producto<br> 2. Listado de ventas filtrado por rango de fecha, muestra nro de producto, fecha compra => detalle muestra datos completos de la venta|
|CUU/Epic|1. Añadir productos a un carro de compras<br>2. Realizar el pago de una compra|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD tipo producto<br>2. CRUD producto<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD compra<br>6. CRUD forma de pago<br>7. CRUD Cliente|
|CUU/Epic|1. Añadir productos a un carro de compras<br>2. Realizar el pago de una compra<br>3. Realizar autenticación de usuario|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

