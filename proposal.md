# Propuesta TP DSW

## Grupo
### Integrantes
* 49186 - Clemente Alvarez, Federico
* 48085 - Ferrari, Mauro
* 48909 - Mendiaz, Francisco
* 47979 - Ortenzi, Fabrizio

### Repositorios
* [fullstack app](https://github.com/federicoclementealvarez/DeliverIt)


## Tema
### Descripción
*Aplicación Web para realizar pedidos de productos, de distintos tipos, comercializados por diversos locales. La misma cuenta con cuatro niveles de acceso (tipos de usuario): cliente (estándar o prémium), gestor de local, repartidor y admin. El cliente puede realizar pedidos de combinaciones de productos de un local, cada uno con una forma de pago. El gestor de local tiene la capacidad de registrar locales y crear productos dentro de los mismos, perteneciendo cada uno a una categoría de producto y contando con un histórico de precios. Por otro lado, el repartidor puede aceptar repartos de pedidos, de los cuales gana una comisión que luego puede retirar. Por último, el admin tiene permisos para realizar ABM's sobre las clases independientes (como categorías de productos o tipos de locales).*

### Modelo
![image](https://github.com/federicoclementealvarez/TP-DSW/blob/main/images/Modelo%20de%20Dominio%20-%20TP-DSW.svg)

*Link*: (https://drive.google.com/file/d/1tbck-muwWJiEiiQrtyzNe9sZQ5d3z8Bz/view?usp=sharing)

### Alcance Funcional 

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD ShopType<br>2. CRUD ProductCategory<br>3. CRUD PaymentType<br>4. CRUD UserType<br>5. CRUD Comission|
|CRUD dependiente|1. CRUD Shop {depende de} CRUD ShopType<br>2. CRUD User {depende de} CRUD UserType<br>3. CRUD Withdrawal {depende de} CRUD User<br>4. CRUD Product {depende de} CRUD Shop, CRUD ProductType<br>5. CRUD Order {depende de} CRUD User, CRUD PaymentType<br>6. CRUD LineItem {depende de} CRUD Order, CRUD Product<br>7. CRUD Price {depende de} CRUD Product<br>8. CRUD Adress {depende de} CRUD Shop o CRUD User<br>9. CRUD Review {depende de} CRUD Shop, CRUD User|
|Listado<br>+<br>detalle| 1. Listado de Shops filtrado por name, ShopType y/o ProductCategory; muestra logo, name y stars de Shop => detalle muestra datos completos de Shop y de sus Product<br> 2. Listado de Reviews filtrado por Shop, muestra datos completos de la Review<br> 3. Listado de Addresses filtrado por User, muestra datos completos de la Adress => detalle CRUD Adress|
|CUU/Epic|1. Realizar Order<br>2. Añadir Review<br>3. Realizar Withdrawal<br>4. Cargar Product|
|Otros|1. Envío de resumen de pedido (Order, PaymentType, Products y Shop) por email al User|
