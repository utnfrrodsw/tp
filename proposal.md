# Propuesta TP DSW

## Grupo
### Integrantes
* 51754 - Mondelli, Lucio
* 51497 - Plenza, Liam
* 51543 - Wardoloff,Tomás 

### Repositorios
* [frontend app](https://github.com/Tomas-Wardoloff/TP_DSW_FrontEnd)
* [backend app](https://github.com/Tomas-Wardoloff/TP_DSW_BackEnd)

## Tema
### Descripción
Nuestro proyecto consiste en una aplicación web enfocada en dar visibilidad a jugadores de diferentes deportes a nivel a amateur y a los reclutadores y clubes la posibilidad de adquirir nuevos refuerzos. Ofreciendo un entorno similar a LinkedIn pero abocado al deporte, nuestra plataforma fomenta las conexiones entre atletas y oportunidades de crecimiento en sus respectivos campos.

### Modelo

```mermaid
erDiagram
 USERS {
        INT id PK
        VARCHAR email
        VARCHAR password
        VARCHAR phone_number
        ENUM user_type
        TIMESTAMP created_at
        BOOLEAN is_active
        TIMESTAMP last_login
    }

    ATHLETES {
        INT id PK
        VARCHAR first_name
        VARCHAR last_name
        VARCHAR nationality
        DATE birth_date
        VARCHAR sport
        VARCHAR position
        BOOLEAN is_signed
    }

    CLUBS {
        INT id PK
        VARCHAR club_name
        VARCHAR country
        YEAR founded
        VARCHAR stadium
    }

    AGENTS {
        INT id PK
        VARCHAR first_name
        VARCHAR last_name
        VARCHAR agency
    }

    MESSAGES {
        INT id PK
        INT sender_id FK
        INT receiver_id FK
        TEXT message
        TIMESTAMP created_at
    }

    POSTS {
        INT id PK
        INT author_id FK
        VARCHAR title
        TEXT content
        TIMESTAMP created_at
    }

    PROFILES {
        INT id PK
        INT user_id FK
        TEXT bio
    }

    FRIEND_REQUESTS {
        INT id PK
        INT sender_id FK
        INT receiver_id FK
        ENUM status
        TIMESTAMP created_at
    }

    USERS ||--|{ ATHLETES: id
    USERS ||--|{ CLUBS: id
    USERS ||--|{ AGENTS: id
    USERS ||--o{ MESSAGES: sender_id
    USERS ||--o{ MESSAGES: receiver_id
    USERS ||--o{ POSTS: author_id
    USERS ||--o{ PROFILES: user_id
    USERS ||--o{ FRIEND_REQUESTS: sender_id
    USERS ||--o{ FRIEND_REQUESTS: receiver_id
```

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD User<br>2. CRUD Agente<br>3. CRUD Club|
|CRUD dependiente|1. CRUD Publicacion {depende de} CRUD User<br>2. CRUD Atleta {depende de} CRUD User|
|Listado<br>+<br>detalle| 1. Listado de Clubes filtrado por nombre, muestra perfil del club => detalle CRUD Club<br> 2. Listado de Atletas filtrado por deporte, categoria, posicion, estado => muestra perfiles de atletas que coincidan con la busqueda|
|CUU/Epic|1. Realizar una solicitud de amistad<br>2. Realizar una publicación|


Adicionales para Aprobación:
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Atleta<br>2. CRUD Agente<br>3. CRUD Club<br>4. CRUD Estadisticas<br>5. CRUD Publicación<br>6. CRUD Solicitud<br>7. CRUD Mensaje|
|CUU/Epic|1. Realizar una publicación<br>2. Mandar una solicitud de conexión<br>3. Realizar una convecatoria a un evento|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de convocatorias filtrado por Club <br>2. Listado de publicaciones filtrado por Deporte|
|CUU/Epic|1. Inscribirse a una convocatoria<br>2. Republicar una publicación de otro usuario|
|Otros|1. Envio de recordatorio y confirmación de inscripción a una convocatoria via mail|

