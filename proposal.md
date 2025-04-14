# Propuesta TP DSW

## Grupo

### Integrantes

47138 - Marcosano, Mauro Agustin<br>
46860 - Ceballos, Ramiro<br>
46848 - Hoyos, Alex Nicolás<br>
47412 - Tobajas Ramirez, Ignacio<br>
44865 - Fernández, Mateo<br>

### Repositorios

- [frontend app](https://github.com/AlexNHoyos/dmcoffers-client)
- [backend app](https://github.com/AlexNHoyos/dmcoffers-server-main)

## Tema

### Descripción

DMCOffers es un WebService orientado al usuario final, donde este podra informarse sobre las fechas de salida, precios y ofertas de diversos videojuegos y software disponibles en el mercado. Existe tambien la posibilidad de contratar un servicio de WebHosting de juegos desarrollados por la comunidad para publicadores o desarrolladores indies que busquen encontrar financiamiento en el mercado. 

### Modelo DER

Draw.io del modelo:
https://drive.google.com/file/d/1tck3RD6nlFP1pz9xcckBYNq8MNagbDFf/view?usp=sharing

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple| 1. CRUD Publicador <br>2. CRUD Desarrollador <br>3. CRUD Categoría <br>4. CRUD Usuario <br>5. CRUD Ticket de soporte <br>6. CRUD Servicio de hosting|
|CRUD dependiente| 1. CRUD Lista de deseos <br>2. CRUD ticket de soporte <br>3. CRUD Publicacion de juego|
|Listado<br>+<br>detalle| 1. Listado de servicios de hosting solicitados, filtrando por categoria de juego, fecha de solicitud, recursos de hardware solicitados <br> 2. Listado de juegos deseados filtrado por categoría de juego, rango de precios, juego a la venta <br> 3. Listado de tickets de soporte generadors por usuarios indicando su estado y datos de categorizacion|
|CUU/Epic| 1. Crear publicacion de venta de juego <br> 2. Agregar juego a lista de deseos <br> 3. Crear un ticket de soporte|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD | 1. CRUD Publicador<br> 2. CRUD Desarrollador<br> 3. CRUD Precio de juego<br> 4. CRUD Oferta de juego<br> 5. CRUD Categoría<br> 6. CRUD Usuario<br> 7. CRUD Juego<br> 8. CRUD Perfil usuario<br> 9. CRUD Ticket de soporte<br> 10. CRUD Servicio de hosting|
|CUU/Epic| 1. Crear publicacion de juego<br> 2. Agregar juego a lista de deseos (Relacionado con CUU - Crear publicacion de juego)<br> 3. Recuperar contraseña/usuario <br> 4. Crear un ticket de soporte <br> 5. Contratar hosting para un juego|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                                                                                                       |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Categoría más deseada, filtrado por cantidad de juegos en lista de deseos, juegos comprados, cantidad de descuentos por mes. <br> 2. Juegos agregados a lista de deseos, muestra datos de usuario, reseñas de juego, fecha de lanzamiento. |
| CUU/Epic | 1. Eliminar juego deseado <br> 2. Eliminar usuario sistema web                                                                                                                                                                                |
| Otros    | 1. Envía recordatorio de dia de salida de juego agregado a lista de deseos                                                                                                                                                                    |
