# Propuesta TP DSW

## Grupo
### Integrantes
* 52805 - Laveggi, Valentino 
* 53402 - Murúa, Joaquín Tomás
* 52937 - Romero, Gabriel Tobías (Comisión 304)

### Repositorios
* [frontend app](https://github.com/Evenaut7/TP_DSW_FrontendApp.git)
* [backend app](https://github.com/Evenaut7/TP_DSW_BackendApp.git)


## Tema
### Descripción
El modelo de negocio planteado permite a un usuario conocer los puntos de interés de una localidad , actividades disponibles para realizar, su historia y los comentarios de otros usuarios acerca de dicha localidad. 

### Modelo
![image](Modelo_de_dominio-Page-2.png)

* [Draw.io](https://drive.google.com/file/d/1lk8nXVs_xaIrwI9erYk_CGOQRLd_-vMT/view?usp=sharing)

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Localidad <br>2. CRUD Tag<br>
|CRUD dependiente|1. CRUD Usuario {depende de} CRUD ? <br>2. CRUD PuntoInteres{depende de} CRUD Localidad <br> 3. CRUD Evento {depende de} CRUD PuntoInteres|
|Listado<br>+<br>detalle| 1. Listado de Evento para una localidad y un rango de fechas determinado => Detalle muestra nombre del evento, una imagen de la actividad, su nombre, tipo de evento, fecha más próxima y horario.<br>2. Listado de Puntos de interés para una localidad determinada => Detalle muestra una imagen del punto de interés, nombre, y breve descripción|
|CUU/Epic|1. Evento (crear + notificación)<br>2. Valoración|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Festividad <br>2. CRUD Historia<br>3. CRUD Provincia<br>4. CRUD Localidad<br>5. CRUD Tag<br>6. CRUD Cliente<br>7. CRUD Creador <br>8. CRUD Evento<br>9. CRUD Comentario<br>10. CRUD Municipal<br>11. CRUD Privado<br>12. CRUD Favorito<br>13. CRUD Agenda<br>14. CRUD PuntoDeInteres|
|CUU/Epic|1.Realizar un comentario sobre un punto de interés.<br> 2. Guardar un evento en la agenda.<br>3. Guardar un evento y/o punto de interés en favoritos.|


### Alcance Adicional Voluntario

*Nota*: (A definir)
