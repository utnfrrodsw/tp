# Propuesta TP DSW

## Grupo
### Integrantes
* 51606 - Jeandrevin, Kimey Luca
* 48095 - Conti, Luca
* 51018 - Ivanisky, Macarena
* 46478 - De Luca, Andres

### Repositorios
* [frontend app](https://github.com/AndresDL/frontendDsw)
* [backend app](https://github.com/KimeyJ/backendDsw)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
*Sistema de gestion de turnos para pacientes y gestion de historia clinica para medicos para una cadena de clinicas privadas*

### Modelo

[Modelo de dominio](https://drive.google.com/file/d/1kB5YwxpHew5Sf-Q79bhcs2jG9DTibmI6/view)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Clinica <br>2. CRUD Paciente <br> 3. CRUD Especialidad <br> 4. CRUD Medicamento <br> |
|CRUD dependiente|1. CRUD Medico {depende de} CRUD Especialidad<br>2. CRUD Ficha Clinica {depende de} CRUD Paciente|
|Listado<br>+<br>detalle| 1.Listado de medicos filtrados por su especialidad, muestra nombre, apellido, horarios de atencion, clinica y precio del turno &rarr; detalle muestra datos completos del medico y sus horarios de atencion <br> 2. Listado de turnos pendientes para un determinado medico &rarr; detalle CRUD Turno|
|CUU/Epic|1. Sacar un turno para un determinado medico<br>2. Mirar la historia clinica de un determinado paciente|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Persona<br>2. CRUD Paciente<br>3. CRUD Medico<br>4. CRUD Especialidad<br>5. CRUD Precio Especialidad<br>6. CRUD Clinica<br>7. CRUD Horario Atencion <br>8. CRUD Turno<br> 9. CRUD Ficha Clinica<br> 10. CRUD Historia Clinica <br>11. CRUD Medicamento<br> 12. CRUD Precio Medicamento|
|CUU/Epic|1. Sacar un turno para un detemirnado medico<br>2. Mirar la historia clinica de un determinado paciente<br>3. Registrar nueva especialidad<br> 4. Registrar nuevo medico|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Lista de medicamentos recetados para un mes determinado <br>2. Listado de medicos filtrados por clinica|
|CUU/Epic|1. Registrar nueva medicacion<br>2. Cancelación de turno|
|Otros|1. Envío de recordatorio de turno por email<br>2. Captcha para autenticar inicio de sesion|

