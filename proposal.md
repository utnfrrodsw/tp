# Propuesta TP DSW

## Grupo
### Integrantes
* 45198 - Romo, Matías
* 1 - a
* 2 - b

### Repositorios
* [frontend app](https://github.com/matiusuario/utnfrrodsw-frontend)
* [backend app](https://github.com/matiusuario/utnfrrodsw-backend)

## Tema
### Descripción
Se trata del sistema para gestionar los pedidos en un bar o restaurante. Los clientes al sentarse en una mesa pueden ingresar y hacer un pedido que será visualizado por un administrador, eventualmente aceptado y posteriormente servido por un mozo. Adicionalmente se permitirá realizar reservas de las mesas por parte de los clientes.

### Modelo

[![imagen del modelo](mermaid-diagram-2025-04-15-203712.png)](https://mermaid.live/edit#pako:eNp9UkFugzAQ_Iq1xwoiHCAQX9NjI1VRT5UvFt4kSGBHxlRtIv5egyFFEY1P652Z9Yy1Nyi0RGAQhiFXtrQVMvJaipMRtSASSVGJBhuuBry_NCPKlSwNFrbUirwduCLuDDjZVSUqi-Tmm90ce0dZSr0IHbBB8yWWZUbLtrDLwj02y6qP8qKfK_V1Dvhiss-BciBh6IoXV3jnTyljAs-Z4nho4PTk3qwnDLZnaF_0hjw6ftQDPqUZOVO2hzfmuf-b9ucFAjiZUgI7iqrBAGo0tejvMPwMB3vGGjkwV0o8irayHLjqnO4i1KfWNTBrWqc0uj2d73PaixQWx225dw0qiWanW2WBZckwA9gNvoHR9Xa1TlK6jZOcJkkaB_DjuildUZpkURTTLM7XeRfAdXg0WmWpa21puqFxnkbZJgCX02qz9zs9rHb3C2pu3Zs)

[![link de la imagen del modelo](https://mermaid.ink/img/pako:eNp9UkFugzAQ_Iq1xwoiHCAQX9NjI1VRT5UvFt4kSGBHxlRtIv5egyFFEY1P652Z9Yy1Nyi0RGAQhiFXtrQVMvJaipMRtSASSVGJBhuuBry_NCPKlSwNFrbUirwduCLuDDjZVSUqi-Tmm90ce0dZSr0IHbBB8yWWZUbLtrDLwj02y6qP8qKfK_V1Dvhiss-BciBh6IoXV3jnTyljAs-Z4nho4PTk3qwnDLZnaF_0hjw6ftQDPqUZOVO2hzfmuf-b9ucFAjiZUgI7iqrBAGo0tejvMPwMB3vGGjkwV0o8irayHLjqnO4i1KfWNTBrWqc0uj2d73PaixQWx225dw0qiWanW2WBZckwA9gNvoHR9Xa1TlK6jZOcJkkaB_DjuildUZpkURTTLM7XeRfAdXg0WmWpa21puqFxnkbZJgCX02qz9zs9rHb3C2pu3Zs?type=png)](https://mermaid.live/edit#pako:eNp9UkFugzAQ_Iq1xwoiHCAQX9NjI1VRT5UvFt4kSGBHxlRtIv5egyFFEY1P652Z9Yy1Nyi0RGAQhiFXtrQVMvJaipMRtSASSVGJBhuuBry_NCPKlSwNFrbUirwduCLuDDjZVSUqi-Tmm90ce0dZSr0IHbBB8yWWZUbLtrDLwj02y6qP8qKfK_V1Dvhiss-BciBh6IoXV3jnTyljAs-Z4nho4PTk3qwnDLZnaF_0hjw6ftQDPqUZOVO2hzfmuf-b9ucFAjiZUgI7iqrBAGo0tejvMPwMB3vGGjkwV0o8irayHLjqnO4i1KfWNTBrWqc0uj2d73PaixQWx225dw0qiWanW2WBZckwA9gNvoHR9Xa1TlK6jZOcJkkaB_DjuildUZpkURTTLM7XeRfAdXg0WmWpa21puqFxnkbZJgCX02qz9zs9rHb3C2pu3Zs)

## Alcance Funcional

### Alcance Mínimo

Regularidad:

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cliente<br>2. CRUD Mesa<br>3. CRUD Mozo|
|CRUD dependiente|1. CRUD Pedido {depende de} CRUD Cliente<br>2. CRUD Reserva {depende de} CRUD Mesa y Cliente|
|Listado<br>+<br>detalle| 1. Listado de mesas filtrado por estado, muestra nro de sillas y estado de ocupación => detalle CRUD Mesa<br> 2. Listado de pedidos filtrado por mesa y tipo de producto, muestra estado, nombre y tipo de producto => detalle muestra datos completos de los productos y de la mesa|
|CUU/Epic|1. Reservar una mesa del bar<br>2. Realizar un pedido|


Adicionales para Aprobación:

|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cliente<br>2. CRUD Mesa<br>3. CRUD Mozo<br>4. CRUD Tipo Producto<br>5. CRUD Producto<br>6. CRUD Reserva<br>7. CRUD Pedido|
|CUU/Epic|1. Reservar una mesa del bar<br>2. Realizar un pedido<br>3. Realizar el pago de uno o más pedidos|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Pedidos filtrados por Tipo Producto y Cliente, muestra el estado y el nombre de los productos y sus tipos<br>2. Reservas filtradas por fecha muestra datos de la mesa, la fecha y el nombre del cliente|
|CUU/Epic|1. Solicitar mozo<br>2. Cancelar reserva|
|Otros|1. Envío de recordatorio de reserva por email|

