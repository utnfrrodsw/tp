
# Propuesta TP DSW

## Grupo
### Integrantes
* 51474 - Galasco Alexis
* 48833 - Soler Leandro
* 53120 - Foronda Juan Manuel
* 52441 - Agustin Rivero

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Administración de un Club Náutico
### Descripción
*Sistema web con usuarios diferenciados: socios y administradores.
Permite a los socios consultar su situación administrativa, reservar servicios y ver disponibilidad de infraestructura.
Los administradores pueden gestionar socios, embarcaciones, cuotas, reservas, boxes y amarres, así como también consultar reportes de ocupación y deuda.
Modelo)*

### Modelo
![Editor___Mermaid_Chart-2025-04-10-211114 1  conv 1](https://github.com/user-attachments/assets/aed523b1-d4e9-4760-b5d0-a7a9176d675c)

## Alcance Funcional 

### Alcance Mínimo
 
Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Socio<br>2. CRUD Box<br>3. CRUD Amarra<br>4. CRUD BotesClub|
|CRUD dependiente|1. CRUD CuotaMensual {depende de} CRUD Tipo Socio<br>2. CRUD Embarcacion {depende de} CRUD Socio y CRUD Amarra o CRUD Box|
|Listado<br>+<br>detalle| 1. Listado de cuotas impagas filtrado por socio => detalle nombre del socio, mes, monto<br> 2. Listado de boxes y amarras filtrado por zona y estado => detalle muestra datos del box|
|CUU/Epic|1. El administrador registra el pago de una cuota y consulta la deuda total del socio.<br>2. La embarción cambia a una nueva Amarra|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Socio<br>2. CRUD Box<br>3. CRUD Amarra<br>4. CRUD BotesClub<br>5. CRUD ReservaTravelLift|
|CUU/Epic|1. El administrador registra el pago de una cuota y consulta la deuda total del socio.<br>2. La embarción cambia a una nueva Amarra.<br>3. El socio reserva el travel lift para una embarcación.<br>4. Socio reserva uso de bote del club|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Reporte de morosidad, con socios que deben más de X cuotas<br>|
|CUU/Epic|1. Implementar lista de espera de amarra<br>2.Vista gráfica o visual de los amarres y boxes, con estado de ocupación (color verde/rojo/gris, por ejemplo)|
|Otros|1. Envío automático de recordatorios de pago|
