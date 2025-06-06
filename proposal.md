# Propuesta TP DSW

## Grupo
### Integrantes
* 53533 - Bonadeo, Juan Cruz
* 52674 - Casermeiro, Gonzalo
* 53543 - De la rosa, Valentin
* 52245 - Krichman, Tomas


### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
CineCritic es una plataforma web donde los usuarios pueden calificar y reseñar películas y series. La idea de la aplicación es ayudar a los usuarios a elegir su próxima película o serie basado en críticas de otros.
La página permitirá buscar por categorías, actores, directores etc. Y se podrá guardar las películas y series como favoritas y/o como ya vistas.

### Modelo
![image](https://github.com/user-attachments/assets/ef1142b5-3436-4a15-8c35-286c825744e2)


## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Pelicula<br>2. CRUD Director<br>3. CRUD Actor<br>4. CRUD Categoria|
|CRUD dependiente|1. CRUD Reseña  CRUD Pelicula <br>2. CRUD Favorito |
|Listado<br>+<br>detalle| 1. Listado de películas filtrado por categoría, o actor, o director<br> 2. Listado de películas favoritas|
|CUU/Epic|1. Reseñar pelicula/serie<br>2. Calificar reseña de otro usuario|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario <br>2. CRUD WatchList <br>3. CRUD <br>4. CRUD <br>5. CRUD <br>6. CRUD <br>7. CRUD |
|CUU/Epic|1. Moderar Resenia <br>2. Agregar Pelicula Con api IMDB <br>3.   |


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.
