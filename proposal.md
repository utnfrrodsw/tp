# Propuesta TP DSW

## Grupo
### Integrantes
* legajo - Octavio Pereyra
* 47502 - Nicolás Di Dio
* legajo - Tomás Bottoni
* legajo - Franco Duarte

### Repositorios
* [frontend app]([http://hyperlinkToGihubOrGitlab](https://github.com/francoax/dsw-app))
* [backend app]([http://hyperlinkToGihubOrGitlab](https://github.com/francoax/dsw-server))

## Tema
### Descripción
La empresa objeto de nuestro trabajo es una compañía de viajes “Poncho Home & Stay” que quiere desarrollar una página web para ofrecer paquetes a turistas. Los paquetes contienen propiedades y pueden llegar a contener vehículos y asistencia médica

### Modelo
[modelo](https://drive.google.com/file/d/1SagAV5dhIskUnAw3EKalf79zX1fcPGl4/view?usp=sharing)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1.  CRUD User<br>2. CRUD MedicalAssistance<br>3. CRUD Locality|
|CRUD dependiente|1. CRUD Reserve <br>2. CRUD Package <br>3.CRUD Properties<br>4.CRUD Car|
|Listado<br>+<br>detalle| 1. Listado de propiedades filtrado por localidad y/o precio
<br> 2. Listado completo de reservas filtrado por fecha.|
|CUU/Epic|1. Adquirir un paquete|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD User<br>2. CRUD MedicalAssistance<br>3. CRUD Locality<br>4. CRUD Property Type<br>5. CRUD Price|
|CUU/Epic|1. Facturación del paquete|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de vehículos para una propiedad según la ubicación de esta propiedad.|
|CUU/Epic|1. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email <br>2.Mostrar mapas de las ubicaciones|

