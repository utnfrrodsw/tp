# Propuesta TP DSW

## Grupo
### Integrantes
* 47999 - Paolini, Alessandro
* 47844 - Vivas, Facundo Ignacio
* 47800 - Guerra, Bautista

### Repositorios
* [fullstack app](https://github.com/AlessandroPaolini7/TTADS-2023.git)


## Aplicación de streaming de música
### Descripción
El negocio de esta aplicación de streaming de música se centra en ofrecer a los usuarios una plataforma para descubrir, reproducir y gestionar música de forma conveniente y personalizada. La aplicación permite a los usuarios registrarse y acceder a una amplia biblioteca de canciones de diversos géneros y artistas. Los usuarios pueden crear y administrar listas de reproducción personalizadas, así como explorar recomendaciones basadas en su lista de favoritos.

### Modelo

```mermaid
classDiagram
Usuario "1" -- "*" Playlist: 
Playlist *-- Cancion
Cancion "0..*" -- "1..*" Artista
Artista "1" --  "0..*" Album
Album *-- Cancion 
Usuario "1" -- "0..*" Recomendacion
Recomendacion "0..*" -- "1..*" Cancion 
Recomendacion "0..*" -- "1" Playlist 
Usuario "1" -- "1" Favoritos
Favoritos "0..*" -- "1" Cancion
Usuario : str nombre
Usuario : str email
Usuario : str password
Usuario : str telefono
Playlist: str titulo
Playlist: str descripcion
Playlist: date fecha_creacion
Playlist: link portada
Cancion: str titulo
Cancion: int anio_lanzamiento
Cancion: str genero
Cancion: float duracion
Cancion: link audio
Artista: str nombre
Artista: str nacionalidad
Artista: int nro_seguidores
Artista: link portada
Album: str titulo
Album: link portada
Recomendacion: date fecha_recomendacion
Favoritos: date fecha_favorito
```   

## Alcance Funcional 

### Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Artista<br>|
|CRUD dependiente|1. CRUD Playlist<br>2. CRUD Cancion<br>3. CRUD Album<br>|
|Listado<br>+<br>detalle| 1. Listado de Canciones filtradas por título, género y artista => detalle completo de la canción<br> 2. Listado de playlists filtradas por aquellas creadas por el usuario => detalle completo de la playlist + detalle canciones|
|CUU/Epic|1. Crear una nueva playlist<br>2. Agregar una canción a playlist existente|

### Aprobación:
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Playlist<br>3. CRUD Cancion<br>4. CRUD Artista<br>5. CRUD Album<br>6. CRUD Favoritos<br>7. CRUD Recomendacion|
|CUU/Epic|1. Modificar la lista de favoritos<br>2. Realizar una recomendación basada en la lista de favoritos del usuario|

### Alcance Adicional Voluntario:
|Req|Detalle|
|:-|:-|
|Listados | Listado de las 10 canciones más similares a los favoritos del usuario |
|CUU/Epic| 1. Implementar perfiles de usuario<br>2. Restringir las acciones según los perfiles de usuario |
