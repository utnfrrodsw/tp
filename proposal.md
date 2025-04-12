# Propuesta TP DSW:Gestión del campamento mestizo.

## Grupo
### Integrantes
* 52604 Abbate,Thiago 
* 48866 Montes, Alejandro 
* 52957 Stella, Camila 

### Repositorios
* frontend app
* backend app

## Tema
### Descripción
Plataforma web que gestiona la experiencia de un campamento temático mitológico con diferentes roles: campistas, instructores y administradores.

### Modelo
DIAGRAMA ENTIDAD-RELACIÓN (DER)
![DER](https://imgur.com/a/cLrmdJY)

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Deidades<br>2.CRUD Talleres: Crear (via solicitud), editar y eliminar/suspender talleres<br>3. CRUD  Cabañas: Gestión de cabañas y asignación automática. |
|CRUD dependiente|1. CRUD de Usuario (si es un campista) depende de deidad<br>2. CRUD Misiones depende de administrador |
|Listado<br>+<br>detalle| 1.Listado de cabañas: filtrar por tipo (Hermes u otro), ver integrantes.<br> 2. Listado de solicitudes: filtrar por tipo(taller,estadía,upgrade) estado (pendiente, aceptado, rechazado).|
|CUU/Epic|1. Asignacion de misiones a los campistas<br>2.Inscripción  a talleres|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario <br>2. CRUD Talleres<br>3. CRUD Cabañas <br>4. CRUD Tipo solicitud<br>5. CRUD Libreta de notas<br>6. CRUD Misiones<br>7. CRUD Obituario|
|CUU/Epic|1. Asignacion de misiones a los campistas<br>2. Inscripción  a talleres<br>3.Asignación de notas suministradas por los instructores a los campistas<br>4.Evaluación de Talleres por parte de Campistas|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. E. Listado cabañas filtrado por progenitor,cantidad de campistas actuales<br>2. Listado de talleres|
|CUU/Epic|1. Inscripción a eventos especiales<br>2.  Enviar solicitud al administrador|
|Otros|1. Notificaciones de inscripción, suspensión o aceptación.<br>2.Mapa interactivo del campamento|

