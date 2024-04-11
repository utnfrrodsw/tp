# Propuesta TP DSW

## Grupo
### Integrantes
* 47884 - Ramirez, Ignacio - (Com 305)
* 48947 - Sarkissian, Milton - (Com 304)
* 49687 - Dominio, Constanza - (Com 304)

### Repositorios
* [frontend app](https://github.com/Ignacioramirez98/Tp-Dsw-FrontEnd)
* [backend app](https://github.com/Ignacioramirez98/Tp-Dsw-BackEnd)

## Tema
### Descripción
  Se pretende crear CRM (Customer Relationship Management) para una empresa que vendedora de maquinarias agricolas y prestadora de servicios en relación a las mismas. Se intenta manejar desde el momento de la generación de una lead u oportunidad de venta a través de la página web hasta que se concrete de manera exitosa o no la misma.

### Modelo

![imagen del modelo](https://github.com/Ignacioramirez98/Tp-Dsw-Com304-305-Dominio-Ramirez-Sarkissian/blob/main/modeloFinal.jpg)

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cliente<br>2. CRUD Venta<br>3. CRUD Producto|
|CRUD dependiente|1. CRUD Venta {depende de} CRUD Cliente<br>2. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de Clientes, muestra idCliente, nombre, apellido, localidad, mail y telefono  => detalle CRUD Cliente<br> 2. Listado de Ventas filtrado por rango de fecha => detalle muestra datos completos de la Venta|
|CUU/Epic|1. Solicitar un Servicio<br>2. Concretar Venta|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cliente<br>2. CRUD Venta<br>3. CRUD Producto<br>4. CRUD Vendedor<br>5. CRUD Servicio<br>6. CRUD Operario|
|CUU/Epic|1. Solicitar un Servicio<br>2. Concretar Venta<br>3. Realizar facturación de la Venta|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Productos, muestra idProducto, descripcion, precio, stock <br>2. Servicio muestra idServicio, descripcion, precio|
|CUU/Epic|1. Cancelación de la Venta<br>2. Envío de presupuesto|
|Otros|1. Envío de recepción de solicitud de Servicio|

