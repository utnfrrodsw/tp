# TP-DSW
Gestion de Stock para tienda de indumentaria


## INTEGRANTES: 

* 47857 - Mozzi Feliciano

* 47858 - Grau Juan Bautista

* 48022 - Ayelen Aimar

## Repositorios
* [Frontend app](https://github.com/bautigr02/TP-DSW/tree/frontend-app)
* [Backend app](https://github.com/bautigr02/TP-DSW/tree/backend-app)

## TEMA: 

  Un negocio de indumentaria nos pidió que realicemos una página web para su gestión. Esta le permitirá a un empleado dar de alta, baja o modificar productos, gestionar su stock, registrar un cliente y registrar ventas.
  Además, un usuario administrador podrá dar de alta, baja o modificar empleados, dar de alta, baja o modificar proveedores, realizar pedidos a proveedores y también podrá realizar las funciones que puede realizar un empleado.
  Al final de cada mes, el administrador deberá poder confeccionar una lista de los proveedores a los que más pedidos se le realizó y una lista de los productos más vendidos.


## IMAGEN DEL MODELO:

![MODELO DE DOMINIO - TIENDA INDUMENTARIA-Copia de Página-1 drawio](https://github.com/bautigr02/TP-DSW/assets/75873464/5ad1794d-0bb0-4092-987e-8761ce681d4c)

https://drive.google.com/drive/folders/157aghfvbj1BjJCeRXHIjp3ElVico5Tsm?usp=drive_link



## ALCANCE FUNCIONAL

### Alcance mínimo
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cliente<br>2. CRUD Producto<br>3. CRUD Proveedor |
|CRUD dependiente|1. CRUD Venta {depende de} CRUD Línea de venta + CRUD Cliente + CRUD Empleado<br>2. CRUD Producto {depende de} CRUD Tipo producto|
|Listado<br>+<br>detalle| 1. Listado de los productos filtrados por cantidad de líneas de ventas. Muestra idProducto, descripciónProducto y cantidad total vendida.<br> 2. Listado de los proveedores filtrado por cantidad de Pedidos. Muestra cuitProveedor y razonSocial|
|CUU/Epic|1. Registrar una venta<br>2. Realizar un pedido|


### Adicionales para aprobación directa

|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Empleados<br>2. CRUD Pedidos<br>3. CRUD Cliente<br>4. CRUD Venta<br>5. CRUD Productos<br>6. CRUD Proveedor<br>7. CRUD Linea de venta<br>8. CRUD Tipo producto|
|CUU/Epic|1. Registrar una venta<br>2. Realizar un pedido<br>3. Alta de un empleado|
