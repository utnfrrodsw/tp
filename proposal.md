# Propuesta TP DSW

## Grupo
### Integrantes
* 47350 - Brian Nahuel Ortigosa
* 51634 - Herrera y Morejon, Juan Francisco


### Repositorios
* https://github.com/Dragtrop/Repositorio-TP-Backend 

## Tema
### Descripción
Sistema en el que mediante una app se muestran las cocheras disponibles en una localidad y da la posibilidad de filtrar las cocher por los
servicios extras que estas incluyen y por el tipo de vehículo, con un sistema de reseñas incluido en la app. Dando la opción a registrar
nuevas cocheras a los usuarios permitidos



### Modelo
[![Esquema-TP-DSW-drawio.png](https://i.postimg.cc/ncDr08nJ/Esquema-TP-DSW-drawio.png)](https://postimg.cc/1fyy3jgC)


## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Vehículos<br>2. CRUD Tipo vehiculos<br>3. CRUD Localidad|
|CRUD dependiente|1. CRUD vehículo {depende de} CRUD tipo vehículo<br>|
|Listado<br>+<br>detalle| 1. Listado de cocheras filtrado por localidad, tipo de vehículo, tipo de servicio.<br>|
|CUU/Epic|1. Alquilar cochera<br>|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cochera<br>2. CRUD Localidad<br>3. CRUD Usuario<br>4. CRUD Vehículo<br>5. CRUD Tipo Vehículo<br>6. CRUD Servicio<br>|
|CUU/Epic|1. Alquilar cochera<br>2. Dar de baja cochera<br>|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1.Listado de cocheras alquiladas para un usuario por un año|
|CUU/Epic|1. Informar ganancias anuales|
|Otros|1. Loguear usuario|

