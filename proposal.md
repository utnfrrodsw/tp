# Propuesta TP DSW

## Grupo
### Integrantes
* 51454 - Arfuso, Maria de los Angeles
* 51752 - Maurutto, Francesca
* 50473 - Diodati, Regina
* 50353 - Mansilla, Delfina

### Repositorios
* [frontend app](https://github.com/franmaurutto/frontend_dsw.git)
* [backend app](https://github.com/franmaurutto/backend_dsw)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
El sistema a desarrollar consiste en la presentación de cursos online orientados al desarrollo de sistemas de información que permite el inicio de sesión y el registro de usuarios. Los usuarios podrán inscribirse a un curso y un profesor podrá postularse a dar clases virtuales en el curso. Los cursos tendrán un parcial y un trabajo práctico que deberán ser aprobados para poder conseguir la certificación del curso.

### Modelo
https://drive.google.com/drive/folders/17aejEDyp7ZbN4p7J21DdS0g-YX2c3g3c?usp=sharing
*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Alumno<br>2. CRUD Profesor<br>3. CRUD Curso<br>4. CRUD Material|
|CRUD dependiente|1. CRUD Inscripcion {depende de} CRUD Curso y CRUD Alumno <br>2. CRUD RtaTp {depende de} CRUD Inscripcion y CRUD Tp <br>3. CRUD RtaParcial {depende de} CRUD Inscripcion y CRUD Parcial <br>4. CRUD Certificado {depende de} CRUD Inscripcion <br>5. CRUD Tp {depende de} CRUD Curso <br>6. CRUD Parcial {depende de} CRUD Curso|
|Listado<br>+<br>detalle| 1. Listado de Cursos, muestra nombre y descripcion => detalle CRUD Curso<br> 2. Listado de Materiales, muestra descripcion y titulo => detalle CRUD Material|
|CUU/Epic|1. Inscribirse a un Curso como Alumno<br>2. Dar de alta un Curso como Profesor|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Alumno<br>2. CRUD Profesor<br>3. CRUD Curso<br>4. CRUD Parcial<br>5. CRUD Certificado<br>6. CRUD TP<br>7. CRUD RtaParcial<br>8. CRUD Inscripcion<br>9. CRUD RtaTP|
|CUU/Epic|1. Seleccionar un curso para la inscripcion<br>2. Crear cuenta en el programa<br>3. Realizar un parcial de un curso del alumno<br>4. Emitir un Certificado de un Alumno en un Curso por el Profesor|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de los certificados emitidos del alumno logueado<br> 2. Listado de los alumnos inscriptos de un curso del profesor logueado <br> 3. Listado de todos los cursos del profesor logueado <br>4. Listado de los cursos a los que el alumno logueado esta inscripto <br>5. Listado de todos los cursos que el alumno logueado puede inscribirse <br>6. Listado de las Rtas de los TPs del curso seleccionado del profesor logueado <br>7. Listado de las Rtas del Parcial del curso seleccionado del profesor logueado <br>8. Listado de los materiales sin asignar a ningun curso <br>9. Listado de los materiales de un curso seleccionado del profesor <br>10. Listado de todos los materiales |
|CUU/Epic|1. Generar una Rta TP del curso seleccionado por el alumno logueado <br> 2. Generar el Parcial del curso seleccionado del profesor logueado <br>3. Generar el TP del curso seleccionado del profesor logueado <br>4. Asociar Materiales a un curso del profesor logueado <br>5. Generar un listado de todos los Certificados <br> 6. Cambiar contraseña del usuario loguedo (implementando encriptacion)<br> 7. Genarar nuevos Materiales|

