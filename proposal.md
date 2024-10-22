# Propuesta TP DSW

# Grupo

### Integrantes

- 49704 - Boggio Valentino
- 50025 - Larrauri Martina
- 49640 - Leali Bruno
- 48840 - Zapata Nicolas

### Repositorios

- [frontend app](https://github.com/NicoZapata28/frontend-tp-dsw-2024)
- [backend app](https://github.com/valentttino/backend-tp-dsw-2024)

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
string role
string password
string idOrder FK
}

Order{
string idOrder PK
string idEmployee FK
string idCustomer FK
float totalCost
date orderDate
string paymentMethod
IOrderDetail[] Details
string id
}

IOrderDetails{
string idProduct FK
number quantity
number price
}

Material{
string idMaterial PK
string description
string name
string brand
string category
number stock
number cost
string image
}


Payments{
string idPayment PK
string idOrder FK
string paid
number numberOfInstallments
IInstallmentsDetails[] installmentsDetails
}

IInstalmentsDetails{
string _id
number installmentN
date paymentDate
number amount
string paid
}

Customer ||--|| Order:idCustomer
Employee ||--|| Order:idEmployee
Payments ||--|| IInstalmentsDetails:idPayment
Order ||--|| IOrderDetails:idOrder
Order }|--o| Product:idProduct
Order ||--|| Payments:idOrder
```

_Se analizará crear nuevas clases y/o atributos según se vea conveniente._

## Alcance Funcional

### Alcance Mínimo

**_Regularidad_**
| Req | Detalle |
|--|--|
| CRUD simple | CRUD Customer <br> CRUD Order <br> CRUD Product <br> CRUD Employee |
|CRUD dependiente|CRUD Product_Cost <br> CRUD Payments |
|Listado + detalle|1. Listado de productos. <br> 2. Listado de pedidos.|
|CUU/Epic|1. Registrar un cliente. <br> 2. Registrar un pedido para un cliente determinado.|

**_Aprobación_**
| Req | Detalle |
|--|--|
| CRUD simple | CRUD Customer <br> CRUD Order <br> CRUD Product <br> CRUD Employee |
|CRUD dependiente|CRUD Product_Cost <br> CRUD Payments |
|Listado + detalle|1. Listado de productos. <br> 2. Listado de pedidos.|
|CUU/Epic|1. Registrar un cliente. <br> 2. Registrar un pedido para un cliente determinado. <br> 3. Registrar el modo de pago del pedido. <br> 4. Actualizar stock o precio de los productos. |
