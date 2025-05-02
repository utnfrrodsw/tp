# Propuesta TP DSW

### Integrantes
* 44123-Milanesi Renzo
* 46291-Gamba Emiliano Francisco


### Repositorios
*  [FRONTEND app](https://github.com/gitgamba/DSW-302-FRONTEND)
* [BACKEND app](https://github.com/gitgamba/DSW-302-BACKEND)

## Tema
### Descripción
Vamos a crear un Sistema de Gestion Web que va a permitir administrar una agenda de operadores de una empresa de hospedaje.
Las funcionalidades que van a tener son conectarse a aplicaciones como booking o airbnb para obtener datos de las reservas y luego armar una agenda de check-ins y check-outs. Definir usuarios y roles para los distintos operadores.


### Modelo

![Imgur](https://imgur.com/3ZKWwuJ)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD usuario<br>2. CRUD tipo de usuario|
|CRUD dependiente|1-CRUD Movimientos que depende de CRUD Usuario|
|Listado<br>+<br>detalle| 1-Listado de reservas, filtrado por fecha, departamento y usuario asignado => detalle CRUD<br>2-Listado de hoja de ruta por usuario|
|CUU/Epic|1-Generar agenda por usuario<br>2-Emitir notificaciones a los responsables de las reservas|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Huesped<br>2. CRUD inmueble<br>3. CRUD Movimientos<br>4. CRUD Notificacion que depende de CRUD Movimiento<br>5. CRUD Reserva depende de CRUD inmueble y crud huesped|
|CUU/Epic|1-Generar agenda de check-in y check-out<br>2-Asignar usuarios a distintas reservar (puede darse el caso de un usuario no pueda ir a hacer check.in y deba asignarse otro)<br>3-Notificar al usuario los datos del chech-in check-out|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1-Resumen mensual (Inmuebles mas alquilados, promedio de duracion de reservas)<br>2-Listado de reservas por inmueble o usuario|
|CUU/Epic||
|Otros|1-Incluir permisos por usuario o tipos de usuario|
