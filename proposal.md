# Propuesta TP DSW

## Grupo
### Integrantes
* 47064 - Serra, Gonzalo
* 48937 - Bitti, Guido
* 48028 - Bertone, Valentin

### Repositorios
* [Frontend app](github.com/tonchiserra/services-dsw)
* [Backend app](github.com/tonchiserra/api-services-dsw)

## Tema
### Descripción
Red social de contratación de servicios.

### Modelo
![Modelo-DSW.jpg](https://i.postimg.cc/W1m7pkTS/Modelo-DSW.jpg)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Tipo de Servicio<br>3. CRUD Dirección|
|CRUD dependiente|1. CRUD Cliente {depende de} CRUD Usuario<br>2. CRUD Servicio {depende de} CRUD Tipo de Servicio|
|Listado<br>+<br>detalle| 1. Listado de calificaciones, muestra todos los puntajes de calificación que recibió un prestador => detalle muestra comentarios junto con los puntajes.<br> 2. Listado de posts filtrado por tipo de servicio, muestra nombre del prestador y contenido reducido del post => detalle muestra contenido completo del post con todos los datos.|
|CUU/Epic|1. Contratar un servicio<br>2. Prestar un servicio|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Tipo de Servicio<br>3. CRUD Dirección<br>4. CRUD Cliente<br>5. CRUD Prestador<br>6. CRUD Post<br>7. CRUD Servicio|
|CUU/Epic|1. Contratar un servicio<br>2. Prestar un servicio<br>3. Seguir a un usuario|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de seguidores de un usuario|
|CUU/Epic|-|
|Otros|1. Notificaciones<br> 2. Like/repost en posts|
