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
Desarrollo de un sistema de campus virtual para colegio secundario el cual cuenta con: módulo de gestión administrativa para inscripción de alumnos/docentes y control de los demás apartados, repositorio educativo donde docentes publican material de estudio organizado por materias, plataforma para entrega de actividades, evaluaciones, registro de calificaciones y asistencias, foros, trámites y avisos con accesos personalizados según el rol del usuario (alumno, docente o personal administrativo).

### Modelo
![imagen del modelo]()

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Materia<br>2. CRUD Alumno<br>3. CRUD Docente<br>4. CRUD Curso|
|CRUD dependiente|1. CRUD Evaluación {depende de CRUD Materia}<br>2. CRUD Inscripción {depende de CRUD Alumno y CRUD Curso}|
|Listado<br>+<br>detalle| 1. Listado de Alumnos filtrado por Curso, muestra nombre, apellido, curso => detalle CRUD Alumno<br> 2. Listado de Evaluaciones filtrado por Materia, muestra título, fecha, alumno, nota => detalle CRUD Evaluación|
|CUU/Epic|1. Registrar Asistencia de Alumnos<br>2. Gestionar Calificaciones de Evaluaciones|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Personal<br>2. CRUD Dictado {depende de CRUD Materia, CRUD Curso y CRUD Docente}<br>3. CRUD Material de Estudio {depende de CRUD Materia}<br>4. CRUD Foro<br>5. CRUD Aviso|
|CUU/Epic|1. Generar Certificados Digitales con verificación<br>2. Realizar Inscripción de Alumno a Año en lote|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de Alumnos con Mejor Rendimiento Académico <br>2. Listado de Docentes con Mayor Cantidad de Consultas Resueltas en Foros|
|CUU/Epic|1. Sistema de Notificaciones Personalizadas<br>2. Implementar Sistema de Logros para Alumnos|
|Otros|1. Integración con Plataforma de Videoconferencias para Clases Virtuales|

