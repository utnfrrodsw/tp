Propuesta TP DSW
-
Grupo
-
__Integrantes:__

- 51498 - Luhmann, Matias.

- 51488 - Martina, Alejo.

## Repositorio


<a href="https://github.com/Lumansito/app-web">Repositorio</a>

Tema
-
Gestión de un Gym:

Este sistema permitirá la administración de los turnos de un gimnasio.  
El gimnasio ofrece distintos planes para sus clientes.  
Cada cliente tendrá la posibilidad de sacar un turno en el horario que desee asistir al establecimiento.   
El Sistema cuenta con  profesionales, administradores y clientes como los roles del mismo.
Los profesionales podrán asignar rutinas y realizar un seguimiento a cada cliente según el plan que pague el mismo.


### DER

![Descripción de la imagen](https://drive.google.com/uc?export=view&id=1oZyXeEUxBYH1kvBBXEotZEnvuJDN905k)

### Base De Datos

![Descripción de la imagen](https://drive.google.com/uc?export=view&id=16duJtlFEp8YerjxEWIXp7Jt89RJLQhmj)

### Video Muestra
<a href="https://drive.google.com/file/d/1ZERvdEL2x_RqnIU9R_DPp-wK5avlYZxv/view">Video</a>


## Alcance Funcional 

### Apartados Desarrollados

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Ejercicio|
|CRUD dependiente|1. CRUD Usuarios {depende de} Roles <br>2. CRUD Seguimientos {depende de}  Usuarios, Ejercicios <br> CRUD EsquemaCupos {dpende de} Usuarios  <br> 4. CRUD CuposOtorgados {depende de} EsquemaCupos, Usuarios <br> CRUD Rutinas {depende de} Ejercicios, Usuarios, Roles |
|Listado<br>+<br>detalle| 1. Listado de ejercicios de los seguimientos, muestra nro de repeticiones y peso del ejercicio para un determinado cliente<br> 2. Listado de Clases disponibles, (Generadas por el EsquemaCupo) filtrado por dia y hora actual, muestra cantidad de cupos restantes, hora de inicio, prefesional asignado a la clase|
|CUU/Epic|1. Reservar una clase, validando cupo, cantidad de reservas por dia en base a la membresia del cliente, reserva actual del cliente<br>2. Realizar el check-in del cleinte al gym|



### Apartados De Posible Desarrollo

|Req|Detalle|
|:-|:-|
|CRUD Simple |1. CRUD Membresias <br>2. CRUD Pagos|
|CUU/Epic|1. Solicitar rutina y visuliazación de las mismas|
