# Propuesta TP DSW

## Grupo
### Integrantes
* -	51939 - Ponzano Deluca, Benjamin 
  -	51655 - Linch, Baltasar Antonio 
  -	50715 - Felicevich, Mirko 


### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](https://github.com/BenjaPonzano/TP-backend-dsw-2025)


## Tema
### Descripción
El proyecto consiste en desarrollar un sistema web de gestión de stock para una tienda gastronomica con 3 sucursales. Permite a los administradores registrar productos e ingredientes, cargar ventas, ingresos de mercadería y elaboraciones internas. Los empleados pueden consultar el stock disponible en tiempo real desde cualquier dispositivo y registrar ventas y elaboraciones internas. El sistema centraliza la información de las tres sucursales, permitiendo al dueño tener visibilidad global del negocio desde cualquier lugar.

### Modelo
[![Modelo-Dominio-Tp-DSW.png](https://i.postimg.cc/4325L0jw/DSW1-drawio-(1).png)](https://postimg.cc/rdWxzfVt)



## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Producto<br>2. CRUD Ingrediente<br>3. CRUD Usuario|
|CRUD dependiente|1. CRUD SumaProducto {depende de} CRUD Producto<br>2. CRUD Compra {depende de}  Usuario/Producto|
|Listado<br>+<br>detalle| 1.Lista de Productos filtrado por nombre, muestra stock y precio actuales<br> 2.Historial de ingresos de stock por producto
|CUU/Epic|1. Registrar una venta(descuenta stock y genera detalle de compra)<br>2. Ingresar mercaderia al stock(crea o agrega producto)<br>|


Adicionales para Aprobación:
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD SumaProducto<br>2. CRUD SumaIngrediente<br>3. CRUD Compra<br>4. CRUD Elaboracion<br>5. CRUD PrecioProducto<br>6. CRUD PrecioIngrediente<br>|
|CUU/Epic|1. Registrar elaboracion interna(Registra elaboracion + Detalla ingrediente, descuenta ingrediente y suma producto|

### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Reporte de precios de compra de ingredientes y de productos <br>2. lista de elaboraciones filtrada por fecha y sucursal|
|CUU/Epic|1. Registrar usuario <br>2. Eliminar Usuario <br>3.Notificacion de stock bajo |



