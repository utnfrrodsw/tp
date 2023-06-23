# TP DSW - Veterinaria

## Grupo
### Integrantes

|Legajo|Alumno| E-Mail | Github|
|:-|:-|:-|:-|
|44720|Nicolas Rossetti|nicorossetti14@gmail.com | [@ziloXX](https://github.com/ziloXX)
|46828|Mauro Jimenez| maurojim123@gmail.com| [@maurojjzz](https://github.com/maurojjzz)
|47827|Miguel Rodriguez| miguelrodriguezips36@gmail.com| [@Miguel58000](https://github.com/Miguel58000)


### Repositorios
* [frontend app](https://github.com/maurojjzz/front-end-Veterinaria)
* [backend app](https://github.com/maurojjzz/back-end-Veterinaria)


## Tema
### Descripción
El sistema veterinaria permitirá al usuario loguearse y observar diferentes funcionalidades en el sistema siendo la más importante solicitar un turno para una determinada atención para su mascota.Una vez atendida la mascota el veterinario ingresa al sistema las distintas prácticas realizadas en esa atención y registra el importe de la misma dependiendo de la suscripción y el plan de cuotas a pagar que haya elegido el dueño. El administrador tiene acceso a los diferentes listados de las entidades, en los cuales puede hacer el correspondiente CRUD si es necesario.

### Modelo
![DER v1.0](<der-Veterinaria-V01.png>)


## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Especie<br>3. CRUD Practica|
|CRUD dependiente|1. CRUD Raza {depende de} CRUD Especie<br>2. CRUD Mascota {depende de} Usuario y Raza|
|Listado<br>+<br>detalle| 1. Listado de mascotas registradas filtrado por especie muestra nombre, sexo , edad y dueño de mascota => detalle CRUD Mascota<br> 2. Listado de animales que recibieron atencion veterinaria filtrado por una fecha, muestra nombre, sexo , edad y dueño de mascota => detalle muestra datos completos del animal y dueño
|CUU/Epic|1. Atencion veterinaria<br>2. Pago en cuotas|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Especie<br>3. CRUD Practica<br>4.CRUD Veterinario <br>5. CRUD Precio <br> 6. CRUD Suscripciones <br> 7. CRUD Pago | 
|CUU/Epic|1. Realizar suscripcion|




