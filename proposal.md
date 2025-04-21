# Propuesta TP DSW

## Grupo
### Integrantes
* 51403 - Ramirez, Juan Nicolás
* 46752 - Pace, Matías Emanuel
* - Speranza, Facundo

### Repositorios
* [frontend app]([http://hyperlinkToGihubOrGitlab](https://github.com/pacematiase/frontend-retail-prices-comparer))
* [backend app]([http://hyperlinkToGihubOrGitlab](https://github.com/pacematiase/backend-retail-prices-comparer))
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
La aplicación permitirá realizar la carga de listas de compras para realizar en un comercio (en principio supermercado). Para cada lista de compras, la aplicación realizará una comparación de los precios de lista vigentes en los distintos comercios cargados en la aplicación y recomendará el comercio más barato.

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. Retail: Maestro de comercios<br>2. Category: Maestro de categorías de productos<br>3. ShoppingList: Cabecera de la lista de compras del usuario|
|CRUD dependiente|1. SubCategory: Maestro de sub-categorías de productos {depende de} CRUD Category<br>2. Product: Maestro de productos {depende de} SubCategory<br>3. RetailProduct: Listado de productos disponibles en un comercio {depende de} Retail y Product<br>4. ShoppingListItem: Línea de lista de compras {depende de} ShoppingList y Product<br>5. PriceList: Cabecera de la lista de precios {depende de} Product y ShoppingList<br>6. Price: Ítem de lista de precios {depende de} PriceList y Product|
|Listado<br>+<br>detalle| 1. Productos y precios filtrado por categoría, subcategoría, nombre, disponibilidad y comercio<br> 2. Histórico de precios filtrado por producto y comercio<br> 2. Histórico de carritos generados por el usuario|
|CUU/Epic|1. Cargar lista de compras<br>2. Comparar precios de lista de compras<br>3. Comparar precios a través del tiempo|

### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|CRUD |1. Keyword: Maestro de palabras clave para definir substitutos de un producto<br>2. ProductKeyword (Referencia 'Keyword' y 'Product')|
|CUU/Epic|1. Seleccionar artículo sustituto cuando no se encuentra el producto deseado <br>2. Cargar precios en lotes|
