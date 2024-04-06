# Propuesta TP DSW

## Grupo
### Integrantes
* 51509 - Manavella, Enzo.
* 51035 - Parisi, Ramiro Daniel.
* 50819 - Sandivaras, Gonzalo Agustin.
* 50359 - Morresi, Facundo.
  

### Repositorios
* [frontend app](https://github.com/Ramiroparisi/Frontend-ConsultorioKinseiologia)
* [backend app](https://github.com/Morre21/Backend-ConsultorioKinesiologia)


## Consultorio de Kinesiología
### Descripción
El sistema constara de una interfaz facil de utilizar, la cual dependiendo del rol (kinesiologo / paciente / secretaria) permitiran al usuario realizar distintas actividades en base a la gestion de turnos de un consultorio de kinesiología. El rol del kinesiologo le permitira llevar un control de sus turnos y pacientes, el rol del paciente le permitira la alta,baja y modificacion de sus turnos y el rol de secretaria le permitira dar de alta/baja kinesiologos, ademas de poder llevar a cabo todas las funciones de los demas roles. En conclusión nuestro sistema tiene como objetivo principal optimizar y facilitar la gestión de turnos.  


### Modelo de dominio 
[![Consultorio-Kinesiologia.png](https://i.postimg.cc/W39v18Lj/Consultorio-Kinesiologia.png)](https://postimg.cc/8Jr3yhzn)


## Alcance Funcional 

### Alcance Mínimo



Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Turno<br>2. CRUD Tipo Atención<br>3. CRUD Secretaria<br>4. CRUD Consultorio|
|CRUD dependiente|1. CRUD Kinesiologo {depende de} CRUD Turno <br>2. CRUD Paciente {depende de} CRUD Turno|
|Listado<br>+<br>detalle| 1. Listado de turnos filtrado por kinesiologo y estado, muestra fecha, hora, paciente e importeTotal => detalle muestra datos paciente y observaciones <br> 2. Listado de pacientes filtrado por obra social, muestra nombre y apellido del paciente, edad => detalle muestra datos completo del turno|
|CUU/Epic|1. Solicitar turno<br>2. Dar de baja turno|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Precio <br>2. CRUD Observaciones<br>3. CRUD <br>4. CRUD <br>5. CRUD <br>6. CRUD <br>7. CRUD |
|CUU/Epic|1.Cargar observaciones<br>2. Ingresar kinesiologo<br>3. Actualizar precio de atención|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Turnos filtrado por Fecha, muestra paciente, kinesiologo, hora y tipo de atención <br>2. Kinesiologos filtrado por estado, muestra datos completos de los kinesiologo|
|CUU/Epic|1. Consultar turno  <br>2. Consultar kinesiologos|
|Otros|1. Envío de recordatorio de turno por email|

