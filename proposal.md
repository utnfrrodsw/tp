# Propuesta TP DSW

## Grupo 
### Integrantes

* 46950 - Retamal, Alejo
* 47116 - Martel, Marco Antonio
* 48042 - Milo, Marina Ana
* 47141 - Fernandez, Santiago Jesus

### Repositorio

* [frontend app and backend app](https://github.com/AlejoRetamal/Trabajo-Pr-ctico---DdS) 

## Carrito de compras para una librería
### Descripción

<!-- Cuando un cliente visita la página web, puede explorar el catálogo de libros filtrándolos por formato, género, autor y otros criterios relevantes. Al hacer clic sobre uno, se muestra una descripción detallada y reseñas de usuarios. El cliente puede agregarlo a su lista de deseos, reservarlo antes de su lanzamiento oficial o añadirlo al carrito para consultar métodos de pago. Después de la compra, se envía un comprobante por email con los detalles del pago y la fecha estimada de entrega o retiro. -->

Con una interfaz intuitiva y funcionalidades simples, nos permitirá explorar y adquirir libros de manera rápida y conveniente. Podrás encontrar tus títulos favoritos, filtrar por género o autor, reservar libros de una manera más fácil y versatil y más. 

El sistema deberá contar con las siguientes funcionalidades:

* Amplia selección de libros: permitir acceder a una vasta colección de libros en diferentes géneros, temáticas y formatos, incluyendo libros físicos, electrónicos y audiolibros.
* Búsqueda avanzada: permitir al usuario utilizar opciones de búsqueda avanzadas para encontrar fácilmente sus libros favoritos por género, autor, temática y palabras clave específicas.
* Sistema de valoracion por estrellas: el usuario tendra la posibilidad de clasificar el libro adquirido en una escala del 1 al 5.
* Reseñas: permite escribir opiniones sobre los libros que ha leído y también leer las opiniones de otros usuarios.
* Lista de deseos personalizada: crear una lista de deseos con los libros que le interesan al usuario y así comprarlos en otro momento.
* Reservas de libro: realizar reservas de libros antes de su lanzamiento oficial.
* Compatibilidad con diferentes formatos: el usuario podrá escoger entre el formato que quiere el libro. Por ejemplo, si es digital, podrá descargarlo.

*[Pueden agregar más o eliminar si quieren]*

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

<!-- Edité las tablas para que sean para un grupo de 4 integrantes -->

### Alcance Mínimo
- **Regularidad:**

|Req|Detalle|
|:-|:-|
|CRUD Simple|1. CRUD Libro<br>2. CRUD Envio<br>3. (Se pueden agregar más)|
|CRUD Dependiente|1. CRUD Categoría { depende de } CRUD Libro<br>2. CRUD Localidad { depende de } CRUD Envio<br>3. CRUD Reserva { depende de } CRUD Libro<br>4. CRUD Reseña { depende de } CRUD Libro (Abierto a edición) |
|Listado<br>+<br>Detalle| 1. Listado de todos los libros filtrando por categoría, muestra código de libro, título de libro, precio de libro, estado de libro => detalle CRUD Libo<br> 2. Listado de Localidades (Localidades a las cuales se pueden hacer envios) filtrado por Localidad del cliente, muestra todas las  localidades, estado de localidad (Mostraría todas las localidades que hay y su estado sería si hacen envio a esa en específico)  |
|CUU/Epic|1. Realizar compra de un libro<br>2. Realizar reserva virtual de un libro<br>3. Registrar reseña de un libro |


- **Adicionales para Aprobación:**

|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Libro<br>2. CRUD Envio<br>3. CRUD Clientes<br>4. CRUD Socios<br>5. CRUD Autor<br>6. ...<br>7. ...| (Creo que habria que agregar más)
|CUU/Epic|1. Realizar compra de un libro<br>2. Seguir envio de la compra<br>3. Realizar reserva virtual de un libro<br>4. Registrar reseña de un libro<br>5. Registrar cliente<br>6. Registrar nuevo socio<br>7. Seguir envio de la compra |


### Alcance Adicional Voluntario

<!--- Es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo --->

(Abierto a edición)
|Req|Detalle| 
|:-|:-|
|Listados|1. ...<br>2. ...|
|CUU/Epic|1. ...<br>2. ...|
|Otros|1. ...|
