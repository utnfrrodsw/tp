# Propuesta TP DSW

## Grupo
### Integrantes
* 51354 - Santilli, Maximo Gabriel (COM 301)
* 50319 - Valle, Micaela (COM 301)
* 51607 - Morales, Juan Pablo (COM 301)
* 50549 - Stefanini, Agustin (COM 304)

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
Gestion de torneos de Futbol 5.

### Descripción
Es una aplicacion web que administra Torneo de Fulbol 5 que esta pensada para 2 tipos de usuarios:
- El usuriario de tipo "participante" que ademas de poder registrarse, iniciar sesio e inscribirse en un torneo de futbol 5 podrá ver listados de todos los torneos y todos los partidos.
- EL usuario de tipo "admin" que ademas de poder iniciar sesion, Crear torneos, sucursales, localidades, modificar torneos y partidos y eliminar participantes podrá acceder a listados de torneos, partidos y equipos.

### Modelo
![Imagen del modelo] (/docs/DER.png)

#### Pasaje a tabla

Tipo_Participante(id_posicion, nombre_posicion)

id_posicion --> CP


Participante(ID_Cuenta_participante, Contraseña, Nombre, Apellido, Fecha_nacimiento, Mail, id_posicion, rol)

ID_Cuenta_Participante-->CP

id_posicion --> CF(Tipo_Participante)

 

Admin(ID_Cuenta_Administrador, Contraseña, Nombre, Apellido, Fecha_nacimiento, Mail, rol )

ID_Cuenta_Administrador -->CP

 

Localidad(id_localidad,nombre)

id_localidad -->CP

 

Sucursal(ID_Sucursal, nombre, id_localida)

ID_Sucursal-->CP

Id_localidad -->CF(Localidad)

 

Formato_Torneo(id_formato_torneo, Cantidad_Equipos, Cantidad_Partidos)

id_formato_torneo-->CP

 

Estado de torneo(ID_estado de torneo, nombreEstado) 

ID_estado de torneo -->CP

 

Equipo(id_torneo, id_equipo, participante1, participante2, participante3, participante4, participante5)

id_torneo, id_equipo-->CP

id_torneo-->CF(Torneo)

participante1 -->CF(Participante(id_cuenta_participante))

participante2 -->CF(Participante(id_cuenta_participante))

participante3 -->CF(Participante(id_cuenta_participante))

participante4-->CF(Participante(id_cuenta_participante))

participante5 -->CF(Participante(id_cuenta_participante))

 

Torneo(Id_Torneo , Nombre_Torneo, Fecha_Inicio_Torneo, Fecha_Fin_Torneo, id_formato_torneo, ID_estado de torneo, ID_Sucursal, ID_Cuenta_Administrador)

Id_torneo-->CP

id_formato_torneo-->CF(Formato torneo)

 ID_estado de torneo-->CF(Estado torneo)

 ID_Sucursal-->CF(Sucursal)

 ID_Cuenta_Administrador-->CF(Admin)

 

Partido(id_partido, id_equipo1, id_equipo2, Fecha_partido)

id_partido --> CP

id_equipo1-->CF(Equipo(id_equipo))

id_equipo2-->CF(Equipo(id_equipo))



https://drive.google.com/file/d/1crx1n02jI2IXG_3mSn7VQyo8sVDRmhAR/view?usp=sharing

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo_participante<br>2. CRUD Estado_Torneo<br>3. CRUD Localidad<br>4. CRUD Formato_Torneo|
|CRUD dependiente|1. CRUD Sucursal {depende de} CRUD Localidad<br>2. CRUD PArticipante {depende de} CRUD Tipo_participante<br>3.
|Listado<br>+<br>detalle| 1. Listado de Partidos filtrado por Torneo, muestra => id_equipo1, id_equipo1 y fecha_partido <br> 2. Listado de Equipos filtrado por torneo => Id_equipos
|CUU/Epic|1. Registrar inscripcio a un torneo de un usuario<br>2. Crear un Torneo|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo_participante<br>2. CRUD Estado_Torneo<br>3. CRUD Localidad<br>4. CRUD Sucursal<br>5. CRUD Equipo<br>6. CRUD Partido<br>7. CRUD Torneo<br>8. CRUD Formato_Torneo<br>9. CRUD Participante<br>10. CRUD Admin<br>
|CUU/Epic|1. Registrar inscripcio a un torneo de un usuario<br>2. Crear un Torneo<br>3. Crear Sucursal<br>4. Actualizar Partido|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados ||
|CUU/Epic||
|Otros|| (En revisión)

