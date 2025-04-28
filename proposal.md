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
Velzia es un mini ERP para ventas simple y funcional.

### Modelo
![imagen] ![Screenshot 2025-04-28 at 15-48-22 BBD drawio - draw io](https://github.com/user-attachments/assets/488b233f-9c41-44ac-8d28-d24af897476f)




## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Caja<br>2. CRUD Cliente<br>3. CRUD Tasa|
|CRUD dependiente|1. CRUD Venta {depende de} CRUD Cliente|
|Listado<br>+<br>detalle| 1. Listado de clientes terminados filtrados por estado=> detalle descripcion de cliente<br> 2. Listado de costos fijos filtrados por fecha => detalle muestra detalle de cada costo|
|CUU/Epic|1. Calcular ganancia marginal<br>2. Calcular proyección|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Caja<br>2. CRUD Cliente<br>3. CRUD Tasa<br>4. CRUD Venta<br>5. CRUD Pago<br>6. CRUD CostoVariable<br>7. CRUD CostoFijo<br>8. CRUD Transferencia<br>9. CRUD Ajuste<br>10. CRUD DividendoSocio<br>11. CRUD AporteSocio|
|CUU/Epic|1. Calcular ganancia marginal<br>2. Calcular proyección<br>3. Calcular cuentas por cobrar|

### Alcance Adicional Voluntario
|Req|Detalle|
|:-|:-|
|Listado<br>+<br>detalle| 3. Listado de ajustes de una caja<br> 4. Listado de ventas de un cliente<br> 5. Listado de transferencias de una caja<br> 6. Listado de aportes de socio por caja<br> 7. Listado de dividendos de socio caja|
|CUU/Epic|4. Calcular cuentas por gastar<br>5. Calcular punto de equilibrio<br>6. Mostrar movimientos de una caja|


