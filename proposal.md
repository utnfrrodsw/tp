# Propuesta TP DSW

## Grupo
### Integrantes
* 52170 - Salvucci, Nahuel Andres
* 52053 - Cinalli, Sebastian Diego
* 53208- Alfaro, Valentin Anibal


### Repositorios
* [frontend app](https://github.com/SebaCinalli/FrontEnd-tp-dsw.git)
* [backend app](https://github.com/SebaCinalli/BackEnd-tp-dsw.git)

## Tema
### Descripción
Sitio web interactivo donde el usuario pueda seleccionar paso a paso los servicios necesarios para el armado de un evento, por el momento solo en la localidad de Rosario.

### Modelo
[Drawio](https://drive.google.com/file/d/10gddmn0Piiaaxf0Mnc5eGESThUVNHqKU/view?usp=sharing)

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cliente<br>2. CRUD Gastronomico<br>3. CRUD Barra<br>4. CRUD Zona|
|CRUD dependiente|1. CRUD Solicitud {depende de} CRUD Cliente<br>2. CRUD Salon {depende de} CRUD Zona|
|Listado<br>+<br>detalle| 1. Listado de Salones filtrado por Zonas, se muestra el IdSalon, nombre, idZona, foto.<br> 2. Listado de Dj y Servicios disponibles para un determinado Salon, se muestra el nombre artístico y foto del Dj, nombre y foto del servicio.|
|CUU/Epic|1. Realizar solicitud de reserva<br>2. Alta y/o baja de elementos|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cliente<br>2. CRUD Barra<br>3. CRUD Zona<br>4. CRUD Dj<br>5. CRUD Administrador<br>6. CRUD Salon<br>7. CRUD Gastronomico|
|CUU/Epic|1. Realizar solicitud de reserva<br>2. Alta y/o baja de elementos<br>3. Epic pago (con MP)|


