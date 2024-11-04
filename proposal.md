# Propuesta TP DSW

## Grupo
### Integrantes
- 50838 Guastoni Belén
- 48790 Mestre Federico

### Repositorios
* [fullstack_app] = https://github.com/FedeeMest/fullstack_app_FB


## Tema
### Descripción
Nuestro grupo va a enfocar el Trabajo Practico en crear un Sistema de administracion Estudiantil (Sysacad) con todas las funciones que esto conlleva como: 

- Poder ver un listado de alumnos.
- Poder ver un listado de materias.
- Poder revisar información personal y modificarla.
- Poder ver un listado de las inscripciones de cada alumno.
- Poder modificar la información de la materia.
- Poder agregar/eliminar un alumno.
- Poder agregar/eliminar una materia.
- Poder agregar/eliminar una inscripción, con un alumno y una materia.
- Poder modificar información de la inscripción. 
- Poder ver el plan de estudio con las materias que el alumno puede cursar según cada caso.
- Poder ver un listado de alumnos filtrados por plan.
- Poder ver un listado de materias filtrado por modalidad.
- Poder buscar un alumno por legajo.

   
### Diagrama de clase
![Modelo de Clase - Sysacad drawio](https://github.com/user-attachments/assets/06dc6243-bf84-40a5-bb41-3ac78a15446a)

## Alcance Funcional


### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Alumno<br>2. CRUD Materia<br>
|CRUD dependiente|1. CRUD Inscripcion {depende de} CRUD Alumno y CRUD Materia<br>
|Listado<br>+<br>detalle| 1. Listado general de alumnos con la opcion de filtar por plan=> muestra todos los alumnos con la posibilidad de realizar estas acciones Editar, Eliminar, Ver Info<br> 2. Listado de materias en las cuales se puede inscribir el alumno<br> 3. Listado general de materias con la opcion de filtar por modalidad => muestra todos las materias con la posibilidad de realizar estas acciones Editar, Eliminar|
|CUU/Epic|1. Incribirse a materia<br>2. Ver inscripciones actuales|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1.<br>|
|CUU/Epic|1.|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1.|2.|
|CUU/Epic|1.|
|Otros|1.|

