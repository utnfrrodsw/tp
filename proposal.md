# Propuesta TP DSW

## Grupo
### Integrantes
- 50838 Guastoni Belén
- 48790 Mestre Federico

### Repositorios
* [fullstack_app] = https://github.com/FedeeMest/fullstack_app_FB


## Tema
### Descripción
Nuestro grupo va a enfocar el Trabajo Practico en crear un Sistema de administracion Estudiantil (Sysacad) con todas las funciones que esto conlleva como: 

Del lado del Alumno:
- Inscripcion a cursado/finales (poder filtar por materias con las que se cumplen los requisitos para cursar)
- Poder revisar informacion personal/Solicitar modificacion
- Tener acceso a la libreta virtual con sus respectivas notas.
- Solicitar turnos para realizar tramites de forma presencial
- Acceso al calendario academico.
- Poder solicitar acceso al certificado Regularidad
- Poder ver el plan de estudio con las materias que el alumno puede cursar según cada caso
  
Del lado del Profesor/Admin:
- Subir notas ed alumnos a sus respectivos legajos
- editar sus comisiones comisiones (agregar/borrar alumnos maunalmente)
- Subir/modificar notas parciales/finales de alumnos
- Subir regularidades/promocion
- Ver listado de comisiones con alumnos
- Cambiar contraseña
- Ver calendario academico 2024

   
### Diagrama de clase
![Modelo de Clase - Sysacad drawio](https://github.com/FedeeMest/TP-DSW-FB/assets/166263224/c0d24bd8-d1d1-4e94-ae31-75424767660c)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD alumno<br>2. CRUD profesor<br>
|CRUD dependiente|1. CRUD final {depende de} CRUD alumno<br>
|Listado<br>+<br>detalle| 1. Listado de finales realizador por un alumno => muestra todos los finales (con detalles) de la colección "calificaciones" de la clase alumno<br> 2. Listado de materias en las cuales se puede inscribir ele alumno dependiendo del estado academico en el que se encuentr, mostrando todas las materias, y en las cuales no se puede incribir mostrar el motivo|
|CUU/Epic|1. Incribirse a materia<br>2. Ver calificaciones actuales|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Estado_acad<br>2. CRUD Inscripción<br>3. CRUD Horario<br>4. CRUD Plan<br>|
|CUU/Epic|1. Update del estado academico del alumno<br>2. Realizar una inscripcion<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Inscripciones filtradas por alumno muestra a cuantos examenes finales se inscribio al alumno ingresando dos fechas|
|CUU/Epic|1. Inscribirse a examen/cursado<br>2. Cancelación de inscripción|
|Otros|1. Envío de recordatorio de examen por email al alumno 48hs. antes de la fecha|

