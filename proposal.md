# Propuesta TP DSW

## Grupo
### Integrantes
* 47814, Peinado Victoria
* 49856, Del Solar Marcos
* 49491, Brancatti Lautaro

### Repositorios
* [fullstack app](https://github.com/victoria-peinado/Desarrollo-Gesti-n-de-Publicidad)

## Tema
### Descripción
La organización objeto de nuestro trabajo es una emisora de radio FM. Su equipo directivo nos encargó desarrollar un sistema que permita agilizar la gestión de publicidades de la misma. 


### Modelo
![](https://github.com/victoria-peinado/Desarrollo-Gesti-n-de-Publicidad/blob/main/Documentacion/model.jpeg)


## Alcance Funcional 

### Alcance Mínimo 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1.CRUD Contacto  <br>2. CRUD Titular Facturacción<br>3. CRUD Contratación<br> 4.CRUD Spot Publicitario <br>5.CRUD Bloque|
|CRUD dependiente|1. CRUD Comercio {depende de} CRUD Contacto y CRUD Titular Facturación<br>2. CRUD Orden publicitaria {depende de} CRUD Contratación <br>3. Historial Precio {depende de} CRUD Bloque|
|Listado<br>+<br>detalle| 1. Listado de publicidades filtrado por fecha desde a fecha hasta, muestra nroBloque(Bloque), nombreCampaña(Orden Publicitaria), horaInicio(Bloque) y fecha(Relacion) <br> 2. Listar para una contratacion todas las ordenes publicitarias|
|CUU/Epic|1. Realizar una contratación<br>2. Realizar Orden_Publicitaria|


//Cuando se diagrame nuevamente se eliminara la clase Dia



