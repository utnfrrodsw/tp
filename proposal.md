# Propuesta TP DSW

## Grupo
### Integrantes
* 42897 - Gaston Gimenez
* 46749 - Matias Chiodo
* 46247 - Andres Guerrero


### Repositorios
* [frontend app](https://github.com/gaaston14/TP_CertificacionDeTareas/tree/main/frontend)
* [backend app](https://github.com/gaaston14/TP_CertificacionDeTareas/tree/main/backend)


## Tema
### Descripción
La empresa SPM tecnologias en instalacion, esta en busca de un software que le permita llevar adelante la gestion de sus empleados y flota de vehiculos, actualemnte se vienen manejando con un archivo de excel, necesitan poder controlar los tecnicos, las tareas cumplidas por cada tecnico y por cada movil d cada movil esta compuesto de 2 o mas tecnicos.
A la hora de pagar los sueldos,  se parte de un basico por categoria y varia segun el horario de cumplimiento de tareas adicionales, ya que se paga un extra por produccion. Se desea tener una liquidacion mensual  por cada tecnico

### Modelo
<html>
<img src="https://github.com/gaaston14/TP_CertificacionDeTareas/blob/main/adicionales/modelo_preliminar.jpeg">
</html>

## Alcance Funcional 



### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tecnicos<br>2. CRUD Tareas<br>3. CRUD Grupos|
|CRUD dependiente|1. CRUD preciotareas {depende de} CRUD tareas<br>2. CRUD grupos_tecnicos {depende de} CRUD tecnicos|
|Listado<br>+<br>detalle| 1. Listado de grupos y tecnicos corepondiendo a que grupo pertenece cada tecnico en un momento dado => detalle CRUD grupos_tecnicos<br> 2. Listado de tareas realizado por un tecnico, en un momento especifico dando el precio de dicha tareas en ese momento dado, junto con que grupo pertenecia en ese moemnto => detalle muestra datos completos de cada tareas realizada por un tecnico en un periodo de tiempo
|CUU/Epic|1. Registrar nueva tarea realizada<br>2. Registrar un nuevo tecnico|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD tareas<br>2. CRUD grupos_tareas<br>3. CRUD grupos<br>4. CRUD preciostareas<br>5. CRUD tecnicos<br>6. CRUD grupostecnicos<br>7. CRUD usuarios|
|CUU/Epic|1. Registrar nueva tarea realizada<br>2. Registrar un nuevo tecnico<br>3. Asignar un tecnico a un grupo|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listar grupos<br>2. Listar tecnicos<br>3. Listar tareas<br>4. Listar porecio de tareas |
|CUU/Epic|1. registrar nueva tarea<br>2. modificar precio de una tarea<br>3. modificar composicion de un grupo<br>4. Alta de nuevo grupo|
|Otros|1. Mostrar estadisticas en la partalla inicial de mayor porcentaje de tareas realizadas y grupo y/o tecnico con mas tareas realizadas en el ultimo mas|

