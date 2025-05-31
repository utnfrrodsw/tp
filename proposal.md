# Propuesta TP DSW

## Grupo
### Integrantes
* 52571 - Ferzola, Ornella Fiama
* 52115 - Soria, Marian Luz
* 52362 - Baistroqui, Lucas
* 53009 - Oliva, Ivan

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Menú-Inclusivo
### Descripción
Menú-Inclusivo es una plataforma web diseñada para conectar a las personas con necesidades alimenticias específicas con restaurantes que ofrecen opciones adaptadas a sus dietas. Para poder realizar pedidos en línea a través de la plataforma, solo necesitás crear tu usuario. Esto nos permite personalizar tu experiencia, guardar tus preferencias y mostrarte recomendaciones acordes a tus necesidades.

### Modelo
![image](https://github.com/user-attachments/assets/48276ea8-4370-4e07-94ff-dd1142519910)

Link: https://github.com/user-attachments/assets/48276ea8-4370-4e07-94ff-dd1142519910

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Menu<br>2. CRUD Usuario<br>3. CRUD Local<br>4. CRUD Preferencias|
|CRUD dependiente|1. CRUD Precio {depende de} CRUD Menu|
|Listado<br>+<br>detalle| 1. Listado de Menu filtrado por preferencias y zona<br> 2. Listado de reservas filtrado por fecha, hora y local, y muestra usuario, local, estado, nombre del cliente, cantidad de personas => detalle muestra datos completos de la reserva y del cliente<br>3. Listado de reseñas filtrado por Local, y muestra Usuario, descripcion de reseña, puntuacion y fecha y hora de reseña.|
|CUU/Epic|1. Crear local<br>2. Modificar local<br>3. Ver locales<br>4. Alta menu|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cliente<br>2. CRUD Dueño<br>3. CRUD Gerente|
|CUU/Epic|1. Buscar local|


### Alcance Adicional Voluntario


|Req|Detalle|
|:-|:-|
|Listados ||
|CUU/Epic||
|Otros||

