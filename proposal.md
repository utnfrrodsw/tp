## Grupo
### Integrantes
* 52641 - Medón, Mateo
* 53111 - Muzzio, Nicolás

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)

## Tema
### Descripción
La página web tiene como objetivo ayudar a los usuarios a planificar sus vacaciones de manera eficiente en torno a un presupuesto disponible, permite a los usuarios ingresar el presupuesto disponible para sus vacaciones, y el sistema sugiere una variedad de destinos turísticos que se ajustan al presupuesto ingresado con posibilidad de compra.

### Modelo
![image](https://github.com/user-attachments/assets/ab1d4596-0dc8-46fb-8fb6-cb8f3f3b573b)



## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD usuario<br>2. CRUD destino<br>
|CRUD dependiente|1. CRUD viaje {depende de} CRUD usuario y CRUD destino<br>
|Listado<br>+<br>detalle| 1. Listado de viajes filtrado por presupuesto, cantidad de personas, nro de días. Muestra lugar, valor de vuelo, hospedaje, actividades <br> 2. Listado de favoritos, muestra los viajes que el usuario haya guardado en favoritos.
|CUU/Epic|1. venta<br>|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD usuario<br>2. CRUD destino<br>3. CRUD viaje.<br> CRUD Provincia<br>
|CUU/Epic|1. venta<br>2. pago<br>


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Gestionar usuario<br>|
|Otros|1. notificacion de descuento|
