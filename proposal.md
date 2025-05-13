# Propuesta TP DSW

## Grupo
### Integrantes
44946 Martinez Jorge<br>
51512 Rossi Lisandro<br>
44094 Ponce Micaela<br>


### Repositorios
* Frontend
* Backend


## Tema
Software para implementar en un sanatorio
### Descripción
Esta aplicacion web buscará facilitar el orden de los datos, la generacion de turnos, y resolucion de consultas generales tanto para usuarios finales como para el personal interno
Esta aplicacion contará con los listados y la informacion de usuarios, pacientes, profesionales, horarios y obras sociales entre otros.


### Modelo
![imagen del modelo]()

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1.Especialidad Médica<br>2. Obra Social<br>3. Estado de Turno|
|CRUD dependiente|1.CRUD Profesional {depende de} CRUD Especialidad Médica <br>2. CRUD Paciente {depende de} CRUD Obra Social<br> CRUD Practica {depende de} CRUD Profesional y CRUD Obra Social<br>CRUD Turno {depende de} CRUD Estado de turno|
|Listado<br>+<br>detalle| 1. Listado de turnos disponibles filtrado por especialidad<br> 2. Listado de profesionales filtrado por rango horario y por especialidad|
|CUU/Epic|1. Solicitud de turno<br>2.Modificacion/cancelacion de turno|



Adicionales para Aprobación
Atencion
Notificacion mail wp

### Alcance Adicional Voluntario

