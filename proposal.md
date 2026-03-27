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
|CRUD simple| 1. CRUD Publicador <br>2. CRUD Desarrollador <br>3. CRUD Categoría <br>4. CRUD Usuario <br>5. CRUD Ticket de soporte|
|CRUD dependiente| 1. CRUD Lista de deseos <br>2. CRUD Carro de compras <br>3. CRUD Juegos|
|Listado<br>+<br>detalle| 1. Listado de servicios de hosting solicitados, filtrando por nombre de juego/programa, publicador y/o recursos de hardware <br> 2. Listado de juegos filtrados por categoría , rango de precios, fecha de salida <br> 3. Listado de tickets de soporte filtrados por estado, fecha de creación y usuario|
|CUU/Epic| 1. Crear categoria de juego - CUU01<br> 2. Crear desarrollador de juego - CUU02<br> 3. Crear publicador de juego - CUU03 <br> 4. Registrar usuario - CUU04|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD | 1. CRUD Publicador<br> 2. CRUD Desarrollador<br> 3. CRUD Precio de juego<br> 4. CRUD Servicio de Hosting<br> 5. CRUD Categoría<br> 6. CRUD Usuario<br> 7. CRUD Juego<br> 8. CRUD Perfil usuario<br> 9. CRUD Ticket de soporte<br>|
|CUU/Epic| 1. Crear categoria de juego - CUU01<br> 2. Crear desarrollador de juego - CUU02<br> 3. Crear publicador de juego - CUU03 <br> 4. Registrar usuario - CUU04 <br> 5. Agregar juego a lista de deseos - CUU06|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                                                                                                       |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Biblioteca de juegos <br> 2. Lista de deseos|
| CUU/Epic | 1. Recuperar contraseña de usuario - CUU05|
| Otros    | 1. Recuperacion de contraseña <br> 2.Encriptado de datos durante registro, logueo y recuperacion de contraseña <br> 3. Menu lateral que puede actualizarse desde la base de datos|
