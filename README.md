# Proposal - Plataforma digital de gestión académica para institutos secundarios

## Grupo
### Integrantes
* 50851 - Achares, Jonatan Francisco Angel (Com304-2025)
* 52858 - Correa, Martiniano León (Com304-2025)
* 52572 - Varrenti, Lara (Com304-2025)

### Repositorios
* [frontendapp_tpGS](https://github.com/MartinianoLeonCorrea/frontendapp_tpGS.git)
* [backendapp_tpGS](https://github.com/MartinianoLeonCorrea/backendapp_tpGS.git)

### Descripción
Desarrollamos una plataforma digital intuitiva y segura para institutos secundarios, diseñada para optimizar la gestión académica diaria. La aplicación se centra en la inscripción y gestión de alumnos, la organización de cursos y dictados de materias, y la administración de exámenes y calificaciones, con accesos personalizados según el rol del usuario (alumno o docente). Entre sus funcionalidades destacamos el acceso a un calendario interno con exámenes y eventos próximos propios del usuario, un foro como esapacio de consultas y avisos que compartirán entre el docente y sus alumnos, y todo esto sumado a las funcionalidades elementales ya mencionadas logran facilitar la operación diaria de la escuela, reducir el papeleo y mejorar la comunicación entre docentes y alumnos.  
Más info y documentación [aquí](https://github.com/MartinianoLeonCorrea/tpGestionSecundaria/blob/main/docs/README.md).

### Modelo

![Image](https://github.com/user-attachments/assets/c214f1c4-c348-4990-a633-889df2340521)


## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Materia<br>2. CRUD Persona<br>3. CRUD Curso|
|CRUD dependiente|1. CRUD Dictado {depende de CRUD Materia, CRUD Curso y CRUD Persona}<br>2. CRUD Examen {depende de CRUD Dictado y CRUD Persona}<br>2. CRUD Evaluación {depende de CRUD Exámen y CRUD Persona}|
|Listado<br>+<br>detalle| 1. Listado de Alumnos filtrado por Curso, muestra nombre, apellido, curso => detalle CRUD Alumno y CRUD Curso<br> 2. Listado de Examenes filtrado por Materia, muestra materia, fecha, temas, docente, notas de alumnos => detalle CRUD Examen y CRUD Dictado|
|CUU/Epic|1. Anotar alumno a un Curso<br>2. Registrar Notas de Exámenes de cada Alumno|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Material {depende de CRUD Materia}<br>2. CRUD Foro {depende de CRUD Materia}<br>3. CRUD Aviso {depende de CRUD Persona}|
|CUU/Epic|1. Generar Certificados Digitales con verificación<br>2. Realizar Inscripción de Alumno a Año en lote|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de Alumnos con Mejor Rendimiento Académico <br>2. Listado de Docentes con Mayor Cantidad de Consultas Resueltas en Foros|
|CUU/Epic|1. Sistema de Notificaciones Personalizadas<br>2. Implementar Sistema de Logros para Alumnos|
|Otros|1. Integración con Plataforma de Videoconferencias para Clases Virtuales|

