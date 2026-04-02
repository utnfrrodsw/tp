# Propuesta TP DSW

## Grupo
### Integrantes
* 44726 - Velasco, Manuel

### Repositorios
* [frontend app](https://github.com/ManuelVelasco99/dsw_tp_24_front)
* [backend app](https://github.com/ManuelVelasco99/https-github.com-ManuelVelasco99-dsw_tp_24_back)

## Tema
### Descripción
Sistema de turnos para una red de institutos médicos, donde el paciente puede obtener un turno buscando según la especialidad o el profesional que necesite.

### Modelo
![imagen del modelo](https://github.com/ManuelVelasco99/tp-2024/blob/main/modelo.png)

[Imagen del modelo](https://github.com/ManuelVelasco99/tp-2024/blob/main/modelo.png)

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Especialidad|
|CRUD dependiente|1. CRUD Profesional|
|Listado<br>+<br>detalle| 1. Profesionales filtrados por especialidad y/o establecimientos. Detalle => datos completos del profesional|
|CUU/Epic|1. Reservar turno|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Rol<br>2. CRUD Usuario<br>3. CRUD Obra social<br>4. CRUD Turno<br>5. CRUD Reserva<br>6. CRUD Establecimiento|
|CUU/Epic|1. Cancelar turno<br>2. Reporte sobre turnos|


### Alcance Adicional Voluntario



|Req|Detalle|
|:-|:-|
|CUU/Epic|1. Gestión de los turnos del día para el profesional|
|Otros|1. Envío de recordatorio de turno por email|

