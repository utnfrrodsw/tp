# Propuesta TP DSW

## Grupo

### Integrantes

- 50020 - Cravero, Pablo César
- 49485 - Roba Martinez, Manuel
- 50180 - Pérez Fontela, Simón
- 48835 - Soletti, Sol Agustina

### Repositorios

- [frontend app](https://github.com/Neirus2/TP_DSW_FrontEnd)
- [backend app](https://github.com/Neirus2/TP_DSW_BackEnd)

## Tema

### Descripción

_La empresa objeto de estudio es un mayorista de componentes tecnológicos de
computación que funciona como distribuidora nacional. Su director ejecutivo nos encargó
desarrollar un sistema que permita mejorar la organización de stock y venta de sus
productos. También le interesa que el sistema lleve un registro de sus proveedores y
clientes, otorgándoles a estos últimos determinados beneficios dependiendo de su
longevidad en la empresa._

### Modelo

[[imagen del modelo](https://drive.google.com/file/d/1RbCBWJDIhxsP6OdKpzudn3yOLC9Otv8f/view)]


## Alcance Funcional

El alcance de nuestro negocio abarca procesos de compra, venta y registro de stock de una distribuidora de componentes de computación.

### Alcance Mínimo

Nuestro sistema gestionará la compra y venta de insumos de computación, así como el registro, actualización
y organización de stock.

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Client<br>2. CRUD Pedido<br>3. CRUD Producto<br>4. CRUD Proveedor|
|CRUD dependiente|1. CRUD Category {depends on} CRUD Product<br>2.CRUD Discount {depends on } CRUD Client|
|Listado<br>+<br>detalle| 1. List of clients order by Antiquity<br> 2. List of products order by category|
|CUU/Epic|1. Load a client on system<br>2. Update Stock and generate bill

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Order<br>2. CRUD Discount<br>3. CRUD Category<br>4. CRUD Purchase Order<br>5. CRUD Supplier<br>
|CUU/Epic|1. Register new Client<br>2. Update/Register new Supplier<br>
