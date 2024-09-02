# Desarrollosoftware

# Propuesta TP DSW

## Grupo
### Integrantes
* 50691 - Lentini, Julian Pablo
* 51185 - Giampani, Ciro Sebastián
* 51120 - Etchecopar, Olivia Martina	
* 51181 - Cruz Ponce, Juan Manuel

## Tema
### Descripción
La idea de nuestro proyecto es realizar un sistema donde se pueda realizar tanto la atención ambulatoria como la de internados de un Sanatorio.

### Repositorios
[Frontend]

[Backend](https://github.com/juanmacruzponce/back-end)

### Modelo
[Modelo de dominio](https://drive.google.com/file/d/1wBtKkQU4HKTCo5D8TnzRwU8Rvve_8nqg/view?usp=sharing)

## Alcance Funcional
Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD|1. CRUD Paciente<br>2. CRUD Medico<br>3. CRUD Ingreso<br>4. CRUD Especialidad<br>5. CRUD Turno|
|CRUD dependiente|1.CRUD Agenda(depende de) Medico<br>2.CRUD Informe(depende de Consulta)<br>3.CRUD Internacion(depende de) Sala y Paciente|
|Listado<br>+<br>detalle| 1. Listado de pacientes => detalle muestra listado de pacientes registrados en el sanatorio<br> 2. Listado de  Medicos=> detalle informa los medicos registrados <br> 3. Listado de informes de Historia clinica => detalle muestra los estudios realizados por paciente<br> 4. Listado de pacientes internados => detalle muestra los pacientes internados, con sus datos personales y fecha de ingreso<br> 5.Listado de turnos|
|CUU/Epic|1.Dar de alta paciente <br>2. Realizar la recepción de un paciente<br>3. Realizar el check-in y check-out de un paciente internado<br>4. Registrar informe de estudio medico|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Paciente<br>2. CRUD Medico<br>3. CRUD Ingreso<br>4. CRUD Especialidad<br>5. CRUD Turno<br>6. CRUD Agenda<br>7. CRUD Informe<br>8. CRUD Internacion|
|CUU/Epic|1.Dar de alta paciente <br>2. Realizar la recepción de un paciente<br>3. Realizar el check-in y check-out de un paciente internado<br>4. Registrar informe de estudio medico|


### Alcance Adicional Voluntario
Nota: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1.Listado de turnos de guardia|
|CUU/Epic|1. Solicita sobreTurno<br>|
|Otros|1. Envío de recordatorio de turno por email|**
