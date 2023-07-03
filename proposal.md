# Propuesta TP DSW

## Grupo
### Integrantes
* 48992 - Genoud, Franco
* 44726 - Manuel, Velasco

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Aplicación web que permite al usuario reservar una habitación de hotel por una estadía determinada, seleccionando que tipo de habitación cumple mejor con sus requisitos, previsualizando imágenes sobre ellas, costos y características; y si por alguna circunstancia debe cancelar, puede hacerlo sin ningún inconveniente

### Modelo
![](https://github.com/ManuelVelasco99/tp/blob/main/MD.jpg)


## Alcance Funcional 

### Alcance Mínimo



Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipos_Habitacion<br>2. CRUD Caracteristicas|
|CRUD dependiente|1. CRUD Habitación {depende de} CRUD Tipo Habitacion|
|Listado<br>+<br>detalle| 1. Listado de habitaciones filtrado por tipo de habitación, muestra nro y tipo de habitación => detalle CRUD Habitacion|
|CUU/Epic|1. Reservar una habitación para la estadía|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Reservas<br>2. CRUD Huéspedes|
|CUU/Epic|1. Cancelar una reserva<br>2. Realizar check-in|


### Alcance Adicional Voluntario


|Req|Detalle|
|:-|:-|
|Listados |2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Formulario de contacto con el hotel<br>2. Landing Page del hotel (información sobre el mismo, dirección y puntos de interés cercanos)|
|Otros|1. Envío de recordatorio de reserva por email<br>2. Notifiación por promociones vía email<br>3. Login con redes sociales<br>3. Mostrar la dirección del hotel con una vinculación al componente de GoogleMaps|

