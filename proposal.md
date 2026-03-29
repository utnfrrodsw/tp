# Propuesta TP DSW

## Grupo
### Integrantes
* 51754 - Mondelli, Lucio
* 51497 - Plenza, Liam
* 51543 - Wardoloff,Tomás 

### Repositorios
* [frontend app](https://github.com/luciomondelli/TP_DSW_FrontEnd)
* [backend app](https://github.com/Tomas-Wardoloff/TP_DSW_BackEnd)

## Tema
### Descripción
Nuestro proyecto consiste en una aplicación web enfocada en dar visibilidad a jugadores de diferentes deportes a nivel a amateur y a los reclutadores y clubes la posibilidad de adquirir nuevos refuerzos. Ofreciendo un entorno similar a LinkedIn pero abocado al deporte, nuestra plataforma fomenta las conexiones entre atletas y oportunidades de crecimiento en sus respectivos campos.

### Modelo

```mermaid
erDiagram
   USER {
        INT id PK
        VARCHAR email
        VARCHAR password
        VARCHAR phone_number
        ENUM user_type
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
    }
    ATHLETE {
        INT id PK
        INT user_id FK
        VARCHAR first_name
        VARCHAR last_name
        VARCHAR nationality
        DATE birth_date
        BOOLEAN is_signed
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
    }
    CLUB {
        INT id PK
        INT user_id FK
        VARCHAR name
        VARCHAR address
        DATE opening_date
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
    }
    AGENT {
        INT id PK
        INT user_id FK
        VARCHAR first_name
        VARCHAR last_name
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
    }
    SPORT {
        INT id PK
        VARCHAR name
    }
    POSITION {
        INT id PK
        INT sport_id FK
        VARCHAR name
    }
    POST {
        INT id PK
        INT author_id FK
        VARCHAR content
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
    }
    POST_MEDIA {
        INT id PK
        INT post_id FK
        VARCHAR url
        ENUM type
        VARCHAR original_name
        INT order
    }
    COMMENT {
        INT id PK
        INT post_id FK
        INT author_id FK
        INT parent_comment_id FK
        VARCHAR content
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
    }
    LIKE {
        INT id PK
        INT post_id FK
        INT author_id FK
    }
    FRIENDSHIP {
        INT id PK
        INT requester_id FK
        INT addressee_id FK
        ENUM status
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    REFRESH_TOKEN {
        INT id PK
        INT user_id FK
        VARCHAR token
        TIMESTAMP expires_at
        BOOLEAN is_revoked
    }

    USER ||--o| ATHLETE : "tiene perfil"
    USER ||--o| CLUB : "tiene perfil"
    USER ||--o| AGENT : "tiene perfil"
    USER ||--o{ POST : "publica"
    USER ||--o{ COMMENT : "comenta"
    USER ||--o{ LIKE : "da like"
    USER ||--o{ FRIENDSHIP : "requester"
    USER ||--o{ FRIENDSHIP : "addressee"
    USER ||--o{ REFRESH_TOKEN : "tiene"
    POST ||--o{ POST_MEDIA : "tiene media"
    POST ||--o{ COMMENT : "tiene"
    POST ||--o{ LIKE : "tiene"
    COMMENT ||--o{ COMMENT : "replies"
    SPORT ||--o{ POSITION : "tiene"
    ATHLETE }o--o{ SPORT : "practica"
    ATHLETE }o--o{ POSITION : "juega en"
    AGENT }o--o{ CLUB : "representa"
```

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD User<br>2. CRUD Agente<br>3. CRUD Club|
|CRUD dependiente|1. CRUD Publicacion {depende de} CRUD User<br>2. CRUD Atleta {depende de} CRUD User|
|Listado<br>+<br>detalle| 1. Listado de Clubes filtrado por nombre, muestra perfil del club => detalle CRUD Club<br> 2. Listado de Atletas filtrado por deporte, posicion, nacionalidad, estado de contrato => muestra perfiles de atletas que coincidan con la busqueda|
|CUU/Epic|1. Realizar una publicación<br>2. Crear un usuario con su respectivo perfil|

Adicionales para Aprobación:
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Atleta<br>2. CRUD Agente<br>3. CRUD Club<br>4. CRUD Estadisticas<br>5. CRUD Publicación<br>6. CRUD Solicitud<br>7. CRUD Like|
|CUU/Epic|1. Realizar una publicación<br>2. Mandar una solicitud de amistad<br>3. Registrarse con perfil propio según tipo de usuario|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de publicaciones filtrado por amigos<br>2. Listado de publicaciones de un usuario especifico|
|CUU/Epic|1. Dar like y comentar una publicación<br>2. Responder comentarios|
|Otros|1. Paginación en el feed de publicaciones<br>2. Subida de imágenes en publicaciones<br>3. Catálogo de deportes y posiciones para el frontend<br>4. Refresh token persistido en DB con rotación y logout real

