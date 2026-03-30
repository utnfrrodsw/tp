# Propuesta TP DSW

## Grupo
### Integrantes
* 51403 - Ramirez, Juan Nicolás
* 46752 - Pace, Matías Emanuel
* 48711 - Speranza, Facundo

### Repositorios
* ([frontend app](https://github.com/pacematiase/frontend-retail-prices-comparer))
* ([backend app](https://github.com/pacematiase/backend-retail-prices-comparer))

## Tema
### Descripción
La aplicación permitirá realizar la carga de listas de compras para realizar en un comercio (en principio supermercado). Para cada lista de compras, la aplicación realizará una comparación de los precios de lista vigentes en los distintos comercios cargados en la aplicación y recomendará el comercio más barato.

### Modelo
![ModeloDeDominio.png](https://github.com/pacematiase/tp/blob/main/ModeloDeDominio.png)

## Alcance Funcional 
### Alcance
|Req|Detalle|
|:-|:-|
|CRUD simple|1. Retail: Maestro de comercios<br>2. Category: Maestro de categorías de productos<br>3. User: Usuarios del sistema|
|CRUD dependiente|1. ShoppingList: Cabecera de la lista de compras del usuario {depende de} User<br>2. SubCategory: Maestro de sub-categorías de productos {depende de} CRUD Category<br>3. Product: Maestro de productos {depende de} SubCategory<br>4. RetailProduct: Listado de productos disponibles en un comercio {depende de} Retail y Product<br>5. ShoppingListItem: Línea de lista de compras {depende de} ShoppingList y Product<br>6. Price: Ítem de lista de precios {depende de} RetailProduct|
|Listado<br>+<br>detalle| 1. Productos y precios filtrado por categoría, subcategoría, nombre, disponibilidad y comercio<br> 2. Histórico de precios filtrado por producto y comercio<br> 3. Histórico de carritos generados por el usuario|
|CUU/Epic|1. Cargar lista de compras y comparar precios<br>2. Generar información estadística acerca de los resultados históricos obtenidos al comparar listas de compras|

### Alcance Adicional Voluntario
|Req|Detalle|
|:-|:-|
|CRUD |1. Keyword: Maestro de palabras clave para definir substitutos de un producto<br>2. ProductKeyword (Referencia 'Keyword' y 'Product')|
|CUU/Epic|1. Seleccionar artículo sustituto cuando no se encuentra el producto deseado <br>2. Cargar precios en lotes|
