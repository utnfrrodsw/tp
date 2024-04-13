# Propuesta TP DSW

## Grupo
### Integrantes
* 51466 - Alberti, Pedro
* 52049 - Consiglio, Micaela

### Repositorios
* [frontend app]
* [backend app]

## Tema
### Descripción
El sistema ofrece opciones para realizar sesiones de concentración con el método pomodoro, registra las horas diaras de concentración, tareas realizadas y lleva un registro. Con el mismo proporciona estadísticas acerca del progreso semanal y mensual.

### Modelo
![Modelo del Dominio](https://github.com/p-alberti/tp-dsw/blob/main/imgs/Modelo%20del%20Dominio.png)

Link al modelo: https://app.diagrams.net/#G1uw_iLKr0lDe7JdFsH4q5jJvmTuxUvr-2#%7B"pageId"%3A"C5RBs43oDa-KdzZeNtuy"%7D

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Tipo de Sesión<br>|
|CRUD dependiente|1. CRUD Sesión {depende de} CRUD Tipo Sesión<br>|
|Listado<br>+<br>detalle| 1. Listado de sesiones realizadas por un usuario filtradas por fecha o rango de fechas => detalle CRUD Sesión<br>|
|CUU/Epic|1. Realizar una Sesión<br>|


Adicionales para Aprobación:
 
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Tipo de Sesión<br>3. CRUD Sesiones<br>4. CRUD Categorías<br>5. CRUD Tareas<br>6. CRUD Estado<br>|
|CUU/Epic|1. Realizar una Sesión<br>2. Registrar usuario<br>|



### Alcance Adicional Voluntario
 
 <Aún no disponible>

