# Propuesta TP DSW

## Grupo
### Integrantes
* 46876 Zinni, Gonzalo
* 44963 Decaroli, Alejandro


### Repositorios
* [Backend app](https://github.com/alejandro-decaroli/Velzia_backend)
* [Frontend app](https://github.com/alejandro-decaroli/Velzia_frontend)


## Tema
### Descripción
Velzia es una herramienta para registrar ventas, pedidos, pagos, cobros, transferencias y entidades de un negocio pequeño, a fin de: 
1) Auditar los registros para tener una trazabilidad del flujo de dinero del negocio.
2) Tener datos con los cuales analizar, y extraer información valiosa para el dueño del negocio. 

### Modelo
<img width="1306" height="722" alt="BBD_Velzia drawio" src="https://github.com/user-attachments/assets/8fc8507f-e09c-4c37-b7b9-f8b26bd337a7" />





## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Proveedor<br>2. CRUD Cliente<br>3. CRUD Caja<br>4. CRUD Costo<br>5. CRUD Producto|
|CRUD dependiente|1. CRUD Pedido {depende de} CRUD Producto<br>2. CRUD Venta {depende de} CRUD cliente|
|Listado<br>+<br>detalle| 1. Listado de ventas "Pagas" filtrados por fecha=> detalle descripcion de venta<br> 2. Listado de costos filtrados por fecha => detalle muestra detalle de cada costo|
|CUU/Epic|1. Efectuar una venta<br>2. Efectuar un Pedido|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Caja<br>2. CRUD Cliente<br>3. CRUD mov_financiero<br>4. CRUD Venta<br>5. CRUD Pedido<br>6. CRUD Costo<br>7. CRUD Proveedor<br>8. CRUD linea_venta<br>9. CRUD linea_pedido<br>10. CRUD Producto<br>11. CRUD Usuario |
|CUU/Epic|1. Efectuar una venta<br>2. Efectuar un pedido|

### Alcance Adicional Voluntario
|Req|Detalle|
|:-|:-|
|Listado<br>+<br>detalle| 1. Calcular costos y pedidos por pagar => muestra únicamente los detalles de los costos con estado 'Pendiente' por pagar y la sumatoria de los gastos<br>2. Calcular proyección => Muestra la sumatoria de los ingresos y los egresos, tanto actuales como por cobrar, ademas el total de dinero en cajas<br>3. Calcular cuentas por cobrar => Muestra los detalles de las ventas que todavia no estan 'Pagas' y la sumatoria de los pagos pendientes de las mismas.<br>4. Reporte de ventas general => Muestra Producto mas vendido, mas rentable, ingreso actual, ingreso pendiente, porcentajes de ventas|



