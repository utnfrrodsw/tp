# Propuesta TP DSW

## Grupo
### Integrantes
* 51322 - Cilfone, Angel
* 50306 - Bay, Victoria
* 47658 - Bianchi, Ignacio

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)

## Tema
### Descripción
La aplicación se encargará de registrar rutinas de entrenamiento, y poder llevar un registro de los ejercicios que componen la rutina, para poder realizar reportes de los mismos. Esto se llevará a cabo registrando diariamente los ejercicios que se efectuan. También habrá una distinción entre usuarios y usuarios premium que tendrán distintos alcances dentro del sistema.


### Modelo
* [imagen del modelo](https://drive.google.com/file/d/1CvWQCOFsQmFGEMB5W5I2u1GV7GiX4tc1/view?usp=sharing)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Rutina<br>3. CRUD Grupo muscular<br>4. CRUD Dato Ejercicio|
|CRUD dependiente|1. CRUD Ejercicio {depende de} CRUD Grupo muscular <br>2. CRUD Información Ejercicio {depende de} CRUD Rutina {y depende de} CRUD Ejercicio |
|Listado<br>+<br>detalle| 1. Listado de ejercicios filtrado por grupo muscular<br> 2. Listado de ejercicios filtrados por día|
|CUU/Epic|1. Registrar ejercicios dentro de una rutina<br>2. Registrar ejercicios pertenecientes a una rutina realizados por día|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Programa<br>2. CRUD Usuario Programa<br>3. CRUD Usuario<br>4. CRUD Rutina<br>5. CRUD Dato Ejercicio<br>6. CRUD Ejercicio<br>7. CRUD Grupo Muscular<br>8. CRUD Informacion Ejercicio|
|CUU/Epic|1. Registrar ejercicios dentro de una rutina<br>2. Registrar ejercicios pertenecientes a una rutina realizados por día<br>3. Registrar rutinas dentro de un Programa<br>4. Visualizar rutinas filtradas por programa|
