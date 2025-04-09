# TPDSW-COM304--Carloni-GomezManna-Chacon-Mierez-2025
# Propuesta TP DSW

## Grupo
### Integrantes
* 47791 - Gomez Manna, Joaquina Esperanza
* 51095 - Carloni, Nahuel Iván
* 50980 - Chacón, Agustina Celeste
* 49938 - Joaquín Mierez

## Tema
### Descripción
El sistema permitirá a los usuarios ingresar a la página web y observar diferentes reseñas de libros junto con recomendaciones categorizadas por géneros. Los usuarios podrán agregar reseñas con calificación (1-5 estrellas) y comentario, marcar libros como favoritos y guardarlos en su lista personal.

### Modelo

[Modelo de Dominio](https://drive.google.com/file/d/19oo2OMIBkmHHlL8IWxTLiJujF6Z2ven8/view?usp=sharing)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD de Usuarios<br>2. CRUD de Libros<br>3. CRUD de Categorías<br>4. CRUD de Autores|
|CRUD dependiente|1. Libro depende de la Categoría<br>2. Libro depende del Autor|
|Listado + Detalle|1. Ingresando una categoría, se muestra un listado de libros coincidentes<br>2. Filtrado de libros por mayor cantidad de estrellas|
|CUU/Epic|1. Marcado de Libros como “Leído”<br>2. Marcado de Libros como “Ver más tarde”<br>3. Un usuario puede mover un libro de "Pendientes" a "Leído" cuando lo termine|

### Adicionales para Aprobación

|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD completo de todos los elementos|
|CRUD dependiente |1. Todas las relaciones establecidas|
|CUU/Epic|1. Reseñas con Comentarios<br>2. Reacciones a Reseñas<br>3. Listado de Libros por Género<br>4. Búsqueda de Libros por Autor|
|Relaciones|1. Las reseñas populares pueden mostrarse primero en el listado<br>2. Ambas opciones permiten buscar libros fácilmente en la plataforma|

### Clases

#### Usuario
- Nombre
- Apellido
- IdUsuario
- Mail
- Teléfono
- Tipo

#### Reseña
- Nombre
- IdReseña
- FechaReseña

#### Categoría
- Nombre
- idCategoria

#### Libro
- Nombre
- IdLibro
- Sinopsis

#### Favoritos
- idLibro
- IdAutor

#### Autor
- Nombre
- Apellido
- IdAutor
