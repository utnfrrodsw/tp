# Propuesta de Trabajo Práctico - Desarrollo de Software - Plataforma digital de gestión académica para institutos secundarios

## Grupo
### Integrantes
* 50851 - Achares, Jonatan Francisco Angel (Com304-2025)
* 52858 - Correa, Martiniano León (Com304-2025)
* 53109 - Lopez, Evelyn Milagros (Com301-2025)
* 52572 - Varrenti, Lara (Com304-2025)

### Repositorios
* [frontendapp_tpGS](https://github.com/MartinianoLeonCorrea/frontendapp_tpGS.git)
* [backendapp_tpGS](https://github.com/MartinianoLeonCorrea/backendapp_tpGS.git)

## Tema
### Descripción
Proponemos desarrollar una plataforma digital para institutos secundarios que este conformada por: un sector de gestión administrativa para la inscripción de alumnos y control de más apartados, un repositorio disponible en donde docentes publiquen material de estudio organizado por materias, un sector para la entrega de actividades, registros de calificaciones y asistencias de los alumnos, foros para cada materia, y avisos generales, todo esto con accesos personalizados según el rol que tenga el usuario (puede ser alumno, docente o personal administrativo).

### Modelo
![Image](https://github.com/user-attachments/assets/8f86117f-ce58-475f-8b83-0fd159e40d0b)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Materia<br>2. CRUD Alumno<br>3. CRUD Docente<br>4. CRUD Curso|
|CRUD dependiente|1. CRUD Dictado {depende de CRUD Materia, CRUD Curso y CRUD Docente}<br>2. CRUD Examen {depende de CRUD Dictado y CRUD Docente}|
|Listado<br>+<br>detalle| 1. Listado de Alumnos filtrado por Curso, muestra nombre, apellido, curso => detalle CRUD Alumno y CRUD Curso<br> 2. Listado de Examenes filtrado por Materia, muestra fecha, temas, docente, notas de alumnos => detalle CRUD Examen y CRUD Dictado|
|CUU/Epic|1. Registrar Asistencias de cada Alumno del Curso<br>2. Registrar Notas de Exámenes de cada Alumno|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Personal<br>2. CRUD TrayectoriaEscolar {depende de CRUD Curso y CRUD Alumno}<br>3. CRUD Material {depende de CRUD Materia}<br>4. CRUD Foro {depende de CRUD Materia}<br>5. CRUD Aviso {depende de CRUD Personal}|
|CUU/Epic|1. Generar Certificados Digitales con verificación<br>2. Realizar Inscripción de Alumno a Año en lote|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de Alumnos con Mejor Rendimiento Académico <br>2. Listado de Docentes con Mayor Cantidad de Consultas Resueltas en Foros|
|CUU/Epic|1. Sistema de Notificaciones Personalizadas<br>2. Implementar Sistema de Logros para Alumnos|
|Otros|1. Integración con Plataforma de Videoconferencias para Clases Virtuales|

