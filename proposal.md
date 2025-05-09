# Propuesta TP DSW

## Grupo
### Integrantes
44946 Martinez Jorge<br>
50992 Cordoba Lucía<br>
51512 Rossi Lisandro<br>
44094 Ponce Micaela<br>


### Repositorios
* Frontend
* Backend


## Tema
Software para implementar en un sanatorio
### Descripción
*2 a 6 líneas describiendo el negocio (menos es más)*
Esta aplicacion web buscará facilitar el orden de los datos, la generacion de turnos, y resolucion de consultas generales tanto para usuarios finales como para el personal interno
Esta aplicacion contará con los listados y la informacion de usuarios, pacientes, profesionales, horarios y obras sociales entre otros.


### Modelo
![imagen del modelo]()

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1.Especialidad medica<br>2. obra social<br>3. estado de turno|
|CRUD dependiente|1.CRUDprofesional {depende de} CRUDespecialidad <br>2. CRUDPaciente depende de CRUD_Obra_social<br>CRUD_Practica depende de CRUD_Profesional y CRUD_Obra_social<br>CRUD_Turno depende de CRUD_Estado_de_turno|
|Listado<br>+<br>detalle| 1. Listado de turnos disponibles filtrado por especialidad<br> 2. Listado de profesionales filtrado por rango horario y por especialidad|
|CUU/Epic|1. Solicitud de turno<br>2.Modificacion/cancelacion de turno|



Adicionales para Aprobación
Atencion
Notificacion mail wp

### Alcance Adicional Voluntario

