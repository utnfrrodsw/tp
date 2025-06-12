# Propuesta TP DSW

## Grupo
### Integrantes
* Levrand, Tomas - 52206
* Peralta, Joaquin - 52151
* Waniewski, Albano - 52706


### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)

## Tema
### Descripción
El sistema consiste en una web diseñada para la búsqueda, reserva, valoración y presentación de un restaurante. Donde un usuario busca la disponibilidad para un restaurante en el día y hora que desee, permitiéndole buscar por zona, según la valoración de los restaurantes y por precios.<br>El cliente podrá suscribirse, pagando un monto por mercado pago, para poder acceder a los descuentos y beneficios de los restaurantes. Luego de cumplir la reserva del cliente, el sistema le enviará un mail para que registre su valoración del restaurante.<br>El dueño del restaurante podrá gestionar penalidades a los clientes dependiendo del comportamiento del cliente en la reserva y las repetidas ausencias a la misma.


### Modelo
![MD Dsw drawio](https://github.com/user-attachments/assets/25caf521-3cb6-4d67-94fb-44b96c44a608)




## Alcance Funcional 

### Alcance Mínimo



Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD - Categoría<br>2. CRUD - Distrito<br>3. CRUD - Usuario<br>4. CRUD - Politicas|
|CRUD dependiente|1. CRUD - Restaurante {depende de} CRUD Usuario>dueño<br>2. CRUD - Reserva {depende de} CRUD Usuario y CRUD restaurante|
|Listado<br>+<br>detalle| 1. Listado de restaurantes filtrados por alimento, valoración, distrito y categoria. Muestra Restaurante => detalle CRUD Restaurante.<br> 2. Listado de platos filtrados por alimento. Muestra platos => detalle muestra datos completos de los platos.|
|CUU/Epic|1. Gestionar sesion de usuario<br>2. Gestionar asistencia de reserva|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD - Categoría<br>2. CRUD - Distrito<br>3. CRUD - Usuario<br>4. CRUD - Reserva<br>5. CRUD - Plato<br>6. CRUD - Restaurante<br>7. CRUD - Reseña<br>8. CRUD - Políticas<br>9. CRUD - Suscripción<br>10. CRUD - Penalidad|
|CUU/Epic|1. Gestionar sesion de usuario<br>2. Gestionar asistencia de reserva.<br>3.Realizar reseña de restaurante<br>4. Realizar suscripción (Mediante mercado pago).|


### Alcance Adicional Voluntario



|Req|Detalle|
|:-|:-|
|Listados |1. Listado de categoría (para dueño) al querer crear el restaurante.<br>2. Listado Reporte cantidad de veces asistidas a restaurante (para dueño).<br>3. Listado de reservas de restaurantes ordenadas por cantidad de cancelaciones (para admin,y para dueño del mismo restaurante).<br>4. Listado de clientes con más cancelaciones en el mes (para Dueño)|
|CUU/Epic|1. Cancelación reserva<br>2. Cancelación suscripción|
|Otros|1. Envío de recordatorio de reseña por email<br>2. Envío de recordatorio de renovación de suscripción por mail.|

