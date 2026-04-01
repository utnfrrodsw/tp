{# Propuesta TP DSW

## Grupo
### Integrantes
* 53477 - Fornells, Nuria Belen
* 52812 - Gerbaudo Milena Luz


### Repositorios}
* [monorepoTP] (https://github.com/nuriafornells/monorepoTP.git)
* [frontend app](https://github.com/nuriafornells/monorepoTP/tree/main/FRONTEND_Y_BACKEND_TP/frontend)
* [backend app](https://github.com/nuriafornells/monorepoTP/tree/main/FRONTEND_Y_BACKEND_TP/backend)


## Tema
### Descripción
El proyecto consiste en el desarrollo de una aplicación web full stack para una agencia de viajes. Los usuarios podrán ver distintos paquetes turísticos con sus destinos, precio, detalles de los servicios incluidos, y podrán hacer su reserva para las fechas que seleccionen. La reserva será aceptada o rechazada por un administrador de la pagina. La app también incluirá funciones para que los administradores puedan gestionar los paquetes y destinos (con sus respectivos hoteles) disponibles. 


### Modelo


MD en draw.io: https://drive.google.com/file/d/1fIw_y52k2I7hz1cHX3uEgDLWok7ewhlU/view?usp=sharing
![IMAGEN MD: ](image.png)

## Alcance funcional
### Alcance minimo
# regularidad
| req | Detalles |
|:-|:-|
|CRUD simple| 1. CRUD usuario <br> 2. CRUD reserva|
|CRUD dependiente|CRUD paquete_viaje {depende de} CRUD hotel|
|Listado + detalle| 1. Listado de paquetes de viaje disponibles filtrados por destino, muestra destino (por hotel), precio, descripcion.Detalle hotel, duracion.|
|CUU/Epic|1. Hacer reserva|

# aprobacion:
| req | Detalles |
|:-|:-|
|CRUD |1. CRUD usuario <br> 2. CRUD destino <br> 3. CRUD paquete_viaje <br> 4. CRUD hotel|
|Listado + detalle| 1. Listado de paquetes de viaje disponibles filtrados por destino, muestra destino, precio, descripcion.Detalle muestra fechaInicio, fechaFin y hotel. <br> 2. Listado de reservas a confirmar, muestra datos usuario, estado de reserva,idReserva, cantidad y fecha|
|CUU/Epic| 1. Hacer reserva <br> 2. Confirmar o cancelar reserva <br> 3. Registrarse|




