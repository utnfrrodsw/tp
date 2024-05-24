# Propuesta TP DSW

## Grupo
### Integrantes
* 49499 Condori Sosa, Juan Ignacio
* 24919 Hernández, Fabrik
* 41514 Contreras, Sebastian


### Repositorios
* [frontend app](https://github.com/condorijuan/TP_DSW_Frontend)
* [backend app](https://github.com/condorijuan/TP_DSW_Backend)

## Tema
### Descripción
Sistema para una clinica odontologica en el cual es el profecional el que le proporciona los turnos a los paciente, estos solo pueden comunicarse y solicitar con los profesionales y consultar sobre sus turnos. El profecional puede acceder y escribir sobre el historial clinico del paciente.

### Modelo
![imagen del modelo](Tp_OdontologiaV2.png)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cliente<br>2. CRUD Profesional<br>3. CRUD Tratamiento<br>3. CRUD Estado_Cita<br>3. CRUD Tipo_Cita|
|CRUD dependiente|1. CRUD Cita {depende de} CRUD Cliente y Profesional<br>2. CRUD Costo_Tratamiento {depende de} CRUD|
|Listado<br>+<br>detalle| 1.Listado de tratamientos recibidos del paciente => Historia Clinica<br> 2. Listado de Profesionales disponibles para un día determinado|
|CUU/Epic|1. Realizar una cita en la clínica odontológica<br>2. Registro de tratamientos en el Historial clínico|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Inventario<br>2. CRUD Alergias<br>3. CRUD Antecedentes genético<br>4. CRUD Costo_Inventario|
|CUU/Epic|1. Realizar una cita en la clínica odontológica<br>2. Registro de tratamientos en el Historial clínico<br>3. Generación y consulta de factura|


### Alcance Adicional Voluntario


|Req|Detalle|
|:-|:-|
|Listados |1. Lista de todas las citas que tenga un profesional para un dia|
|CUU/Epic|1. Administración de cantidad de inventario o establecimiento de horario de trabajo (por el profesionalidad)|
|Otros|1. Envío de recordatorio de cita por gmail|

