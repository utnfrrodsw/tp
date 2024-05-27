# Propuesta TP DSW

# Grupo
### Integrantes
* 49704 - Boggio Valentino
* 50025 - Larrauri Martina
* 49640 - Leali Bruno
* 48840 - Zapata Nicolas

### Repositorios
* frontend app [in progress..]
* [backend app](https://github.com/valentttino/backend-tp-dsw-2024)
## Tema
### Descripción
Se realizará un sitio para poder llevar a cabo una gestión de clientes, sus pedidos y sus pagos. A su vez, se podrá acceder a la información de los materiales y balances de pago.
### Modelo
```mermaid
erDiagram

Customer{
string id
string dni
string name
string address
string email
string phone
}

Employee

Order

Material

Material_Cost

Payment_History


Customer ||--|| Order:Customer_id
Employee ||--|| Order:Employee_id
Order }|--o| Material:Material_id
Order ||--|| Payment_History:Order_id
Material ||--|| Material_Cost:Material_id 
```

*Resta definir atributos de las demás clases.* 

*Además, se analizará crear nuevas clases según se vea conveniente.*
## Alcance Funcional
### Alcance Mínimo
***Regularidad***
| Req | Detalle |
|--|--|
| CRUD simple | CRUD Customer <br> CRUD Order <br> CRUD Material <br> CRUD Employee |
|CRUD dependiente|CRUD Material_Cost <br> CRUD Payment_History |
|Listado + detalle|1. Listado de materiales. <br> 2. Listado de pedidos.|
|CUU/Epic|1. Registrar un cliente. <br> 2. Registrar un pedido para un cliente determinado.|

***Aprobación***
| Req | Detalle |
|--|--|
| CRUD simple | CRUD Customer <br> CRUD Order <br> CRUD Material <br> CRUD Employee |
|CRUD dependiente|CRUD Material_Cost <br> CRUD Payment_History |
|Listado + detalle|1. Listado de materiales. <br> 2. Listado de pedidos.|
|CUU/Epic|1. Registrar un cliente. <br> 2. Registrar un pedido para un cliente determinado. <br> 3. Registrar el modo de pago del pedido. <br> 4. Registrar el histórico de pago del pedido. |


