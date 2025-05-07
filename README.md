# TPDSW-COM304--Carloni-GomezManna-Chacon-Mierez-2025
# Propuesta TP DSW

## Grupo
### Integrantes
* 47791 - Gomez Manna, Joaquina Esperanza
* 51095 - Carloni, Nahuel Iván
* 50980 - Chacón, Agustina Celeste (com 301)
* 49938 - Mierez, Joaquín 

## Tema
### Descripción
El sistema permitirá a los usuarios ingresar a la página web y observar diferentes reseñas de libros junto con recomendaciones categorizadas por géneros. Los usuarios podrán agregar reseñas con calificación (1-5 estrellas) y comentario, marcar libros como favoritos y guardarlos en su lista personal.

### Modelo

[Modelo de Dominio](https://drive.google.com/file/d/10CZM5P55DNUaeEiIdEiqubp5iLLYt8Ha/view?usp=sharing)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD de Usuario<br>2. CRUD de Editorial<br>3. CRUD de Categoría<br>4. CRUD de Autor|
|CRUD dependiente|1. Libro depende del Autor<br>2. Las Sagas dependen de los Libros.|
|Listado + Detalle|1. Ingresando una categoría, se muestra un listado de libros coincidentes<br>2. Filtrado de libros por mayor cantidad de estrellas|
|CUU/Epic|1. Listas de "Leído", "Ver más tarde", "Pendientes".<br>2. Reseñas de los Libros.|

### Adicionales para Aprobación

|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD completo de todos los elementos|
|CRUD dependiente |1. Todas las relaciones establecidas|
|CUU/Epic|1. Implementar un sistema automático para revisar y moderar reseñas de usuarios usando alguna librería especifica.<br>2. Permitir a los usuarios reaccionar a reseñas (ej. likes)<br>3. Mostrar recomendaciones personalizadas<br>4. Implementar la funcionalidad de "seguir" para que los usuarios puedan seguir a otros y ver sus actividades o reseñas.|

### Clases

#### Usuario
- Nombre
- Apellido
- IdUsuario
- Mail
- Teléfono
- Tipo

#### Reseña
- IdReseña
- FechaReseña
- Reaccion[0..1]

#### Categoría
- Nombre
- idCategoria

#### Libro
- Nombre
- IdLibro
- Sinopsis

#### Favoritos
- IdAutor
- FechaAgregado


#### Autor
- Nombre
- ApellidoAutor
- IdAutor

#### Autor
- NombreLista
- UltimaFechaModificacion

 #### ContenidoLista
 - IdLibro
 - NombreLibro

#### Saga
- IdSaga
- NombreSaga

#### Editorial
- IdEditorial
- NombreEditorial
- Idioma
