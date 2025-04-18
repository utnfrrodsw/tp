# Propuesta TP DSW

## Grupo
### Integrantes
* 46155 - Avila, Marisol
* 39749 - Egea, Lucas
* 52889 - Cisneros, Juan Pablo
* 47868 - Silva, Alejo Lautaro

### Repositorios
* [Frontend App](https://github.com/alejosilvalau/olivenders-frontend)
* [Backend App](https://github.com/alejosilvalau/olivenders-backend)


## Tema
### Descripción
*Olivenders es una plataforma web donde los magos pueden comprar varitas mágicas de manera fácil y segura. Además, les permite a los magos encontrar su varita perfecta mediante un breve cuestionario. Ya sea desde la versión de escritorio o a través del portal móvil, Olivenders te ayuda a encontrar la varita perfecta, sin importar en qué rincón del mundo mágico te encuentres.*


### Modelo
![Diagrama DER](./DER-v4.png)
Ver diagrama en [Draw.io](https://drive.google.com/file/d/1aHBuIdu2SuQJKwL8StDEmREH56euT88r/view?usp=sharing)

**Nota:** la division de las varitas entre *madera* y *núcleo* es dada por la [wiki de Harry Potter](https://harrypotter.fandom.com/es/wiki/Varita)

## Alcance Funcional 
### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Escuela<br>2. CRUD Núcleo<br>3. CRUD Madera<br>4. CRUD Pregunta|
|CRUD dependiente |1. CRUD Mago {depende de} CRUD Escuela<br>2. CRUD Varita {depende de} CRUD Madera y CRUD Núcleo|
|Listado<br>+<br>Detalle | 1. Listado de varitas filtrado por madera, núcleo y precio. Muestra imagen, nombre y precio => Detalle muestra madera, núcleo, longitud, flexibilidad y descripción.<br> 2. Listado de reseñas donde se muestra fecha y comentario de la reseña. Además nombre y descripción de la varita vendida. Al seleccionar la fila se muestra imagen, longitud, flexibilidad, madera y núcleo de la varita.|
|CUU/Epic|1. Vender una varita<br>2. Responder cuestionario|

Adicionales para Aprobación Directa:
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Clave Token<br> 2. CRUD Cuestionario<br> 3. CRUD Venta|
|CUU/Epic |1. Reseñar compra<br>2. Cobrar con MercadoPago|
