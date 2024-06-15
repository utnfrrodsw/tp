# Propuesta TP DSW

## Grupo

### Integrantes

47138 - Marcosano, Mauro Agustin
46860 - Ceballos, Ramiro
46848 - Hoyos, Alex Nicolás
47412 - Tobajas Ramirez, Ignacio  
44865 - Fernández, Mateo

### Repositorios

- [frontend app](https://github.com/AlexNHoyos/dmcoffers-client)
- [backend app](https://github.com/AlexNHoyos/dmcoffers-server-main)

## Tema

### Descripción

Consiste de un sistema web orientado a un usuario final que busca informarse diariamente de las ofertas y nuevos lanzamientos de videojuegos y/o software en diversas plataformas de renombre (Steam, Epic Games, Ubisoft Store) además de la posibilidad de consumir noticias en un formato de foro que permita interacciones como comentarios, reacciones (likes / votos).

### Modelo DER

![imagen del modelo DER](https://drive.google.com/file/d/1kRI9QUqNSeMxy929tgR4-McgSdp707CP/view?usp=sharing)

Draw.io del modelo:
https://drive.google.com/file/d/1MHuFxfHsdLoeFCHqA9ak14gNvdQMPk5E/view?usp=sharing

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple| 1. CRUD Publicador <br>2. CRUD Categoría <br>3. CRUD Usuario <br>4. CRUD Ticket de soporte <br>5. CRUD Servicio de hosting|
|CRUD dependiente| 1. CRUD Lista de deseos <br>2. CRUD Oferta Juego <br>3. CRUD Comentario en publicacion <br>4. CRUD Publicacion de venta de juego|
|Listado<br>+<br>detalle| 1. Listado de foros ordenado por relevancia o fecha de publicación, muestra multimedia de foro, título, comienzo del texto. => detalle CRUD Foro <br> 2. Listado de juegos deseados filtrado por categoría de juego, rango de precios, juego a la venta <br> 3. Listado de tickets de soporte generadors por usuarios indicando su estado y datos de categorizacion <br> 4. Listado de servicios de hosting contratados indicando las conexiones simultaneas de usuarios que adquirieron el juego|
|CUU/Epic| 1. Publicar una noticia reciente en el foro <br> 2. Agregar juego a lista de deseos <br> 3. Crear un ticket de soporte <br> 4. Contratar hosting para un juego|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD | 1. CRUD Publicador<br> 2. CRUD Categoría<br> 3. CRUD Usuario<br> 4. CRUD Juego<br> 5. CRUD Foro<br> 6. CRUD Perfil usuario<br> 7. CRUD Vincula perfil Steam<br> 8. CRUD Ticket de soporte<br> 9. CRUD Servicio de hosting|
|CUU/Epic| 1. Publicar una noticia reciente en el foro<br> 2. Agregar juego a lista de deseos <br> 3. Recuperar contraseña/usuario <br> 4. Crear un ticket de soporte <br> 5. Contratar hosting para un juego|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                                                                                                       |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Categoría más deseada, filtrado por cantidad de juegos en lista de deseos, juegos comprados, cantidad de descuentos por mes. <br> 2. Juegos agregados a lista de deseos, muestra datos de usuario, reseñas de juego, fecha de lanzamiento. |
| CUU/Epic | 1. Eliminar juego deseado <br> 2. Eliminar usuario sistema web                                                                                                                                                                                |
| Otros    | 1. Envía recordatorio de dia de salida de juego agregado a lista de deseos                                                                                                                                                                    |
