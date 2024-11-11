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
|CRUD simple|1. CRUD Alumno<br>2. CRUD Profesor<br>3. CRUD Curso<br>4. CRUD Inscripcion|
|CRUD dependiente|1. CRUD Inscripcion {depende de} CRUD Curso y CRUD Alumno <br>2. CRUD RtaTp {depende de} CRUD Inscripcion y CRUD Tp|
|Listado<br>+<br>detalle| 1. Listado de Cursos, muestra nombre y descripcion => detalle CRUD Curso<br> 2. Listado de Certificados filtrado por Inscripcion, muestra nombreCompleto Alumno, nombre de Curso, descripcion Certificado, fechaEmision Certificado => detalle muestra datos completos de Certificado
|CUU/Epic|1. Seleccionar un curso para la inscripcion<br>2. Crear cuenta en el programa|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Alumno<br>2. CRUD Profesor<br>3. CRUD Curso<br>4. CRUD Parcial<br>5. CRUD Certificado<br>6. CRUD TP<br>7. CRUD RtaParcial<br>8. CRUD Inscripcion<br>9. CRUD RtaTP|
|CUU/Epic|1. Seleccionar un curso para la inscripcion<br>2. Crear cuenta en el programa<br>3. Dar de alta un Curso siendo Profesor<br>4. Emititr un Certificado de un Alumno en un Curso por el Profesor|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

