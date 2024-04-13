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
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

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
 
 <Aún no disponible>


### Alcance Adicional Voluntario
 
 <Aún no disponible>

