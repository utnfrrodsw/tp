# Propuesta TP DSW

## Grupo
### Integrantes
* 50475 - Fiorini, Mauricio Mateo
* 51367 - Gallegos, Nicolás Gabriel
* 50412 - Gil, Agustín
* 50360 - Maggi, Lucas Nahuel

### Repositorio
* [Repositorio DSW-TP](https://github.com/starboyagus/DSW-TP-24)

## Tema
### Descripción
El negocio trata de un casino virtual.
Se trata de una plataforma que incluye una amplia variedad de juegos de casino.
Estos juegos utilizarán una moneda virtual (*Magg Coins*) completamente gratuita que puede ser conseguida a través de inicios de sesion diarios o gracias a las recompensas de los juegos.

### Modelo
EN CONSTRUCCION

![imagen del modelo](https://cdn.discordapp.com/attachments/1214594461276049548/1235339404357144706/DER-Casino.drawio_1.png?ex=663402f9&is=6632b179&hm=548697008dcc288e946d4113fa6c40866b07a008d6f5bebe3d8678da67d1907b&)


## Alcance Funcional 

### Alcance Mínimo
 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Usuario<br>2. CRUD Tipo Juego<br>3. CRUD Sistema de Juego|
|CRUD dependiente|1. CRUD Usuario {depende de} CRUD Tipo Usuario<br>2. CRUD Juego {depende de} CRUD Tipo Juego|
|Listado<br>+<br>detalle| 1. Listado de usuarios filtrado por rango de fecha, muestra nombre de usuario, pais, fecha de registro => detalle ¿CRUD Usuario?<br>2. Listado de usuarios filtrado por ganancia, muestra nombre de usuario, pais, ganancias, juego mas jugado => detalle
|CUU/Epic|1. Registrar un nuevo usuario<br>2. Otorgar recompensas diarias|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD|1. CRUD Tipo Usuario<br>2. CRUD Tipo Juego<br>3. CRUD Sistema de Juego<br>4. CRUD Usuario<br>5. CRUD Juego<br>6. CRUD <br>7. CRUD|
|CUU/Epic|1. Registrar un nuevo usuario<br>2. Otorgar recompensas diarias<br>3. Jugar un juego|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de juegos filtrados por rentabilidad<br>2. Listado de juegos filtrados por cantidad de veces jugados<br>3. Listado de juegos filtrados por preferencia de usuarios<br>4. Listado de numeros de ruleta filtrados por historial de tiradas|
|CUU/Epic|1. Eliminar cuenta de usuario<br>2. Modificar cuenta de usuario|
|Otros|1. Verificación de correo electrónico vía mail|
