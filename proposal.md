# Propuesta TP DSW

## Grupo

### Integrantes
* 52240 - Ferrero, Santiago
* 52916 - Corvino, Lucas
* 53247 - Weng, Carlos
* 52282 - Constante, Gonzalo

### Repositorios (?)
* [frontend app](http://hyperlinkToGithubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo, indicar un solo link con fullstack app.



## Tema
### Descripción
El presente proyecto tiene como objetivo desarrollar una solución de software para optimizar la gestión y el control operativo de una empresa ferroviaria. El sistema se centralizará en la documentación de cada viaje, el seguimiento de las cargas transportadas, la gestión del mantenimiento de parte de la infraestructura ferroviaria (licencias, estado de los trenes y vías), y demás información crítica del recorrido realizado. Todo esto con el fin de proporcionar una visión unificada y en tiempo real del sistema, permitiendo una toma de decisiones de mayor calidad y asegurando una incrementalidad del sistema en el tiempo. 

### Modelo
(https://drive.google.com/file/d/1IbZ9P7yzzhSUfyCJc0J5GBW8NrObI2it/view?usp=sharing)

## Alcance Funcional

### Alcance Mínimo 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo<br>2. CRUD Licencia<br>3. CRUD Conductor<br>4. CRUD Viajes<br>5. CRUD Tren<br>6. CRUD Carga<br>7. CRUD Recorrido|
|CRUD dependiente|1. CRUD Licencia {depende de} CRUD Conductor?<br>2. CRUD Viaje {depende de} CRUD Conductor|
|Listado<br>+<br>detalle| 1. Listar los conductores con licencia vigente<br>2. Listar los conductores con licencia vigente (detalle)<br>3. Listar cargas de un tipo (detalle)<br>4. Listar recorridos ordenados por kilometros (detalle)|
|CUU/Epic|1. Renovar licencia<br>2. (cancelar viaje)<br>3. (revocar licencia)<br>4. (dar de baja un tren)|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo<br>2. CRUD Licencia<br>3. CRUD Conductor<br>4. CRUD Viajes<br>5. CRUD Tren<br>6. CRUD Carga<br>7. CRUD Recorrido|
|CUU/Epic|1. Ver los kilometros de cada tren|


### Alcance Adicional Voluntario (por completar)

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listar codigo, nombre y cantidad por cada una de las cargas que fueron transportadas en un rango de fechas dado <br>2. Cantidad de kilometros totales recorridos por cada uno de los trenes. Por cada tren mostrar su codigo y modelo|
|CUU/Epic|1. Asignar conductor a un viaje<br>2. Validar estado del tren|
|Otros|1. Envío de recordatorio de reserva por email|

