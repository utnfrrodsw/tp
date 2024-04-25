# Propuesta TP DSW

# Grupo
### Integrantes
* 49704 - Boggio Valentino
* 50025 - Larrauri Martina
* 49640 - Leali Bruno
* 48840 - Zapata Nicolas

### Repositorios
* frontend app [in progress..]
* backend app [in progres..]
## Tema
### Descripción
Se realizará un sitio para poder llevar a cabo una gestión de clientes, sus pedidos y sus pagos. A su vez, se podrá acceder a la información de los materiales y balances de pago.
### Modelo
```mermaid
graph LR
A[Cliente] --> B[Pedido]
B --> D[Material] --> E[Costos Materiales]
C[Empleado] --> B
B --> F[Historico Pagos]
```
## Alcance Funcional
### Alcance Mínimo
***Regularidad***
| Req | Detalle |
|--|--|
| CRUD simple | CRUD Cliente <br> CRUD Pedido <br> CRUD Material <br> CRUD Empleado |
|CRUD dependiente|CRUD Costo_Material <br> CRUD Historico_Pagos |
|Listado + detalle|1. Listado de materiales. <br> 2. Listado de pedidos.|
|CUU/Epic|1. Registrar un cliente. <br> 2. Registrar un pedido para un cliente determinado.|

***Aprobación***
| Req | Detalle |
|--|--|
| CRUD simple | CRUD Cliente <br> CRUD Pedido <br> CRUD Material <br> CRUD Empleado |
|CRUD dependiente|CRUD Costo_Material <br> CRUD Historico_Pagos |
|Listado + detalle|1. Listado de materiales. <br> 2. Listado de pedidos.|
|CUU/Epic|1. Registrar un cliente. <br> 2. Registrar un pedido para un cliente determinado. <br> 3. Registrar el modo de pago del pedido. <br> 4. Registrar el histórico de pago del pedido. |


