# TP DSW

## Grupo
### Integrantes
* 45016 - González, Alberto Sebastián
* 46839 - Utrera, Edsel Ángel

### Repositorios
* [frontend app](https://github.com/alsego41/DSWfrontend)
* [backend app](https://github.com/alsego41/DSWbackend)

## Tema
### Descripción
Aplicación web que permite a cualquier usuario buscar alojamientos dentro del país, y una vez registrados los mismos pueden proceder a alquilarlos según su conveniencia, a su vez se permite que cualquier usuario tome el rol de anfitrion y así publique sus propiedades para alquilar temporalmente.


### Modelo
[![](https://mermaid.ink/img/pako:eNqVVE1v2zAM_SuBTtuQGnbqObFvW3fYgDXr2vUy-KJYTCLElgxJbucG-e-T_BFZtoFhPCT04yNFUqTOKOMEUIKyHEv5heKDwEXKFloIFZApytni8XuLPEsQixT5nnefosXNjdYDzwu0biy_6hJa3oPgJQhVT7nbjvsvnol5R1Xd8oxm8YbT8Z1YL5RlMOIFLc_GehC0IV0P_GA9-nxa5hOIlxG31bcT6mfOT5Qd5uv4D6otp7mOtuHnFjFCiWUY2VMh1RYXYCHtN0IIo_YDCkxz-7nD7PQpy3jFlAXLapdTeXz3fhCVSvXjlXWlUJBj4yMwBeSr1rioh0ahDXPkEfUyLttMk1u6nS8jTNdoEcf9OlaOu3sNRqTCqpJTHBMiQEoLvHE2OFmWOIOBVXBe_Bz677A6joDsVGNBLHIQNM9nUzcTN8i7NMA0RYIVPJfml8xEMdPu1G7Hv2-di7yCTrkfrHEv27Ua97JB3Zgu6oTpp96J0oHjC5nApsy7I2Snb2wG5JWaObBfXufADnSzdsALWqIChF4Sot_ExjlFujV6n1CiVQJ7XOUqRSkzVFwp_lSzDCV7nEtYoqq5k-4ZvaIlZig5oz8oCUPPD_x1GPn-KojXqyhaoholq9gLwyD8uF6HmzC49TfRZYne9FyhxPfiINr4YRxri1Zugybe78aoRKXDA6F6le67d9z8Xf4CkZquiw?type=png)](https://mermaid.live/edit#pako:eNqVVE1v2zAM_SuBTtuQGnbqObFvW3fYgDXr2vUy-KJYTCLElgxJbucG-e-T_BFZtoFhPCT04yNFUqTOKOMEUIKyHEv5heKDwEXKFloIFZApytni8XuLPEsQixT5nnefosXNjdYDzwu0biy_6hJa3oPgJQhVT7nbjvsvnol5R1Xd8oxm8YbT8Z1YL5RlMOIFLc_GehC0IV0P_GA9-nxa5hOIlxG31bcT6mfOT5Qd5uv4D6otp7mOtuHnFjFCiWUY2VMh1RYXYCHtN0IIo_YDCkxz-7nD7PQpy3jFlAXLapdTeXz3fhCVSvXjlXWlUJBj4yMwBeSr1rioh0ahDXPkEfUyLttMk1u6nS8jTNdoEcf9OlaOu3sNRqTCqpJTHBMiQEoLvHE2OFmWOIOBVXBe_Bz677A6joDsVGNBLHIQNM9nUzcTN8i7NMA0RYIVPJfml8xEMdPu1G7Hv2-di7yCTrkfrHEv27Ua97JB3Zgu6oTpp96J0oHjC5nApsy7I2Snb2wG5JWaObBfXufADnSzdsALWqIChF4Sot_ExjlFujV6n1CiVQJ7XOUqRSkzVFwp_lSzDCV7nEtYoqq5k-4ZvaIlZig5oz8oCUPPD_x1GPn-KojXqyhaoholq9gLwyD8uF6HmzC49TfRZYne9FyhxPfiINr4YRxri1Zugybe78aoRKXDA6F6le67d9z8Xf4CkZquiw)

*A métodos prácticos evitamos la declaración de métodos de acceso en el diagrama.*

## Alcance Funcional 

### Alcance para regularidad
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Province<br>2. CRUD UserType|
|CRUD dependiente|1. CRUD User {depende de} CRUD UserType|
|Listado<br>+<br>detalle| 1. Listado alojamientos por ciudad/provincia<br> 2. Listado de reservas filtrado por rango de fecha, id de propiedad, fecha inicio y fin alquiler, estado y nombre del cliente<br>|
|CUU/Epic|1. Registrar reserva de alojamiento<br>2. Registrar alojamiento para alquilar|

### Alcance para AD
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Province<br>2. CRUD Service<br>3. CRUD UserType|
|CRUD dependiente|1. CRUD User {depende de} CRUD City y CRUD UserType<br>2. CRUD City {depende de} CRUD Province|
|Listado<br>+<br>detalle| 1. Listado alojamientos por localidad/provincia<br> 2. Listado de reservas filtrado por rango de fecha, id de propiedad, fecha inicio y fin alquiler, estado y nombre del cliente<br> 3.Listado de historial de alojamientos del huesped.<br>4. Listado de alojamientos según filtros de la propiedad (ej. precio, ambientes, camas, baños, patio,etc…)|
|CUU/Epic|1. Registrar reserva de alojamiento<br>2. Registrar alojamiento para alquilar<br>3. Registrar cancelación de reserva (de anfitrión o de huesped)<br>4. Actualizar precio de alojamiento|
