# Propuesta TP DSW

## Grupo
### Integrantes
 52588 - Peppino, Valentin<br>
 52211 - Santinelli, Agustin<br>
 52425 - Zabaleta, Gianlucas<br>
 52398 - Ratti, Martin<br>

### Repositorios
* [Frontend](https://github.com/valenpeppi/FrontEnd-Venta-de-Entradas)
* [Backend](https://github.com/valenpeppi/BackEnd-Venta-de-Entradas)

## Tema
### Descripción
  La plataforma consiste en un sistema de venta de entradas para eventos. Los organizadores pueden solicitar la creación de un evento, seleccionando un estadio
    previamente cargado en el sistema y completando los datos requeridos. Una vez enviada la solicitud, esta solicitud queda en estado pendiente y debe ser revisada y aprobada por un administrador. Cuando el evento es aprobado, se publica automáticamente en la plataforma y pasa a estar disponible para que los usuarios registrados puedan adquirir entradas.

## Modelo    
![image](https://github.com/user-attachments/assets/d4eed8b0-1d41-4484-9ba2-eefed77615c4)



## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Estadio<br>2. CRUD Zona <br>3. CRUD Entrada <br>4. CRUD Usuario|
|CRUD dependiente|1. CRUD Precio {depende de} CRUD Ubicacion y CRUD Evento<br>2. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de Eventos filtrado por fecha, muestra nombre de evento, descripcion, precio y fecha => detalle muestra genero y espacio libre.<br> 2. Listado de eventos filtrado por genero, muestra nombre de evento, genero, descripcion y precio => detalle muestraespacio libre y fecha.|
|CUU/Epic|1. Comprar una entrada para un evento habilitado.<br>2. Crear un evento para una fecha determinada.|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Entrada<br>3. CRUD Evento<br>4. CRUD Ubicacion<br>5. CRUD Venta<br>6. CRUD Precio<br>7. CRUD Estadio<br>8. CRUD Zona|
|CUU/Epic|1. Comprar una entrada para un evento habilitado<br>2. Crear un evento para una fecha determinada<br>3. Evaluar evento pendiente|


### Alcance Adicional Voluntario


|Req|Detalle|
|:-|:-|
|Listados |1. Eventos filtrados por zonas, muestra los datos del evento. <br>2. Eventos filtrados por nombre de estadio, muestra todos los datos de estadio.|
|CUU/Epic|1. Cancelar evento<br>2. Modificar evento|
|Otros|1. Envío de recordatorio de evento (cancelaciòn, modificaciòn y dìas antes de la fecha) por email.|

