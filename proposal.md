# Propuesta TP DSW

## Grupo
### Integrantes
- 50383 Guastoni Belén
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
  
Del lado del Profesor/Admin:
- Subir notas ed alumnos a sus respectivos legajos
- editar sus comisiones comisiones (agregar/borrar alumnos maunalmente)
- 

   

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD estudiante<br>2. CRUD curso<br>
|CRUD dependiente|1. CRUD clasificacion {depende de} CRUD estudiante<br>
|Listado<br>+<br>detalle| 1. Listado de habitaciones filtrado por tipo de habitación, muestra nro y tipo de habitación => detalle CRUD Habitacion<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de habitación, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

