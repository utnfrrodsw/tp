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

Cuando un cliente visita la página web, puede explorar el catálogo de libros filtrándolos por formato, género, autor y otros criterios relevantes. Al hacer clic sobre uno, se muestra una descripción detallada y reseñas de usuarios. El cliente puede agregarlo a su lista de deseos, reservarlo antes de su lanzamiento oficial o añadirlo al carrito para consultar métodos de pago. Después de la compra, se envía un comprobante por email con los detalles del pago y la fecha estimada de entrega o retiro.

<!-- Con una interfaz intuitiva y funcionalidades simples, nos permitirá explorar y adquirir libros de manera rápida y conveniente. Podrás encontrar tus títulos favoritos, filtrar por género o autor, reservar libros de una manera más fácil y versatil y más. 

El sistema deberá contar con las siguientes funcionalidades:

* Amplia selección de libros: permitir acceder a una vasta colección de libros en diferentes géneros, temáticas y formatos, incluyendo libros físicos, electrónicos y audiolibros.
* Búsqueda avanzada: permitir al usuario utilizar opciones de búsqueda avanzadas para encontrar fácilmente sus libros favoritos por género, autor, temática y palabras clave específicas.
* Sistema de valoracion por estrellas: el usuario tendra la posibilidad de clasificar el libro adquirido en una escala del 1 al 5.
* Reseñas: permite escribir opiniones sobre los libros que ha leído y también leer las opiniones de otros usuarios.
* Lista de deseos personalizada: crear una lista de deseos con los libros que le interesan al usuario y así comprarlos en otro momento.
* Reservas de libro: realizar reservas de libros antes de su lanzamiento oficial.
* Compatibilidad con diferentes formatos: el usuario podrá escoger entre el formato que quiere el libro. Por ejemplo, si es digital, podrá descargarlo.

*[Pueden agregar más o eliminar si quieren]* -->

### Modelo

```mermaid
classDiagram
    class Libros{
        +id_libro: int
        +titulo: string
        +autor: Autores[]
        +editorial: Editorial
        +descripcion: string
        +precio: decimal
        +fecha_edicion: Date
        +categoria: Categorias[]
        +formato: FormatoLibro[]
        +obtener_informacion(): string
    }
    class Categorias{
        +id_categoria: int
        +nombre: string
    }
    class Envios{
        +id_envio: int
        +estado: string
        +fecha_entrega_estimada: Date
        +fecha_entrega_real: Date
    }
    class Reseñas{
        +id_reseña: int
        +calificacion: int
        +opinion: string
        +cliente: Clientes
        +libro: Libros
    }
    class Clientes{
        +id_cliente: int
        +nombre: string
        +apellido: string
        +email: string
        +direccion: string
        +localidad: Localidades
        +listaDeseos: Libros[]
        +registrar_pedido(libro: Libros, formato: FormatoLibro, metodoPago: MetodoPago): void
        +obtener_provincia(localidad: Localidades): Provincias
    }
    class Autores{
        +id_autor: int
        +nombre: string
        +apellidoi: string
        +obtener_libros_publicados(): Libros[]
    }
    class Provincias{
        +id_provincia: int
        +nombre: string
        +localidades: Localidades[]
    }
    class Localidades{
        +cod_postal: int
        +nombre: string
    }
    class Editoriales{
        +id_editorial: int
        +nombre: string
        +direccion: string
        +obtener_libros_publicados(): Libros[]
    }
    class Pedidos{
        +id_pedido: int
        +cliente: Clientes
        +libro: Libros[]
        +fecha_hora: Date
        +metodo_pago: MetodoPago
        +agregar_libro(libro: Libros): void
    }
    class FormatoLibro{
        +id_formato_libro: int
        +nombre: string
    }
    class MetodoPago{
        +id_metodo_pago: int
        +nombre: string
        +pedidos: Pedidos[]
    }
    class Ofertas{
        +fecha_inicio: Date
        +fecha_vencimiento: Date
        +libros: Libros[]
        +porcentaje_descuento: decimal
    }
    
    Libros "*" -- "1..*" Categorias
    Libros "*" -- "1..*" Autores
    Libros "*" -- "1" Editoriales
    Libros "*" -- "1..3" FormatoLibro
    Clientes "1" -- "*" Pedidos
    Clientes "1" -- "*" Libros
    Clientes "1" -- "*" Reseñas
    Localidades "1" -- "*" Clientes
    Pedidos "*" -- "1" MetodoPago
    Pedidos "1..*" -- "1..*" Libros: cantidad
    Localidades "*" -- "1" Provincias
    Ofertas "*" -- "1..*" Libros
    Reseñas "*" -- "1" Libros
    Envios "0..1" -- "1" Pedidos
```

![imagen del modelo](Modelo_De_Dominio.v1.PNG)  (Aún no está terminado, iré a consulta para ver qué cambiar)

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

<!-- Edité las tablas para que sean para un grupo de 4 integrantes -->

### Alcance Mínimo
- **Regularidad:**

|Req|Detalle|
|:-|:-|
|CRUD Simple|1. CRUD Categoría<br>2. CRUD Provincia<br>3. CRUD Cliente<br>4. CRUD Autor|
|CRUD Dependiente|1. CRUD Libro { depende de } CRUD Categoría y CRUD Autor<br>2. CRUD Envio { depende de } CRUD Provincia|
|Listado<br>+<br>Detalle| 1. Listado de todos los libros filtrando por categoría, muestra código de libro, título de libro, precio de libro, estado de libro => detalle CRUD Libro<br> 2. Listado de localidades disponibles, filtrado por localidad del cliente, muestra todas las  localidades y su estado (Mostraría todas las localidades que hay y su estado sería si hacen envio a esa en específico)  |
|CUU/Epic|1. Comprar un libro<br>2. Reseñar un libro<br>3. Calificar un libro |


- **Adicionales para Aprobación:**

|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Libro<br>2. CRUD Envío<br>3. CRUD Cliente<br>4. CRUD Autor<br>5. CRUD Pedido<br>6. CRUD Ofertas| (Creo que habria que agregar más)
|CUU/Epic|1. Comprar un libro<br>2. Consultar estado de envío<br>3. Reseñar un libro<br>4. Calificar un libro<br>5. Registrar cliente|


### Alcance Adicional Voluntario

<!--- Es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo --->

(Abierto a edición)
|Req|Detalle| 
|:-|:-|
|Listados|1. Listado de libros por autor<br>2. Listado de libros comprados<br>3. Listado de autores seguidos<br>4. Listado de libros agregados a la lista de deseos|
|CUU/Epic|1. Consultar historial de compras<br>2. Agregar libro a lista de deseos<br>3. Seguir a autor|
|Otros|1. ...|
