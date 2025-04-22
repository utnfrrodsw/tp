# Propuesta TP DSW

## Grupo
### Integrantes
* 51955 - Coria, Grecia Nicol
* 50468 - Ravera, Camila Denisse
* 51013 - Rodriguez, Maria Julieta

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción

Nuestro software se basa en una página de adopción de mascotas que utiliza etiquetas (tags) para identificar tanto a las mascotas como a los usuarios registrados, con el objetivo de relacionarlos entre sí. En la plataforma, los usuarios podrán cargar mascotas en adopción y también completar un perfil con información relevante que permitirá encontrar coincidencias automáticas con mascotas compatibles.

### Modelo

(https://drive.google.com/file/d/17QlhmLbA_85BeA9a9HWqCJ0liveBjBF4/view?usp=sharing)

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Especie<br>3. CRUD Patología|
|CRUD dependiente|1. CRUD SolicitudAdopción {depende de} CRUD Usuario y Mascota<br>2. CRUD Especie {depende de} CRUD Mascota|
|Listado<br>+<br>detalle| 1. Listado de mascotas filtrado por mascotas elegibles para un usuario => detalle CRUD Mascota<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de habitación, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Subir una nueva mascota elegible para ser adoptada<br>2. Adoptar una mascota|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Usuario<br>2. CRUD Mascota<br>3. CRUD Especie<br>4. CRUD Patología<br>5. CRUD solicitudAdopción|
|CUU/Epic|1. Subir una nueva mascota elegible para ser adoptada<br>2. Adoptar una mascota<br>3. Aceptar o denegar una adopción|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

