# Propuesta TP DSW - Volquetes Los Hermanos

## Grupo
### Integrantes
* 47245 - Pereyra, Camilo
* 33862 - Virgolini, Pablo

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)

## Tema
### Descripción
Negocio basado en una empresa familiar llamada "Volquetes Los Hermanos" dedicada al alquiler de volquetes.

### Modelo
![DER volquetes V1 drawio](https://github.com/caamilopereyra01/VolquetesLosHermanos/assets/165169940/f95ad3b1-a387-4483-b798-754642ede11a)

https://drive.google.com/file/d/1EupYWe6jK6qo13pOt6u4Kp9T8_wHiV3B/view?usp=sharing

## Alcance Funcional 
La empresa "Volquetes Los Hermanos" nos contacta para llevar a cabo la gestion de alquileres y cobranzas de sus volquetes.

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cliente<br>2. CRUD Tipo Volquete<br>3. CRUD Gastos|
|CRUD dependiente|1. CRUD Volquete {depende de} CRUD Tipo Volquete<br>2. CRUD Alquiler {depende de} CRUD Volquete y CRUD Cliente<br>3. CRUD Pago {depende de} CRUD Alquiler
|Listado<br>+<br>detalle| 1. Listado de Volquetes filtrado por nro de volquete, mostrando marca, fecha de fabricacion y fecha de compra. => detalle CRUD Volquete<br> 2. Listado un alquiler mostrando el volquete, cliente y el ultimo estado del alquiler => detalle CRUD Alquiler<br> 3. Listado todos los pagos de un alquiler => detalle CRUD Pagos|
|CUU/Epic|1. Registrar un alquiler para un volquete<br>2. Emitir una factura de un alquiler<br>3. Actualizar valor de un tipo de volquete|
|Otros|1. Envío alerta cuando un volquete pasa mas de diez días de estadía|
