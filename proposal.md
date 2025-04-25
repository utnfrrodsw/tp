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
    
Cuando el evento es aprobado por el administrador, el evento quedará en estado pendiente para su publicación hasta que el organizador decida publicarlo. Una vez publicado en la plataforma, pasa a estar disponible para que los todos los usuarios puedan ver los eventos disponibles. Todos los eventos estarán organizados según su tipo, con el objetivo de facilitar la búsqueda. En caso de requerir información adicional sobre un evento, se proporcionará un detalle completo con todos los datos disponibles.<br>

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
|CRUD simple|1. CRUD TipoEvento<br>2. CRUD Usuario <br>3. CRUD Lugar <br>4. CRUD ComisionEntrada|
|CRUD dependiente|1. CRUD Precio {depende de} CRUD Sector y CRUD Evento<br>2. CRUD Evento {depende de} CRUD Lugar y CRUD TipoEvento|
|Listado<br>+<br>detalle| 1. Listado de Eventos filtrado por fecha, muestra nombre de evento, descripcion, precio y fecha => detalle muestra tipo de evento y espacio libre.<br> 2. Listado de eventos filtrado por tipo del evento, muestra nombre de evento, tipo del evento, descripcion y precio => detalle muestra espacio libre y fecha.|
|CUU/Epic|1. Comprar una entrada para un evento habilitado de un tipo de evento.<br>2. Crear un evento de un tipo y para una fecha determinada.|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Entrada<br>3. CRUD Evento<br>4. CRUD Sector<br>5. CRUD Venta<br>6. CRUD Precio<br>7. CRUD Lugar<br>8. CRUD ComisionEntrada<br>9. CRUD TipoEvento<br>10. CRUD Butaca<br>11. CRUD LineaVenta|
|CUU/Epic|1. Comprar una entrada para un evento habilitado<br>2. Crear un evento para una fecha determinada<br>3. Evaluar evento pendiente|


### Alcance Adicional Voluntario


|Req|Detalle|
|:-|:-|
|Listados |1. Eventos filtrados por Lugar, muestra los datos del evento.|
|CUU/Epic|1. Cancelar evento<br>2. Modificar evento|
|Otros|1. Envío de recordatorio de evento (cancelaciòn, modificaciòn y dìas antes de la fecha) por email.|

