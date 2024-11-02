# Propuesta TP DSW

## Grupo
### Integrantes
* 50984-Aimaretti, Renzo
* 51848-Amelio Ortiz, Ignacio
* 50379-de Elia, Juan Manuel

### Repositorios
* Backend: (https://github.com/RenzoAimaretti/Backend)
* Frontend: (https://github.com/RenzoAimaretti/frontEndDWS)


## Tema
### Descripción
Decidimos crear una web app donde los usuarios puedan consultar información relevante sobre las películas y/o series que deseen. Podrán filtrar por: Título, año, director, actor y más. Además contará con listas que se actualizarán diariamente, dichas listas contendrán películas y/o series según temáticas tales como más vistas del mes, mejor puntuadas, ideales para ver en familia, etc. También los usuarios registrados podrán crear sus propias listas.

### Modelo
![imagen del modelo de dominio](./MD.png)

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Sugerencias<br>2. CRUD Subscripcion <br>3. CRUD Rango cinefilo|
|CRUD dependiente|1. CRUD Listas de usuario {depende de} CRUD Usuario<br>2. CRUD Reseña {depende de} CRUD Usuario|
|Listado<br>+<br>detalle| 1. Listado de reseñas por contenido <br> 2. Listado de usuarios registrados|
|CUU/Epic|1. Registrar una lista para un usuario<br>2. Registar una reseña para un contenido|



Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Comentario<br>2. CRUD Admin<br>|
|CUU/Epic|1. Realizar un comentario<br>2. Reagistrar un nuevo rango <br>3. Aumentar rango de un usuario|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. |
|CUU/Epic|1. <br>2. |
|Otros|1.|

