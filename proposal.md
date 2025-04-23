# Propuesta TP DSW - Sistema de gestión general educativo nivel secundario

## Grupo
### Integrantes
* 50851 - Achares, Jonatan Francisco Angel
* 52858 - Correa, Martiniano León
* 53109 - Lopez, Evelyn Milagros
* 52572 - Varrenti, Lara

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)

## Tema
### Descripción
Desarrollo de una plataforma digital de gestión académica para instituciones de nivel secundario, que optimiza los trámites académicos y potencia la experiencia educativa de alumnos, docentes y personal administrativo mediante un entorno virtual interactivo y accesible.

### Modelo
![imagen del modelo]()

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Materia<br>2. CRUD Alumno<br>3. CRUD Docente<br>4. CRUD Curso|
|CRUD dependiente|1. CRUD Evaluación {depende de Materia y Alumno}<br>2. CRUD Asistencia {depende de Alumno y Curso}|
|Listado<br>+<br>detalle| 1. Listado de Alumnos filtrado por Curso, muestra nombre, apellido, curso => detalle CRUD Alumno<br> 2. Listado de Evaluaciones filtrado por Materia, muestra título, fecha, alumno, nota => detalle CRUD Evaluación|
|CUU/Epic|1. Registrar Asistencia de Alumnos<br>2. Gestionar Calificaciones de Evaluaciones|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Materia<br>2. CRUD Alumno<br>3. CRUD Docente<br>4. CRUD Curso<br>5. CRUD Evaluación {depende de Materia y Alumno}<br>6. CRUD Asistencia {depende de Alumno y Curso}<br>7. CRUD Personal<br>8. CRUD Material de Estudio {depende de Materia}<br>9. CRUD Foro<br>10. CRUD Aviso|
|CUU/Epic|1. Registrar Asistencia de Alumnos<br>2. Gestionar Calificaciones de Evaluaciones<br>3. Generar Certificados de Alumno Regular<br>4. Gestionar Trámites de Cambio de Curso|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de Alumnos con Mejor Rendimiento Académico <br>2. Listado de Docentes con Mayor Cantidad de Consultas Resueltas en Foros|
|CUU/Epic|1. Sistema de Notificaciones Personalizadas<br>2. Generación de Informes Estadísticos de Rendimiento Académico<br>3. Implementar Sistema de Logros para Alumnos|
|Otros|1. Integración con Plataforma de Videoconferencias para Clases Virtuales|

