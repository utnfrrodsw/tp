# Propuesta TP DSW

## Grupo
### Integrantes
* 51070 - Rivero, Tomás

### Repositorios
* [frontend app](https://github.com/tmsrivero/front-SDJ)
* [backend app](https://github.com/tmsrivero/back-SDJ)

## Tema
### Descripción
Sistema para reproducir música en bares o espacios públicos donde el público puede votar en tiempo real cuál será el siguiente tema. Las canciones disponibles provienen de una playlist de Spotify y los usuarios pueden también proponer nuevas canciones, que se agregan a dicha lista para futuras votaciones.

### Modelo
```mermaid
erDiagram
    USUARIO {
      int id PK
      string nombre
      string correo
    }
    SESION {
      int id PK
      datetime hora_inicio
      datetime hora_fin
      string estado
    }
    PLAYLIST {
      int id PK
      string id_spotify
      string nombre
      int sesion_id FK
    }
    CANCION {
      int id PK
      string id_spotify
      string titulo
      string artista
      int duracion
    }
    LISTA_CANCION {
      int lista_id FK
      int cancion_id FK
    }
    PROPUESTA_CANCION {
      int id PK
      int usuario_id FK
      int sesion_id FK
      int cancion_id FK
      string estado
    }
    VOTO {
      int id PK
      int usuario_id FK
      int sesion_id FK
      int cancion_id FK
      datetime fecha_voto
    }
    REPRODUCCION {
      int id PK
      int sesion_id FK
      int cancion_id FK
      datetime fecha_reproduccion
    }

    %% Relaciones principales
    USUARIO ||--o{ PROPUESTA_CANCION : hace
    USUARIO ||--o{ VOTO              : emite
    USUARIO ||--o{ SESION            : crea 

    SESION ||--|| PLAYLIST            : tiene
    SESION ||--o{ PROPUESTA_CANCION   : aloja
    SESION ||--o{ VOTO                : recopila

    PLAYLIST ||--o{ LISTA_CANCION     : contiene
    CANCION  ||--o{ LISTA_CANCION     : aparece_en

    PROPUESTA_CANCION }o--|| CANCION  : sugiere

    VOTO }o--|| CANCION                : por

    REPRODUCCION }o--|| CANCION        : reproduce
    REPRODUCCION }o--|| SESION         : en
```

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Playlist<br>3. CRUD Canción|
|CRUD dependiente|1. CRUD Voto {depende de} Usuario y Canción<br>
|Listado<br>+<br>detalle| 1. Listado de canciones con votos actuales => detalle con nombre, artista, duración<br> 2. Listado de historial de canciones|
|CUU/Epic|1. Votar por una canción<br>2. Reproducir la canción votada|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Playlist<br>3. CRUD Canción<br>4. CRUD Voto<br>5. CRUD PropuestaDeCanción<br>6. Crud Sesión|
|CUU/Epic|1. Crear una sesión<br>2. Votar por una canción<br>3. Proponer canción desde Spotify<br>4. Reproducir automáticamente la canción ganadora en Spotify|


### Alcance Adicional Voluntario
|Req|Detalle|
|:-|:-|
|Listados |1. Ranking de canciones más votadas del día<br>2. Listado de canciones propuestas con preview|
|CUU/Epic|1. Rechazar una propuesta de canción (administrador)|
|Otros|1. Integración con Spotify: agregar automáticamente propuestas aprobadas a la playlist real<br>2. Reproducción automática del tema con más votos usando el reproductor web de Spotify|

