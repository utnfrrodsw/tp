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
(https://drive.google.com/file/d/1CbL1amhzWdO4Q_SigsjlzUsf7KscJk_t/view?usp=sharing)

## Alcance Funcional

### Alcance Mínimo 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD TipoCarga<br>2.CRUD Conductor<br>3.CRUD Recorrido<br>4.CRUD Estado<br>5. CRUD Categoria|
|CRUD dependiente|1. CRUD Licencia {depende de} CRUD Conductor<br>2. CRUD Tren {depende de} CRUD Estado<br>3. CRUD Denuncia {depende de} CRUD Categoria|
|Listado<br>+<br>detalle| 1. Listar los conductores con licencia vigente<br>2. Listar los conductores con licencia vigente (detalle)<br>3. Listar cargas de un tipo (detalle)<br>4. Listar recorridos ordenados por kilometros (detalle)<br>5. Listar codigo, nombre y cantidad por cada una de las cargas que fueron transportadas en un rango de fechas dado <br>6. Cantidad de kilometros totales recorridos por cada uno de los trenes. Por cada tren mostrar su codigo y modelo|
|CUU/Epic|1. Programar viaje<br>2. Modificar viaje|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD|1. CRUD TipoCarga<br>2.CRUD Conductor<br>3.CRUD Recorrido<br>4.CRUD Estado<br>5. CRUD Categoria<br>6. CRUD Licencia<br>7. CRUD Tren<br>8. CRUD Denuncia|
|CUU/Epic|1. Programar viaje<br>2. Modificar viaje<br>3. Generar denuncia<br>4. Asignar conductor|
