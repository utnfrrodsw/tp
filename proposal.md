# Fulbo

## Grupo

### Integrantes

- 49740 - José, Agustín
- 47898 - Tebes, Alexander
- 50241 - Mayer, Ignacio
- 49693 - Coccoz, Manuel

### Repositorios

- [frontend app](https://github.com/AgusJose02/Fulbo-fullstack)

## Tema

### Descripción

Red social enfocada en el Futbol Nacional de Primera División. Estará organizado por clubes, donde cada uno tendrá su propio Grupo.
En los grupos se encontrará información relacionada a las posiciones, fixture y datos de partidos de los clubes. Además, se podrán crear posts,
subir imágenes y videos y realizar encuestas. También habrá una sección de prodes.

### Modelo

![imagen del modelo](https://github.com/AgusJose02/Fulbo-fullstack/blob/main/Diagrama%20de%20Tablas%20-%20Fulbo.png)

| Req                     | Detalle                                                                                                                    |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| CRUD simple             | 1. CRUD Grupo de club<br>2. CRUD Usuario<br>3. CRUD Torneo<br>4. CRUD Partido                                              |
| CRUD dependiente        | 1. CRUD Post {depende de} CRUD Grupo de club<br>2. CRUD Apuesta {depende de} CRUD Partido                                  |
| Listado<br>+<br>detalle | 1. Listado de equipos por torneo => detalle equipo<br> 2. Listado de resultado de partidos de un equipo => detalle partido |
| CUU/Epic                | 1. Crear un post<br>2. Participar en el prode de la fecha                                                                  |
