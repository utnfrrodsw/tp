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
- Poder ver un listado de alumnos filtrados por plan.
- Poder ver un listado de materias filtrado por modalidad.
- Poder buscar un alumno por legajo.

   
### Diagrama de clase
![image](https://github.com/user-attachments/assets/fa6ed897-d438-490d-8ada-d6b80354b818)


## Alcance Funcional


### Alcance 

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Admin<br>2. CRUD Alumno<br>3.Materia<br>
|CRUD dependiente|1. CRUD Inscripcion {depende de} CRUD Alumno y CRUD Materia<br>
|Listado<br>+<br>detalle| 1. Listado general de alumnos con la opcion de filtar por plan=> muestra todos los alumnos con la posibilidad de realizar estas acciones Editar, Eliminar, Ver Info<br> 2. Listado de materias en las cuales se puede inscribir el alumno<br> 3. Listado general de materias con la opcion de filtar por modalidad => muestra todos las materias con la posibilidad de realizar estas acciones Editar, Eliminar|
|CUU/Epic|1. Incribirse a materia<br>2. Ver inscripciones actuales<br>3. Crear un usuario <br>4. Cambiar contraseña/ Editar usuario|

