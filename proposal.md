# Propuesta TP DSW

## Grupo
### Integrantes
* 51565 - Bonaroti, Francisco
* 49539 - Salerno, Nicolás
* 50708 - Vacs, Francisco

### Repositorios
* [frontend app](https://github.com/FranciscoVacs/QRera_FE)
* [backend app](https://github.com/FranciscoVacs/QRera_BE)

## Tema
### Descripción
Una ticketera virtual que permite gestionar las entradas para diversos eventos hosteados. Al comprar cada entrada se genera un código QR que el cliente mostrará en puerta para asistir al evento. Se mantiene un registro de qué códigos generados ya se utilizaron y cuales no.

### Modelo
![imagen del modelo](https://drive.google.com/file/d/1SdwSiYLLLJTMLrldGkm1_gGFyT5YYMt-/view?usp=sharing)


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
|CRUD |1. CRUD Tipo entrada<br>2. CRUD Usuario<br>3. CRUD Provincia<br>4. CRUD Entrada<br>5. CRUD Evento<br>6. Comprobante<br>7. Cliente<br>8. Productor|
|CUU/Epic|1. Registrarse<br>2. Comprar entrada<br>3. Actualizar estado de entrada|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados ||
|CUU/Epic||
|Otros||

