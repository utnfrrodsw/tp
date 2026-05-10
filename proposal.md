# Propuesta TP DSW

## Grupo
### Integrantes
* 53526, Luca Gritti
* 53529, Felipe Sosa Bianciotto
* 53528. Matias Estevez

### Repositorios
* [fullstack app](https://github.com/felisosa/TP-Back-Estevez-Sosa-Gritti.git)

## Tema
### Descripción
Consiste en una pagina deportiva para equipos de futbol donde podemos cargar los datos del equipo(nombre, pais,liga,categori) y tambien llevar registro de los jugadores que pertenecen al equipo, teniendo sus datos(nombre,apellido,posicion, numero,etc.), podiendo llevar al dia las  estadisticas de estos, como: goles,asistencias, minutos jugados, etc.Y tambien poder contar con un registro de las lesiones que tienen y como se deben recuperar de ellas.

### Modelo
<img width="797" height="438" alt="image" src="https://github.com/user-attachments/assets/3e2f7495-be59-4f42-864b-762a73655e58" />

https://drive.google.com/file/d/1xCh5MbNOI2g06k7jHnEEw6lJ4GRlYeHT/view?usp=sharing


## Alcance Funcional 

### Alcance Mínimo
 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD jugador<br>2. CRUD Tipo Lesion<br>3. CRUD equipo|
|CRUD dependiente|1. CRUD estadísticas generales de jugador {depende de} CRUD jugador<br>2. CRUD Lesiones {depende de} CRUD Tipo Lesiones|
|Listado<br>+<br>detalle| 1. listado de jugadores filtrado por posición  mostrando todos sus datos => detalle CRUD jugador<br> 2. listado de equipos filtrado por categoria mostrando todos sus datos=> detalle CRUD Equipo|
|CUU/Epic|1. registrar jugador en el equipo<br>2. registrar datos del jugador|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Partidos<br>2. Crud Dts<br>3. CRUD Contratos<br>|
|CUU/Epic|1. registrar entrenadores y su rol<br>2. registrar Partidos(tipo,lugar,rival,etc)<br>3. registrar contratos(duracion,fecha de fin,etc)|



