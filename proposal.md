# TP-DSW-2024
# Propuesta TP DSW

## Grupo
### Integrantes
* 50979 - María Clara Genovese
* 50977 - Pennice Lucas Agustin
* 50235 - Bruno Pacienzia

### Repositorios
* [frontend app](https://github.com/LucasPennice/TP-DSW-FRONT.git)
* [backend app](https://github.com/LucasPennice/TP-DSW-BACK.git)

## Tema
### Descripción
Servicio para calificar la experiencia con el docente en distintas asignaturas de la carrera de sistemas de la UTN Rosario. Ademas se permite la lectura de estas calificaciones a cualquier alumno inclusive sin estar registrado, para ayudarlo a tomar una mejor decision a la hora de inscribirse a las asignaturas de la carrera

### Modelo
https://drive.google.com/file/d/1UcI-ij5VLGGac8pcb68SJeKOiIXGjUic/view

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Area<br>2. CRUD Usuario<br>3. CRUD Profesor|
|CRUD dependiente|1. CRUD Review {depende de} CRUD cursado y CRUD usuario <br>2. CRUD Materia {depende de} CRUD Area <br>3. CRUD Cursado {depende de} CRUD Materia y CRUD Profesor|
|Listado<br>+<br>detalle| 1. Listado de profesores filtrado por nombre => Detalle Profesor <br> 2. Listado de reviews filtrado por peor puntuación => Detalle Review
|CUU/Epic|1. Escribir una review<br>2. Notificar al usuario cuando su review es eliminada por un moderador|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Area<br>2. CRUD Usuario<br>3. CRUD Profesor<br>4. CRUD Review<br>5. CRUD Materia<br>6. CRUD Cursado<br>|
|CUU/Epic|1. Escribir una review<br>2. Recibir notificación cuando una review es eliminada por un moderador<br>3. Registrarse<br>|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados|1. Listado de reviews filtrado por mejor puntuación => Detalle Review|
|CUU/Epic|1. Censurar reviews que contengan malas palabras <br>|



