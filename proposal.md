# Propuesta TP DSW

## Grupo
### Integrantes

* 52154 - Gugliermino Zuñiga, Carlos Ricardo
* 52451 - Pedemonte, Nicolás
* 52325 - Trincavelli, Luca
* 53110 - Zariaga, Franco


### Repositorios
* [frontend app]([http://hyperlinkToGihubOrGitlab](https://github.com/carlex74/Front-End-DSW))
* [backend app]([http://hyperlinkToGihubOrGitlab](https://github.com/carlex74/Back-End-DSW))


## Tema
### Descripción

Desarrollaremos una plataforma de aprendizaje virtual. La solución consistirá en una página web con acceso a cursos donde los estudiantes podrán acceder, examinar recursos y realizar actividades.

### Modelo
[link del modelo](https://drive.google.com/file/d/1le9JNA73D_ulgn7CgIJh6w_V4lcplNSn/view?usp=sharing)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Alumnos<br>2. CRUD Instructores<br>3. CRUD Tipos de Cursos<br>4. CRUD Instituciones|
|CRUD dependiente|1. CRUD Cursos {depende de} CRUD Tipos de Cursos e Instructores<br>2. CRUD Solicitud {depende de} CRUD Instructor|
|Listado<br>+<br>detalle|1. Listado de cursos filtrado por nombre, institución, instructor y tipo de curso => detalle Información de los contenidos<br>2. Listado de solicitudes filtrado por fecha de solicitud => detalle Texto de la Solicitud|
|CUU/Epic|1. Crear un curso nuevo para ser publicado en la plataforma<br>2. Habilitar cuenta del Instructor|



Adicionales para Aprobación

|Req|Detalle|
|:-|:-|
|CRUD|1. CRUD Alumnos<br>2. CRUD Instructores<br>3. CRUD Tipos de Cursos<br>4. CRUD Instituciones<br>5. CRUD Cursos<br>6. CRUD Foros<br>7. CRUD Novedades<br>8. CRUD Actividades<br>9. CRUD Tareas<br>10. CRUD Material<br>11. CRUD Solicitudes<br>12. CRUD Reporte<br>13. CRUD Tipo Reporte<br>14. CRUD Tipos de Novedad|
|CUU/Epic|1. Matricularse a un curso nuevo para ser publicado en la plataforma<br>2. Publicar actividad en el curso para los alumnos<br>3. Asignar tareas a los alumnos del curso<br>4. Corregir tareas entregadas por los alumnos|



### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados|1. Listado de descripción tipo de reporte<br>2. Listado de cursos con reportes => detalle desestimar o dar de baja|
|CUU/Epic|1. Dar de baja un curso<br>2. Publicar Material<br>3. Reportar Curso<br>4. Publicar mensaje en Foro<br>5. Resolver actividades<br>6. Publicar Novedad|
|Otros|1. Envío de recordatorio de vencimiento de tareas por mail|

