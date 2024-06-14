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
string idCustomer PK
string dni
string name
string address
string email
string phone
string idOrder FK
}

Employee{
string idEmployee PK
string cuil
string dni
string name
string address
string email
string phone
string idOrder FK
}

Order{
string orderNumber PK
string idEmployee FK
string idCustomer FK
string idProduct FK
float totalCost
date orderDate
}

Product{
string idProduct PK
string description
string name
float stock
float cost
}


Payments{
string paymentNumber PK
string orderNumber FK 
date paymentDate
float amount 
}


Customer ||--|| Order:idCustomer
Employee ||--|| Order:idEmployee
Order }|--o| Product:idProduct
Order ||--|| Payments:idOrder
```

*Se analizará crear nuevas clases y/o atributos según se vea conveniente.*
## Alcance Funcional
### Alcance Mínimo
***Regularidad***
| Req | Detalle |
|--|--|
| CRUD simple | CRUD Customer <br> CRUD Order <br> CRUD Product <br> CRUD Employee |
|CRUD dependiente|CRUD Product_Cost <br> CRUD Payments |
|Listado + detalle|1. Listado de productos. <br> 2. Listado de pedidos.|
|CUU/Epic|1. Registrar un cliente. <br> 2. Registrar un pedido para un cliente determinado.|

***Aprobación***
| Req | Detalle |
|--|--|
| CRUD simple | CRUD Customer <br> CRUD Order <br> CRUD Product <br> CRUD Employee |
|CRUD dependiente|CRUD Product_Cost <br> CRUD Payments |
|Listado + detalle|1. Listado de productos. <br> 2. Listado de pedidos.|
|CUU/Epic|1. Registrar un cliente. <br> 2. Registrar un pedido para un cliente determinado. <br> 3. Registrar el modo de pago del pedido. <br> 4. Actualizar stock o precio de los productos. |


