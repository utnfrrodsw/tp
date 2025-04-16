# Propuesta TP DSW

## Grupo
### Integrantes
* 51403 - Ramirez, Juan Nicolás
* 46752 - Pace, Matías Emanuel
* 

1 CRUD simple por integrante:

Crud simples:
- Retail: Maestro de comercios.
- Category: Maestro de categorías de productos.
- ShoppingList: Cabecera de la lista de compras del usuario.

Crud dependientes:
- SubCategory: Maestro de sub-categorías de productos (Referencia 'Category').
- Product: Maestro de productos (Referencia 'SubCategory')
- RetailProduct: Listado de productos disponibles en un comercio (Referencia 'Retail' y 'Product').
- ShoppingListItem (Referencia 'Product')
- PriceList (Referencia 'Retail')
- Price (Referencia 'PriceList' y 'Product')

Listados:
- Productos y precios con filtro (Categoría, nombre, disponible en tal comercio, etc.).
- Histórico de precios por producto y comercio.
- Histórico de carritos generados por el usuario, para volver a ejecutar la comparación.

Casos de uso:
- Cargar lista de compras
- Comparar precios de lista de compras.
- Comparar precios a través del tiempo.

Adicionales:
- Keyword: Maestro de palabras clave para definir substitutos de un producto.
- ProductKeyword (Referencia 'Keyword' y 'Product')

Caso de uso:
- Seleccionar artículo sustituto cuando no se encuentra el producto deseado.

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
*2 a 6 líneas describiendo el negocio (menos es más)*

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad|
|CRUD dependiente|1. CRUD Habitación {depende de} CRUD Tipo Habitacion<br>2. CRUD Cliente {depende de} CRUD Localidad|
|Listado<br>+<br>detalle| 1. Listado de habitaciones filtrado por tipo de habitación, muestra nro y tipo de habitación => detalle CRUD Habitacion<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de habitación, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Reservar una habitación para la estadía<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out y facturación de estadía y servicios|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

