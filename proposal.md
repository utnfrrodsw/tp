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
[Frontend](https://github.com/julianlentini4/Frontend)

[Backend](https://github.com/julianlentini4/Backend)

### Modelo
![](https://github.com/olietchecopar/DSW-TP/blob/main/Diagrama%20Entidad%20Relacion.jpg)

## Alcance Funcional
Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD|1. CRUD Paciente<br>2. CRUD Medico<br>3. CRUD Ingreso<br>4. CRUD Usuario<br>5. CRUD Informe<br>6. CRUD Sala|
|CRUD dependiente|1. CRUD Paciente_Ingreso(depende de) Paciente e Ingreso<br>2. CRUD Internacion(depende de) Sala y Paciente|
|Listado<br>+<br>detalle| 1. Listado de pacientes => detalle muestra listado de pacientes registrados en el sanatorio<br>2. Listado de informe x Id|
|CUU/Epic|1.Dar de alta paciente<br>2. Realizar el check-in y check-out de un paciente internado<br>3. Registrar informe de estudio medico|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Paciente<br>2. CRUD Medico<br>3. CRUD Ingreso<br>4. CRUD Especialidad<br>5. CRUD Turno<br>6. CRUD Informe<br>7. CRUD Dia<br>8. CRUD Sala<br>9. CRUD Agenda<br>10. CRUD Paciente_Ingreso<br>11. CRUD Internacion<br>12. CRUD dia_agenda<br>13.CRUD Usuario|
|Listado<br>+<br>detalle| 1. Listado de pacientes => detalle muestra listado de pacientes registrados en el sanatorio<br> 2. Listado de  Medicos=> detalle informa los medicos registrados <br> 3. Listado de informes de Historia clinica => detalle muestra los estudios realizados por paciente<br> 4. Listado de pacientes internados => detalle muestra los pacientes internados, con sus datos personales y fecha de ingreso|
|CUU/Epic|1. Dar de alta paciente <br>2. Realizar la recepción de un paciente<br>3. Realizar el check-in y check-out de un paciente internado<br>4. Registrar informe de estudio medico<br>5. Registrar un turno segun agenda del medico|


### Alcance Adicional Voluntario
Nota: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1.Listado de turnos de guardia|
|CUU/Epic|1. Solicitar Turno de medico en guardia<br>|
|Otros|1. Envío de recordatorio de turno por email|**
