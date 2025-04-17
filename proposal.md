# Propuesta TP DSW

## Grupo
### Integrantes
* 53526, Luca Gritti
* 53529, Felipe Sosa Bianciotto
* 53528. Matias Estevez

### Repositorios
* [frontend app](https://github.com/felisosa/TP-Frontend-Estevez-Gritti-Sosa.git)
* [backend app](https://github.com/felisosa/TP-Back-Estevez-Sosa-Gritti.git)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Consiste en un sitio web para equipos deportivos donde pueden llevar registro de los datos de sus jugadores (número, nombre,posición,minutos jugados, goles, tarjetas,lesiones, etc.), partidos(resultado, fecha, 11 inicial,etc.),estadísticas generales( racha de victorias,goleador, asistidor,etc).

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD jugador<br>2. CRUD partido<br>3. CRUD equipo|
|CRUD dependiente|1. CRUD estadísticas generales de jugador {depende de} CRUD jugador<br>2. CRUD Estadisticas de equipo {depende de} CRUD partido y CRUD equipo|
|Listado<br>+<br>detalle| 1. listado de jugadores filtrado por posición y número mostrando nombre => detalle CRUD jugador<br> 2. listado de partido filtrado por rango de fecha mostrando resultado y rival => detalle muestra datos de los partidos jugados|
|CUU/Epic|1. registrar jugador en el equipo<br>2. registrar datos del jugador|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD lesiones<br>2. CRUD tarjetas<br>3. CRUD goles<br>4. CRUD asistencias<br>5. CRUD entrenadores<br>6. CRUD vallas invictas<br>7. CRUD minutos jugados|
|CUU/Epic|1. registrar entrenadores y su rol<br>2. registrar goles y asistencias<br>3. registrar lesiones|



