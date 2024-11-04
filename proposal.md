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
El sistema a desarrollar consiste en la presentación de cursos online orientados al desarrollo de sistemas de información que permite el inicio de sesión y el registro de usuarios. Los usuarios podrán inscribirse a un curso mediante formularios y un profesor podrá postularse a dar clases virtuales en el curso. Los cursos tendrán un parcial y un trabajo práctico que deberán ser aprobados para poder conseguir la certificación del curso.

### Modelo
![imagen del modelo]()
https://drive.google.com/drive/folders/17aejEDyp7ZbN4p7J21DdS0g-YX2c3g3c?usp=sharing
*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Alumno<br>2. CRUD Profesor<br>3. CRUD Curso<br>4. CRUD Parcial|
|CRUD dependiente|1. CRUD Curso {depende de} CRUD Tipo <br>2. CRUD Curso {depende de} CRUD TP|
|Listado<br>+<br>detalle| 1. Listado de Cursos filtrado por Tipo , muestra identificador, nombre, tipo y descripcion => detalle CRUD Curso<br> 2. Listado de Profesores filtrado por id, muestra nombre_y_apellido, mail, telefono e id => detalle muestra datos completos de Profesor|
|CUU/Epic|1. Seleccionar un curso para la inscripcion<br>2. Ingresar entrega del parcial|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Alumno<br>2. CRUD Profesor<br>3. CRUD Curso<br>4. CRUD Parcial<br>5. CRUD Certificado<br>6. CRUD TP<br>7. CRUD Respuesta<br>8. CRUD Inscripcion<br>9. CRUD Tipo|
|CUU/Epic|1. Seleccionar un curso para la inscripcion<br>2. Filtrar por profesor <br>3. Entregar TP<br>4.Ingresar entrega del parcial|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

