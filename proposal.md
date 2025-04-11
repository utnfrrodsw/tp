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
![imagen del modelo](https://i.imgur.com/rL6mvqs.png)

## Alcance Funcional 

### Alcance Mínimo 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD CategoriaIngreso<br>3. CRUD CategoriaGasto<br>4. CRUD Notificacion<br> 5. Metodo de pago|
|CRUD dependiente|1. CRUD Wallet {depende de} CRUD Usuario<br>2. CRUD Gasto {depende de} CRUD Movimiento<br>3. CRUD Ingreso {depende de} CRUD Movimiento|
|Listado<br>+<br>detalle| 1. Listado de gastos filtrado por categoria, muestra total de dinero gastado en cada categoria => detalle CRUD Gasto<br> 2. Listado de ingresos y egresos de dinero, muestra fecha, monto y categoria|
|CUU/Epic|1. Registrar movimiento<br>2. Registrar un usuario<br>3. Consultar balance de gastos<br>4. Enviar notificacion de gasto mensual por mail.|
