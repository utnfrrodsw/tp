## Grupo
### Integrantes
* 52641 - Medón, Mateo
* 53111 - Muzzio, Nicolás

### Repositorios
* [frontend app](https://github.com/Medon10/tp-frontend)
* [backend app](https://github.com/Medon10/tp-backend)

## Tema
### Descripción
La página web tiene como objetivo ayudar a los usuarios a planificar sus vuelos de manera eficiente en torno a un presupuesto disponible, permite a los usuarios ingresar el presupuesto deseado para su vuelo, y el sistema sugiere una variedad de destinos turísticos que se ajustan al presupuesto ingresado con posibilidad de compra.

### Modelo
![image](https://github.com/user-attachments/assets/f651e575-2f68-4349-bbd2-545c82ba28d1)




## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD usuario<br>2. CRUD destino<br> 3. CRUD vuelo <br> 4. CRUD favorito <br>
|CRUD dependiente|1. CRUD Reseva {depende de} CRUD usuario y CRUD Vuelo<br>
|Listado<br>+<br>detalle| 1. Listado de vuelos filtrado por presupuesto, cantidad de personas, fecha de salida, ciudad de origen. Muestra vuelos disponibles con: Destino, valor del vuelo,fecha de salida, duracion del vuelo, actividades, transportes <br> 2. Listado de favoritos, muestra los viajes que el usuario haya guardado en favoritos. <br> 3. Listado de Reservas: muestra los vuelos de las reservas que haya realizado el usuario.
|CUU/Epic|1. Reservar un vuelo<br>|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD usuario<br>2. CRUD destino<br>3. CRUD vuelo.<br> CRUD favorito<br> 4. CRUD reserva <br> 5. CRUD avion <br>
|CUU/Epic|1. Reservar un vuelo<br>2. Pagar el vuelo<br>


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |-|
|CUU/Epic|1.  <br>|
|Otros|1. |
