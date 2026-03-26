# TP-CURSOS

### Integrantes
* 47858 - Grau, Juan Bautista
* 49703 - Rozas, Alvaro Uriel

### Repositorios
* [frontend app](https://github.com/bautigr02/Frontend-Cursos.git)
* [backend app](https://github.com/bautigr02/Backend-Cursos.git)
  
## Tema: CURSOS

### Descripción
Un establecimiento educativo nos solicito el desarrollo de una pagina web para gestionar sus cursos. Esto le permitira a un alumno registrarse, inscribirse y obtener su estado en cada curso. A los docentes, crear y dictar cursos, asi como calificar a los alumnos de los mismos. Cada curso cuenta con talleres que se dictan a lo largo del curso, el promedio de la calificacion de un alumno en todos los talleres del curso, significara su calificacion en el curso (pudiendo esta ultima, ser modificada por el docente). El sistema deberá poder listar todos los cursos, talleres y alumnos, y permitir a los usuarios con acceso editarlos, añadir otros, o borrarlos.

![ImagenReadmeGithub](https://github.com/user-attachments/assets/7f867d6d-2950-446f-8ec4-a3aa1ba42590)

### Link a la pagina web: [curSoftware.vercel.app](https://cursoftware.vercel.app/)



### Modelo
![DER-TP-CURSOS-DER_TP_CURSOS drawio](https://github.com/user-attachments/assets/c90d92af-9848-4a05-b0ad-6dc3dbe43596)

Link al diagrama: https://drive.google.com/file/d/1WFVkDVlCbFTYmVaeQWR-5ikYedEHcG_6/view?usp=sharing

## Alcance Funcional 

|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Alumno<br>4. CRUD Curso<br>5. CRUD Taller<br>|
|CRUD dependiente|1. CRUD Taller {depende de} CRUD Curso<br>|
|Listado<br>+<br>detalle| 1. Listado de cursos ordenado por fecha de comienzo, muestra nombre y capacidad del curso => detalle CRUD Curso<br> 2. Listado de cursos a los que se inscribio un alumno, ordenado por fecha de inicio del curso, muestra nombre de curso, fecha inicio y fin del curso, nombre del usuario y fecha de inscripcion => detalle muestra datos de la inscripcion, del usuario y del curso|
|CUU/Epic|1. Registrar inscripcion a un curso.<br>2. Registrar inscripcion a un taller. <br> 3. Cancelar inscripcion a un curso.<br> 4. Cancelar inscripcion a un taller. <br> 5. Crear curso y sus talleres asociados. <br> 6. Cancelar curso y sus talleres asociados. <br> 7. Modificar curso/taller a dictar. <br> 8. Asignar nota de taller a alumno, y calcular automaticamente la nota de final de curso. <br> 9. Modificar nota de alumno en curso de forma manual por docente.|
|Listado| 1. Listado de talleres que se van a dictar o se estan dictando, ordenados alfabeticamente. <br> 2. Listado de cursos a dictar/dictandose por el docente. <br> 3. Listado de talleres a dictar/dictados por el docente. <br> 4. Listado de Alumnos inscriptos a un curso seleccionado. <br> 5. Listado de alumnos inscriptos a un taller seleccionado. <br> 6. Listado de historial de talleres dictados por el docente.|
|Otros|1. Read & Update Docente. <br>2. Read Aula. <br> 3. Generar Certificado para alumnos que hayan aprobado un curso. <br> 4. Alertas/Recordatorios a docente para cargar notas de talleres. <br> 5. Visualizacion dinamica de cupos por curso. <br>|
