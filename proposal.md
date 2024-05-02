Propuesta TP DSW
-
Grupo
-
__Integrantes:__

- 51805 - Angelini, Agustin. 

- 51498 - Luhmann, Matias.

- 51488 - Martina, Alejo.


Tema
-
Gestión de un Centro deportivo:

Este sistema permitirá la administración de los turnos de un gimnasio.  
El gimnasio ofrece distintos planes para sus clientes.  
Cada cliente tendrá la posibilidad de sacar un turno en el horario que desee asistir al establecimiento.   
El gimnasio cuenta con distintos profesionales, por lo cual asignaremos distintos roles según se trate de un instructor o un nutricionista.  
Los instructures podrán asignar rutinas y realizar un seguimiento a cada cliente según el plan que pague el mismo. De la misma manera funcionará con el nutricionista para la gestión de dietas y su seguimiento.

### Modelo

![ModeloDominio drawio (1)](https://github.com/Lumansito/DSW2024---Com-302-Luhmann-Mat-as-Martina-Alejo-Angelini-Agust-n.-/assets/139171817/1d0fc482-74bf-4197-80d3-1316bf8a404b)


Requerimientos
-
| Req | Detalle |
| --- | ------- |
| CRUD simple   | 1- CRUD Cliente. <br> 2- CRUD Instructor. <br> 3- CRUD Nutricionista.|
| CRUD dependiente   | 1- CRUD rutina {depende de} Cliente e instructor. <br> 2- CRUD clase {depende de} Instructor. <br> 3- CRUD seguimiento entrenamiento {depende de} Cliente e instructor. <br> 4- CRUD seguimiento nutricionista {depende de} Cliente y nutricionista. <br> 5- CRUD dieta {depende de} Cliente y nutricionista. <br> 6- CRUD asistencia {depende de} Cliente y clase. <br> 7-|
| Listado + detalle | 1- Listado de clientes filtrado por DNI; muestra nombre, apellido y membresia. <br> 2- Listado de instructores filtrado por DNI; muestra nombre, apellido y rutinas asignadas. <br> 3- Listado de seguimiento nutricionistas filtrado por DNI nutricionista; muestra dietas asignadas y cliente. <br> 4- Listado de seguimientos entrenamiento filtrado por DNI cliente; muestra rutinas asignadas y cliente. <br> |
| CUU/Epic | 1- Reservar turno. <br> 2- Solicitar rutina. <br> 3- Solicitar dieta/visita a nutricionista. |  

Gestión completa de usuarios por roles.
  -  Miembro.
  -  Profesional.
  -  Administrativo.
    
Gestión de diferentes membresías.
  -  Standard.
  -  Gold.
  -  Platinum.

Gestión de planes alimenticios personalizados.

Gestión de compras de productos.
