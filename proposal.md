# Propuesta TP DSW

## Grupo
### Integrantes
48952- Franco Natalia Belen
49082- Abele Federico
50194 - Zallocco Emilio


### Repositorios
* [frontend app](https://github.com/EmilioZallocco/frontend-app)
* [backend app](https://github.com/EmilioZallocco/Backend-app)


## Tema
### Descripción
Proponemos elaborar una página para solicitar y reservar turnos médicos en la cual se van a poder registrar todos los doctores que atiendan con sus respectivos horarios de consulta y cargar todos los pacientes para así también registrarlos en el calendario.

### Modelo
![image](https://github.com/EmilioZallocco/tp/assets/129116072/ddd3138e-5347-4f61-aee6-1d7d2776c0b4)


*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Paciente<br>2. CRUD Medico<br>3. CRUD Paciente|
|CRUD dependiente|1. CRUD ObraSocial{depende de} CRUD Medico<br>2. CRUD Horarios {depende de} CRUD Medico |
|Listado<br>+<br>detalle| 1. Listado de turnos del medico, muestra nombre medico y turnos <br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de turno, fecha inicio, estado y nombre del paciente |
|CUU/Epic|1.Reservar turno para un determinado medico<br>2. Cancelar Turno|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Paciente<br>2. CRUD tipoConsulta<br>3. CRUD ObraSocial{depende de} CRUD Medico<br>4. CRUD Medico<br>5. CRUD Horarios {depende de} CRUD Medico<br>6. CRUD Turno<br>|
|CUU/Epic|1.Reservar turno para un determinado medico<br>2. Cancelar Turno<br>3. Consultar horario del turno con mail o dni|
