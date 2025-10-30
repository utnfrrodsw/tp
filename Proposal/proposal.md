# Propuesta TP DSW

## Grupo
### Integrantes
51512 Rossi Lisandro<br>



### Repositorios
* Frontend
* https://github.com/Jorgemtzz98/tp_martinez.cordoba.rossi.ponce/tree/rama-prueba/client
* Backend
* https://github.com/Jorgemtzz98/tp_martinez.cordoba.rossi.ponce/tree/rama-prueba/server


## Tema
Software para implementar en un sanatorio
### Descripción
Esta aplicacion web buscará facilitar el orden de los datos, la generacion de turnos, y resolucion de consultas generales tanto para usuarios finales como para el personal interno
Esta aplicacion contará con los listados y la informacion de usuarios, pacientes, profesionales, horarios y obras sociales entre otros.


### Modelo
![MODELOS-DER drawio]<img width="802" height="539" alt="image" src="https://github.com/user-attachments/assets/e50eaedd-7e2c-44bb-bf01-1b6e58cbc008" />
)


## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1.Especialidad Médica<br>2. Obra Social<br>
|CRUD dependiente|1.CRUD Profesional {depende de} CRUD Especialidad Médica <br>2. CRUD Paciente {depende de} CRUD Obra Social<br> CRUD Turno {depende de} CRUD Paciente y de Crud {Profesional}|
|Listado<br>+<br>detalle| 1. Listado de profesionales filtrado por especialidad|
|CUU/Epic|1. Solicitud de turno<br>2.Modificacion/cancelacion de turno|



Adicionales para Aprobación
Atencion
Notificacion mail wp

### Alcance Adicional Voluntario

