# Propuesta TP DSW

## Grupo

### Integrantes
* 52240 - Ferrero, Santiago
* 53247 - Weng, Carlos
* 52282 - Constante, Gonzalo

### Repositorios
* [FE APP](https://github.com/santifnob/FE-app)
* [BE APP](https://github.com/santifnob/BE-app)

## Tema
### Descripción
El presente proyecto tiene como objetivo desarrollar una solución de software para optimizar la gestión y el control operativo de una empresa ferroviaria. El sistema se centralizará en la documentación de cada viaje, el seguimiento de las cargas transportadas, la gestión del mantenimiento de parte de la infraestructura ferroviaria (licencias, estado de los trenes y vías), y demás información crítica del recorrido realizado. Todo esto con el fin de proporcionar una visión unificada y en tiempo real del sistema, permitiendo una toma de decisiones de mayor calidad y asegurando una incrementalidad del sistema en el tiempo. 

### Modelo y Diagrama
[Modelo de dominio](https://app.diagrams.net/#G1CbL1amhzWdO4Q_SigsjlzUsf7KscJk_t#%7B"pageId"%3A"KFOGIdaJm5DWyXvSNqt7"%7D)

## Alcance Funcional

### Alcance Mínimo 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD tipoCarga<br>2.CRUD conductor<br>3.CRUD recorrido<br>4.CRUD tren<br>5. CRUD categoriaDenuncia|
|CRUD dependiente|1. CRUD licencia {depende de} CRUD conductor<br>2. CRUD estadoTren {depende de} CRUD tren<br>3. CRUD observacion {depende de} CRUD categoriaDenuncia|
|Listado<br>+<br>detalle| 1. Listar los conductores con licencia vigente<br>2. Listar las licencias que estan a punto de vencer<br>3. Listar los viajes proximos<br>4. Listar los recorridos que están en un rango de kilometros dado<br>5. Listar los viajes daos en un rango de fechas para cierto recorrido <br>6. Listar los viajes de una cierta carga|
|CUU/Epic|1. Crear un viaje<br>2. Gestión de solicitudes de registro|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD|1. CRUD tipoCarga<br>2.CRUD conductor<br>3.CRUD recorrido<br>4.CRUD tren<br>5. CRUD categoriaDenuncia<br>6. CRUD estadoTren<br>7. CRUD licencia<br>8. CRUD observacion<br>9. CRUD carga<br>10. CRUD lineaCarga<br>11. CRUD viaje|
|CUU/Epic|1. Crear un viaje<br>2. Gestión de solicitudes de registro<br>3. Aceptar un viaje <br>4.Gestión de viajes |
