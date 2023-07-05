# Propuesta TP DSW

## Grupo

### Integrantes

- legajo - Apellido(s), Nombre(s)

### Repositorios

- [frontend app](http://hyperlinkToGihubOrGitlab)
- [backend app](http://hyperlinkToGihubOrGitlab)
  _Nota_: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema

### Descripción

Aplicación para cine con distintas funcionalidades para cliente(compra/venta de entradas), personal(escaneo de QR y sistema de venta "en puerta") y administrador(panel de eventos).

### Descripción

### Modelo

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|

|:-|:-|

|CRUD simple|

1. CRUD Eventos (panel de administrador) <br>
2. CRUD Control de Ingreso en Puerta (sistema de venta en puerta e ingreso con QR)<br>
3. CRUD ...|
   |CRUD dependiente|
4. CRUD Compra y Venta de Entradas {depende de} CRUD Eventos<br>
5. CRUD TicketsRemanentes {depende de} CRUD Control de Ingreso en Puerta<br>
6. CRUD ... {depende de} CRUD ...|
   |Listado<br>+<br>detalle|
7. Listado de ticket sobrantes filtrado por fecha, lugar y tematica => detalle CRUD Compra y Venta de Entradas<br>
8. Listado de tickets para vender en puerta filtrado por tipoEntrada, cantidad, precio => detalle TicketsRemantentes|
9. ...
   |CUU/Epic|
10. Comprar una entrada al evento<br>
11. Realizar el control de ingreso en un evento<br>
12. ...|

Adicionales para Aprobación
|Req|Detalle|

|:-|:-|

|CRUD |

1. CRUD EntradasEvento<br>
2. CRUD TipoEntrada<br>
3. CRUD Localidad<br>
4. CRUD Provincia<br>
5. CRUD Lugar<br>
6. CRUD Empleado<br>
7. CRUD Cliente|
   |CUU/Epic|
8. Comprar una entrada al evento<br>
9. Realizar el check-in de una reserva<br>
10. Realizar el check-out y facturación de estadía y servicios|

### Alcance Adicional Voluntario

_Nota_: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

| Req      | Detalle |
| :------- | :------ |
| Listados |

1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>
2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes |
   | CUU/Epic |
3. Consumir servicios<br>
4. Cancelación de reserva |
   | Otros |
5. Envío de recordatorio de reserva por email |
