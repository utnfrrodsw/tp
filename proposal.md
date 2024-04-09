# Propuesta TP DSW

## Grupo
### Integrantes
* 51841 - Redaelli, Martín
* 50553 - Riguetto, Fabricio

### Repositorios
* [frontend app]((https://github.com/Fabririguetto/Frontend-dsw.git))
* [backend app]((https://github.com/Fabririguetto/Backend-dsw.git))

## Tema
### Descripción
El sistema de gestión web para locales de venta de productos en general optimiza operaciones diarias. Desde control de inventario hasta ventas y atención al cliente, ofrece soluciones integrales. Facilita seguimiento de stock, registro de ventas y gestión de clientes. Asigna roles específicos a empleados para una operación eficiente. Mejora productividad y satisface demandas del mercado

### Modelo
[![Mermaid](https://mermaid.ink/img/pako:eNqtVt1vmzAQ_1csP7GWROSLEDRF2ta9rdKkVHuYeHHtS2oVcGSbaG2U_30GbEIgTVZ1PMBx97vz7z5s2GMqGOAY05QodcfJRpIsyZG5Kg1acaUhIyst6DPa15byGqy05PkG5SJ7lNDXMy6BUi7ylumHifX5pxSsoFos0dZKqgv5nm1TIMxAwEo9yLeUQ65haVhWQg-wKmghFUmXSFmpj_llPMkS7cpHy3jb4bnmqZZEOoXybIqVXnzqOtqo1qt6U94d0YDWQJ-Ijyx3R91HLt8m3XbMneAMUSI3bQYdhnkBO6Eac889E4yvOT1G8JzQNKHnU8YkFXuvutdl6sE2oLTpMpFfvt7bxLxegrZgpBqIiyFc2zwnNO17TxRXUK9X2fNRDvWjPfdNgdozz3ONOHvHJgBFJd92tgETxWMKpvJgDJ3oqtxnb5Jq0vkIqXKWRJ-OKTGRjs-ZtV1TP1SPM4eCNWlIYS3yt9dvBuI_EjizTD3rF9c47uWWsjPzLUvTNLOBGDAh_-FENCwYPzn2bm2bKElpYTr1ILTZJcf5rYWT03owOE5xjKjItaEGaHke2tC8DnW5Xkc2TbsOrQvfx9X3JpEEjxJs8DdGCobDG_PiPBXUJXaetb7tMKodLlTl1McKx3wlkJS_kovoViEbOtjHGciMcGY-tdVwJVg_QQYJjo3IiHxOcJIfDI4UWqxecopjLQvwcbFlZt7sl9kptyT_LUT7Fcd7_AfH4yAaRpNoMZoF4TyIRovIxy84ng_DIJoH43AximaT6Xxy8PFrFSAYRot5MBtPwzAKF5PZdOpjYFwLeW9_DMrH4S_q_Yfl?type=png)](https://mermaid.live/edit#pako:eNqtVt1vmzAQ_1csP7GWROSLEDRF2ta9rdKkVHuYeHHtS2oVcGSbaG2U_30GbEIgTVZ1PMBx97vz7z5s2GMqGOAY05QodcfJRpIsyZG5Kg1acaUhIyst6DPa15byGqy05PkG5SJ7lNDXMy6BUi7ylumHifX5pxSsoFos0dZKqgv5nm1TIMxAwEo9yLeUQ65haVhWQg-wKmghFUmXSFmpj_llPMkS7cpHy3jb4bnmqZZEOoXybIqVXnzqOtqo1qt6U94d0YDWQJ-Ijyx3R91HLt8m3XbMneAMUSI3bQYdhnkBO6Eac889E4yvOT1G8JzQNKHnU8YkFXuvutdl6sE2oLTpMpFfvt7bxLxegrZgpBqIiyFc2zwnNO17TxRXUK9X2fNRDvWjPfdNgdozz3ONOHvHJgBFJd92tgETxWMKpvJgDJ3oqtxnb5Jq0vkIqXKWRJ-OKTGRjs-ZtV1TP1SPM4eCNWlIYS3yt9dvBuI_EjizTD3rF9c47uWWsjPzLUvTNLOBGDAh_-FENCwYPzn2bm2bKElpYTr1ILTZJcf5rYWT03owOE5xjKjItaEGaHke2tC8DnW5Xkc2TbsOrQvfx9X3JpEEjxJs8DdGCobDG_PiPBXUJXaetb7tMKodLlTl1McKx3wlkJS_kovoViEbOtjHGciMcGY-tdVwJVg_QQYJjo3IiHxOcJIfDI4UWqxecopjLQvwcbFlZt7sl9kptyT_LUT7Fcd7_AfH4yAaRpNoMZoF4TyIRovIxy84ng_DIJoH43AximaT6Xxy8PFrFSAYRot5MBtPwzAKF5PZdOpjYFwLeW9_DMrH4S_q_Yfl)

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad|
|CRUD dependiente|1. CRUD Habitación {depende de} CRUD Tipo Habitacion<br>2. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de habitaciones filtrado por tipo de habitación, muestra nro y tipo de habitación => detalle CRUD Habitacion<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de habitación, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

