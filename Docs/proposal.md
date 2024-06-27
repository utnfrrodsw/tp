# Propuesta TP DSW

## Grupo
### Integrantes

* Legajo: 49498 - Boscarol Candela
* Legajo: 51541 - Herrera Nicolás
* Legajo: 51441 - Melgarejo Julia
* Legajo: 46338 - Peresin Tomás Ignacio

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Es una organización que se encarga de rescatar perros y gatos en situación de calle y les brinda refugio. Esta además para solventarse tiene una tienda donde todos los ingresos van para las distintas sucursales del refugio, cuentan con traslados para los animales y con veterinarios para curar las enfermedades de los mismos. Nos contactaron para crear un sistema para administrar y registrar los recursos económicos, traslados y visitas al veterinario de los distintos animales rescatados.


### Modelo
https://drive.google.com/file/d/1sh5-fWmd39jOTqkQ5wR_qvaDndrg7uan/view?usp=sharing

## Alcance Funcional 

### Alcance Mínimo
Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Especie<br>2. CRUD Veterinaria<br>3. CRUD persona<br>4. CRUD Zona|
|CRUD dependiente|1. CRUD Animal {depende de} CRUD Tipo Especie<br>2. CRUD Adopcon {depende de} CRUD adoptante|
|Listado<br>+<br>detalle| 1. Listado de rescates filtrados por fechas u zonas, muestra fecha, descripcion y comentarios si los hubiera  => detalle CRUD Rescate<br> 2. Listado de animales filtrados por especie, refugio y estado => CRUD Animal|
|CUU/Epic|1. Adopcion de un animal<br>2. compra de productos|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Adoptante<br>2. CRUD Cliente<br>3. CRUD Rescate<br>4. CRUD Refugio<br>5. CRUD Producto<br>6. CRUD Precio<br>7. CRUD Compra|
|CUU/Epic|1. Rescatar un animal<br>2. Dar asistencia medica a un animal<br>3. Realizar un recuento de stock de productos<br>4. Dar de alta un nuevo producto|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

