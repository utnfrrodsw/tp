# Propuesta TP DSW

## Grupo
### Integrantes
* 45242 - Castelli, Juan Pablo

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Juego de cartas por turnos, cada jugador deberá crease una cuenta y recibirá un mazo genérico y luego podrá conseguir cartas nuevas canjeandolas con códigos.
Los jugadores podrán jugar partidas entre ellos de lo que se registrará el historial de los resultados de estas y también podrán intercambiar cartas.

### Modelo
[Diagrama de clases.mmd](https://github.com/jpcastelli58/TP-DSW-Juego-Cartas/blob/main/Diagrama%20de%20clases.mmd)

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Carta<br>2. CRUD Habilidad|
|CRUD dependiente|1. CRUD Mazo {depende de} CRUD Carta|
|Listado<br>+<br>detalle| 1. Listado de cartas filtrado por clase, y atributos <br> 2. Listado de mazos filtrado por favoritos y porcentaje de combates ganados, etiquetas|
|CUU/Epic|1. Jugar combate|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Código {depende de} CRUD Carta|
|CUU/Epic|1. Canjear carta<br>2. Intercambiar carta|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados ||
|CUU/Epic||
|Otros||

