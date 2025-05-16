# Propuesta TP DSW

## Grupo
### Integrantes
* 52292 - Gonzales Diaz, Mauricio Renzo
* 52159 - Montaña, Tomas
* 53240 - Tobarez, Ariadna Luz Melody

### Repositorios
* [Fullstack app](https://github.com/mauriciogonzales98/GestionGastos)

## Tema
### Descripción
Sistema de registro de gastos. El usuario puede registrar sus gastos e ingresos de dinero, la fuente y categorizarlos. Crear sus propias categorias y ver un resumen de sus gastos y un deglose por categorias de cuanto se ha gastado en cada una en un determinado periodo de tiempo.

### Modelo
![DSW Gestor de Gastos - Page 1](https://github.com/user-attachments/assets/c0b8e586-ad5f-4ba7-87eb-53bcf623aeac)


## Alcance Funcional 

### Alcance Mínimo 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Categoría<br>3. CRUD Método de Pago<br>|
|CRUD dependiente|1. CRUD Wallet {depende de} CRUD Usuario<br>2. CRUD Movimiento {depende de} CRUD Wallet<br>3. CRUD Notificación {depende de} CRUD Movimiento|
|Listado<br>+<br>detalle| 1. Listado de gastos filtrado por categoría, muestra total de dinero gastado en cada categoría => detalle CRUD Gasto<br>|
|CUU/Epic|1. Registrar movimiento<br>2. Importar Movimientos<br>3. Crear Wallet<br>|

Aprobacion directa:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Categoria<br>3. CRUD Notificacion<br> 4. CRUD Metodo de pago|
|CRUD dependiente|1. CRUD Wallet {depende de} CRUD Usuario<br>2. CRUD Movimiento {depende de} CRUD Wallet<br>3. CRUD Notificación {depende de} CRUD Movimiento| 1. Listado de gastos filtrado por categoria, muestra total de dinero gastado en cada categoria => detalle CRUD Gasto<br> 2. Listado de movimientos filtrados por tipo => detalle CRUD Movimiento|
|CUU/Epic|1. Registrar movimiento<br>2. Importar Movimientos<br>3. Crear Wallet<br>4. Enviar notificación de gasto fijo.
