{# Propuesta TP DSW

## Grupo
### Integrantes
* 53477 - Fornells, Nuria Belen
* 52812 - Gerbaudo Milena Luz


### Repositorios
* [frontend app](https://github.com/nuriafornells/frontendTP.git)
* [backend app](https://github.com/nuriafornells/backendTP.git)


## Tema
### Descripción
El proyecto consiste en el desarrollo de una aplicación web full stack para una agencia de viajes. Los usuarios podrán ver distintos paquetes turísticos con destinos nacionales e internacionales, con su precio, fechas de salida/llegada, y detalles de los servicios incluidos, junto a las formas de contacto disponibles para realizar la reserva o consultas. La app también incluirá funciones para que los administradores puedan gestionar los paquetes disponibles. 


### Modelo
MD: https://drive.google.com/file/d/1fIw_y52k2I7hz1cHX3uEgDLWok7ewhlU/view?usp=sharing 

## Alcance 

CRUD simple	
1. CRUD Paquete_viaje
2. CRUD Reserva
3. CRUD Destino
4. CRUD Hotel
5. CRUD Usuario

CRUD dependiente	
1. CRUD Paquete_viaje dependiente de Destino
2. CRUD Hotel dependiente de Paque_viaje

Listado + detalle	
1. Listado de paquetes d viaje disponibles filtrado por destino o precio, muestra destino, precio, descripcion.Detalle muestra fecha_desde, fecha_hasta, datos_hotel

2. Listado de reservas a confirmar, muestra usuario, estado, idReserva, cantidad, fecha.

CUU/Epic	
CUU 1.1 Seleccionar paquete
CUU 1.2 Consultar viajes reservados
CUU 1.3 Confirmar viaje
CUU 1.4 Ingresar cliente
CUU 1.5 Registrar cliente

Casos de Uso adicionales o de Mantenimiento
CUU 2.1 Gestionar paquetes de viajes(hotel, duracion)
CUU 2.2 Gestionar destinos(destino, paquetes de viaje)


