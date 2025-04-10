# Propuesta TP DSW

## Grupo

### Integrantes

- 49676 Mercanzini Gian Marco
- 50337 Certo José Emilio
- 50422 Augusto Lescano

### Repositorios

- [frontend app](https://github.com/Augusto-Lescano/frontend-dsw)
- [backend app](https://github.com/Augusto-Lescano/backend-dsw)

## Tema

### Descripción

Crear una plataforma donde los usuarios puedan llevar un registro de los videojuegos que han jugado, están jugando o desean jugar, con la posibilidad de calificarlos, reseñarlos y organizarlos en listas. El sistema también permite ver reseñas de otros usuarios y explorar juegos populares.

### Modelo

![Image](https://github.com/user-attachments/assets/77be59b4-531e-41ca-98a3-7da8b60881b8)

## Alcance Funcional

### Alcance Mínimo

_Nota_: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Juego<br>2. CRUD Usurio<br>3. CRUD Administrador|
|CRUD dependiente|1. CRUD Reseña {depende de} CRUD Usuario<br>2. CRUD Moderador {depende de} CRUD Administrador|
|Listado<br>+<br>detalle| 1. Listado de juegos filtrado por género, nombre y descripción => detalle CRUD Juegos<br> 2. Listado de reseñas filtrado por rango de fecha y juego => detalle muestra datos del usuario que hizo la reseña y el contenido de la reseña|
|CUU/Epic|1. Usuario realiza reseña<br>2. Moderador edita juego|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Juego<br>2. CRUD Usurio<br>3. Administrador<br>4. CRUD Reseña<br>5. CRUD Moderador<br>6. CRUD Comentario<br>7. CRUD Categoria|
|CUU/Epic|1. Usuario realiza reseña<br>2. Moderador edita juego<br>3. Usuario realiza comentario en una reseña|
