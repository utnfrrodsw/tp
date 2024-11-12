# Propuesta TP DSW

## Grupo
### Integrantes
* 51565 - Bonaroti, Francisco
* 49539 - Salerno, Nicolás
* 50708 - Vacs, Francisco

### Repositorios
* [frontend app](https://github.com/FranciscoVacs/Bohemia_FE)
* [backend app](https://github.com/FranciscoVacs/Bohemia_BE)

## Tema
### Descripción
Es una página de una fiesta la cual tiene publicadas todas las fechas/eventos que se van a realizar en el futuro.Puede haber eventos en distintas ciudades de Argentina. Cada evento se realiza en una locación y una locación puede utilizarse para varios eventos a lo largo del tiempo.
Ingresando a uno de estos eventos se puede ver una breve descripción junto con la fecha y hora de inicio y la fecha y hora de finalización, si el usuario/cliente quiere ir al evento debe comprar una entrada, para comprar una entrada debe estar registrado. 
En la compra de entradas hay diferentes métodos de pago y la opción de ingresar un código de descuento por cada entrada  a comprar. A medida que pasa el tiempo las entradas aumentan su precio estando divididas en tandas, la preventa, la primera tanda, la segunda tanda, etc. Una vez que el usuario realiza la compra le llega un recibode la misma al correo junto con todas las entradas con su respectivo código qr.


### Modelo
![imagen del modelo]([https://github.com/phalanxeyes/DSW-2024-Bonaroti-Salerno-Vacs/blob/main/MDQRera.PNG?raw=true](https://drive.google.com/file/d/1suECr165TqPRWk9N4bYlmyNx3mmdsXqV/view?usp=sharing))


## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo entrada <br>2. CRUD Usuario<br>3. CRUD Provincia|
|CRUD dependiente|1. CRUD Entrada {depende de} CRUD Tipo entrada <br>2. CRUD Evento {depende de} CRUD Provincia|
|Listado<br>+<br>detalle| 1. Listado de eventos filtrado por provincia, muestra nombre de provincia, nombre y descripción del evento=> detalle muestra datos completos del evento<br> 2. Listado de entradas filtrado por rango de fecha, muestra fecha de compra, nombre e e-mail del cliente => detalle muestra datos completos del comprobante y del cliente|
|CUU/Epic|1. Registrarse<br>2. Comprar entrada|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo entrada<br>2. CRUD Usuario<br>3. CRUD Provincia<br>4. CRUD Entrada<br>5. CRUD Evento<br>6. CRUD Comprobante<br>7. CRUD Cliente<br>8. CRUD Productor|
|CUU/Epic|1. Registrarse<br>2. Comprar entrada<br>3. Actualizar estado de entrada|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados ||
|CUU/Epic||
|Otros||

