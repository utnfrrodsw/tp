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
    previamente cargado en el sistema y completando los datos requeridos. Una vez enviada la solicitud, esta solicitud queda en estado pendiente y debe ser revisada y aprobada por un administrador.<br>
    
Cuando el evento es aprobado, se publica automáticamente en la plataforma y pasa a estar disponible para que los todos los usuarios puedan ver los eventos disponibles. Todos los eventos estarán organizados según su tipo, con el objetivo de facilitar la búsqueda. En caso de requerir información adicional sobre un evento, se proporcionará un detalle completo con todos los datos disponibles.<br>

En caso que un usuario se decida a realizar la compra de entradas para un determinado evento, deberá registrarse en la página si aun no lo ha hecho. A continuación, el proceso de selección variará según si el estadio cuenta con asientos numerados o no.<br>
   -Si el estadio es numerado, se mostrará primero la selección de sector y luego un mapa interactivo con los asientos disponibles dentro de ese sector.<br>
   -Si el estadio no es numerado, el usuario solo deberá elegir el sector deseado.<br>

Al momento de confirmar la compra, se solicitarán los datos necesarios y se procederá con el pago a través de los medios habilitados. Una vez finalizado el proceso, se mostrará al usuario un resumen detallado de su compra.

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

