# CRITIO

## Grupo
### Integrantes
* 53533 - Bonadeo, Juan Cruz
* 52674 - Casermeiro, Gonzalo
* 53543 - De la rosa, Valentin
* 52245 - Krichman, Tomas


### Repositorios
* [Frontend app](https://github.com/JuanBonadeo/FrontEnd-TPDSW)
* [Backend app](https://github.com/JuanBonadeo/Backend-TPDSW)

### Deploy en vercel
* [Critio](https://critio.vercel.app)

## Tema
### Descripción
Critio es una plataforma web donde las personas pueden registrarse para calificar y reseñar películas. La idea de la aplicación es ayudar a los usuarios a elegir su próxima película basandose en críticas de otros. 
La página permite buscar por título y filtrar por categorías. Cuenta con páginas dedicadas con la bibliografia de cada actor y director, mostrando las películas donde participa.
Los usuarios cuentan con dos listas personalizadas, Favoritas y WatchList.
Cuenta con panel de administración para gestionar los usuarios registrados.

### Modelo
```mermaid
classDiagram
    %% Entidades principales en la parte superior
    class Category {
        +Int id_category PK
        +String name
        +String description
        +Int tmdb_id
    }

    class Director {
        +Int id_director PK
        +String first_name
        +String last_name
        +String nationality
        +Int tmdb_id
        +String profile_path
        +String biography
        +DateTime birth_date
        +String birth_place
    }

    class Movie {
        +Int id_movie PK
        +String title
        +String description
        +Int duration
        +Int release_date
        +Float rating
        +Int tmdb_id
        +String poster_path
        +String backdrop_path
        +String original_language
        +Int vote_count
        +Float popularity
        +Boolean adult
        +Int id_director FK
        +Int id_category FK
        +Decimal averageScore
        +Int totalReviews
    }

    class Actor {
        +Int id_actor PK
        +String first_name
        +String last_name
        +DateTime birth_date
        +Int tmdb_id
        +String profile_path
        +String biography
        +String birth_place
        +Int gender
    }

    %% Tabla intermedia
    class Movie_Actor {
        +Int id_movie PK,FK
        +Int id_actor PK,FK
        +String role
        +String character
        +Int order
    }

    %% Usuario y sus relaciones
    class User {
        +String id PK
        +String name
        +String email
        +DateTime birth_date
        +Boolean emailVerified
        +String image
        +Boolean isActive
        +String password
        +UserRole role
        +String bio
    }

    class UserRole {
        <<enumeration>>
        USER
        ADMIN
        MODERATOR
    }

    class Review {
        +Int id_review PK
        +String id_user FK
        +Int id_movie FK
        +Decimal score
        +String comment
        +DateTime review_date
    }

    class Favorite {
        +String id_user PK,FK
        +Int id_movie PK,FK
    }

    class ToWatch {
        +String id_user PK,FK
        +Int id_movie PK,FK
    }

    %% Relaciones - Agrupadas lógicamente
    %% Movie como entidad central
    Category "1" --> "0..*" Movie : tiene
    Director "1" --> "0..*" Movie : dirige
    
    %% Relación Many-to-Many Movie-Actor
    Movie "1" --> "0..*" Movie_Actor : tiene
    Actor "1" --> "0..*" Movie_Actor : participa en
    
    %% Relaciones User-Movie
    User "1" --> "0..*" Review : escribe
    Movie "1" --> "0..*" Review : tiene
    
    User "1" --> "0..*" Favorite : marca
    Movie "1" --> "0..*" Favorite : está en
    
    User "1" --> "0..*" ToWatch : guarda
    Movie "1" --> "0..*" ToWatch : está en
    
    %% Enum
    User --> UserRole : tiene rol
```

## Alcance Funcional 

### Regularidad y Aprobacion Directa

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Pelicula<br>2. CRUD Director<br>3. CRUD Actor<br>4. CRUD Categoria<br>5. CRUD Usuario|
|CRUD dependiente|1. CRUD Reseña<br>2. CRUD Favorito<br>3. CRUD Watchlist<br>4. CRUD Pelicula-Actor|
|Listado<br>+<br>detalle|1. Listado de películas filtrado por categoría<br>2. Listado de películas favoritas<br>3. Listado de películas en la Watchlist<br>4. Listado de Reseñas por Pelicula<br>5. Listado de Reseñas por Usuario|
|CUU/Epic|1. Reseñar pelicula/serie<br>2. Calificar reseña de otro usuario<br>3. Admin Panel (peliculas, reviews, usuarios)<br>4. Seed de peliculas con TMDBAPI<br>5. Cargar ultimas 20 peliculas mas populares, con TMDBAPI|
