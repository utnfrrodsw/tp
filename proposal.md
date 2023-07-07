# Propuesta TP DSW

## Grupo
### Integrantes
* 42775 - Reinoso, Alfredo
* 45403 - Benedetti, Juan Ignacio
* 42737 - Ceschan, Franco (pendiente)

### Repositorios
* [GestionObras_Front](https://github.com/AlfreReinoso/frontEndObra)
* [GestionObras_Back](https://github.com/AlfreReinoso/backendObra)

## Tema
### Descripción
#### Sistema de gestion de obras para una constructora:
* Registro de obra para un cliente.
* Asignacion de materiales, maquinarias y empleados para una obra.
* Generacion de informe para una obra.
### Modelo
#### Diagrama de clases
![DC](https://drive.google.com/uc?export=view&id=11HKYP7vIulUoVWp59jXSfL3pkRYAOon2)

#### Mapeo Objeto-Relacional
![MOR](https://drive.google.com/uc?export=view&id=1q5TDXiugF-sfEt1IPyzK0JPsRzMT4lal)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Material<br>2. CRUD Maquina<br>3. CRUD Empleado|
|CRUD dependiente|1. CRUD Obra {depende de} CRUD Maquina, CRUD Material, CRUD Cliente, CRUD Empleado<br>2. CRUD Precio {depende de} CRUD Material|
|Listado<br>+<br>detalle| 1. Listado de obras filtrado por localidad => detalle muestra los datos completos de la obra seleccionadabr> 2. Listado de empleados filtrado por puesto => muestra los datos completos del empleado seleccionado|
|CUU/Epic|1. Registrar una obra para un cliente<br>2. Asignar materiales a una obra|


Adicionales para Aprobación:
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cliente<br>2. CRUD Empleado<br>3. CRUD Material<br>4. CRUD Maquina<br>5. CRUD Obra<br>|
|CUU/Epic|1. Registrar una obra para un cliente.<br>2. Asignar materiales a una obra.<br>3. Registrar entrega de obra e informe general.|




