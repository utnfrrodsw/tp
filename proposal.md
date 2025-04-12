# Propuesta TP DSW

## Grupo
### Integrantes
* 52242 - Finelli, Constantino
* 51499 - Lier, Lautaro
* 50850 - Acosta, Luciano

### Repositorios
* [frontend app](https://github.com/lucianoacosta23/frontend)
* [backend app](https://github.com/ConstanFinelli/back-dsw)

## Tema
### Descripción
Un dueño de una o más canchas de fútbol se da de alta de sistema siendo habilitado por un administrador dependiendo la legitimidad de la cancha. Una vez sea habilitado, da de alta las canchas disponibles. El usuario se da de alta y consulta los negocios registrados con canchas disponibles y su descripción. El usuario reserva la cancha preferida, abona la seña según indique la empresa. Al finalizar el turno, el resto del precio total será abonado y se le sugiere al usuario realizar una reseña del servicio. 

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD <br>2. CRUD Categoría<br>3. CRUD Localidades|
|CRUD dependiente|1. CRUD Cancha {depende de} CRUD Negocio<br>2. CRUD Negocio {depende de} CRUD Usuario y CRUD Habilitaciones|
|Listado<br>+<br>detalle| 1. Listado de canchas filtrado por características (tamaño, techo, etc) => detalle CRUD Cancha<br> 2. Listado de negocios filtrado por average rating => detalle CRUD Negocio|
|CUU/Epic|1. Reservar una cancha para jugar<br>2. Habilitar negocio|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Negocios<br>3. CRUD Habilitaciones<br>4. CRUD Categorías<br>5. CRUD Canchas<br> 6. CRUD Localidades<br> 7. CRUD Turnos<br> 8. CRUD Dirección|
|CUU/Epic|1. Reservar una cancha<br>2. Habilitar negocio<br>3. Realizar pago de la reserva|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de reservas de un negocio en un rango de tiempo|
|CUU/Epic|1. Aplicar un cupón de descuento para la reserva de una cancha|
|Otros|1. Envío de recordatorio de reserva por email|

