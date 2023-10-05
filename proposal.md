# Propuesta TP DSW

## Grupo

### Integrantes

-   46950 - Retamal, Alejo
-   48042 - Milo, Marina Ana
-   ~~47116 - Martel, Marco Antonio~~
-   ~~47141 - Fernandez, Santiago Jesús~~

### Repositorio

-   [frontend app and backend app](https://github.com/AlejoRetamal/Trabajo-Pr-ctico---DdS)

## Carrito de compras para una librería

### Descripción

Cuando un cliente visita la página web, puede explorar el catálogo de libros filtrándolos por formato, categoría, autor y otros criterios relevantes. Al hacer clic sobre uno, se muestra una descripción detallada y reseñas de usuarios. El cliente puede agregarlo a su lista de deseos o añadirlo al carrito para consultar métodos de pago y envío. Después de la compra, se envía un comprobante por email con los detalles del pago y la fecha estimada de entrega o retiro.

<!-- Con una interfaz intuitiva y funcionalidades simples, nos permitirá explorar y adquirir libros de manera rápida y conveniente. Podrás encontrar tus títulos favoritos, filtrar por género o autor, reservar libros de una manera más fácil y versatil y más.

El sistema deberá contar con las siguientes funcionalidades:

* Amplia selección de libros: permitir acceder a una vasta colección de libros en diferentes géneros, temáticas y formatos, incluyendo libros físicos, electrónicos y audiolibros.
* Búsqueda avanzada: permitir al usuario utilizar opciones de búsqueda avanzadas para encontrar fácilmente sus libros favoritos por género, autor, temática y palabras clave específicas.
* Sistema de valoracion por estrellas: el usuario tendra la posibilidad de clasificar el libro adquirido en una escala del 1 al 5.
* Reseñas: permite escribir opiniones sobre los libros que ha leído y también leer las opiniones de otros usuarios.
* Lista de deseos personalizada: crear una lista de deseos con los libros que le interesan al usuario y así comprarlos en otro momento.
* Reservas de libro: realizar reservas de libros antes de su lanzamiento oficial.
* Compatibilidad con diferentes formatos: el usuario podrá escoger entre el formato que quiere el libro. Por ejemplo, si es digital, podrá descargarlo. -->

### Modelo

```mermaid
classDiagram
    class Libro{
        +id: int
        +isbn: string
        +titulo: string
        +autores: Autor[]
        +editorial: Editorial
        +idioma: string
        +descripcion: string
        +precio: decimal
        +fecha_edicion: Date
        +categorias: Categoria[]
        +formatos: FormatoLibro[]
    }
    class Categoria{
        +id: int
        +descripcion: string
    }
    class Envio{
        +id: int
        +estado: string
        +fecha_entrega_estimada: Date
        +fecha_entrega_real: Date
    }
	class HistorialPreciosEnvio{
		+fecha_ini: Date
		+fecha_fin: Date
		+precio: decimal
		+envio_gratis: decimal
	}
    class Reseña{
        +id: int
        +calificacion: int
        +opinion: string
        +cliente: Usuario
        +libro: Libro
    }
    class Usuario{
        +id: int
        +nombre: string
        +apellido: string
        +email: string
        +direccion: string
        +localidad: Localidad
        +avatar: string
        +tipo: string
    }
    class Autor{
        +id: int
        +nombre: string
        +apellido: string
    }
    class Provincia{
        +id: int
        +descripcion: string
    }
    class Localidad{
        +cod_postal: int
        +descripcion: string
        +provincia: Provincia
    }
    class Editorial{
        +id: int
        +descripcion: string
        +direccion: string
    }
    class Pedido{
        +id: int
        +cliente: Usuario
        +fecha_hora: Date
        +metodo_pago: string
    }
    class FormatoLibro{
        +id: int
        +descripcion: string
    }
    class Cuota{
        +fecha_venc: Date
	+fecha_pago: Date
    }
    class Oferta{
        +id: int
        +fecha_ini: Date
        +fecha_fin: Date
        +porcentaje_descuento: decimal
    }

    Libro "*" -- "1..*" Categoria
    Libro "*" -- "1..*" Autor
    Libro "*" -- "1" Editorial
    Libro "*" -- "1..3" FormatoLibro
    Usuario "1" -- "*" Pedido
    Usuario "1" -- "*" Libro: listaDeseos
    Usuario "1" -- "*" Reseña
    Localidad "1" -- "*" Usuario
    Pedido "1" -- "1..*" Cuota
    Localidad "*" -- "1" Provincia
    Oferta "*" -- "1..*" Libro
    Reseña "*" -- "1" Libro
    Envio "0..1" -- "1" Pedido
    Pedido "*" -- "1..*" Libro : cantidad int
    Usuario "*" -- "*" Autor: autoresSeguidos

note for FormatoLibro "Ejemplos: físico,
digital, audiolibro..."

note for HistorialPreciosEnvio "Si el importe total de un pedido
supera el valor de 'envio_gratis'
el envío será gratuito"

```

## Alcance Funcional

### Alcance Mínimo

#### Regularidad:

| Req                     | Detalle                                                                                                                                                                                                                                  |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CRUD Simple             | 1. CRUD Provincia<br>2. CRUD Autor<br>3. CRUD Categoría<br>4. CRUD Editorial                                                                                                                                                             |
| CRUD Dependiente        | 1. CRUD Localidad **{depende de}** CRUD Provincia.<br>2. CRUD Libro **{depende de}** CRUD Autor, CRUD Categoría y CRUD Editorial.                                                                                                        |
| Listado<br>+<br>Detalle | 1. Listado de libros filtrado por categoría, muestra ISBN, título, autores, editorial y precio → **detalle CRUD Libro**.<br> 2. Listado de libros filtrado por autor, muestra ISBN, título, editorial y precio → **detalle CRUD Libro**. |
| CUU/Epic                | 1. Comprar libro<br>2. Consultar estado de envío                                                                                                                                                                                         |

-   **Consideraciones:**

    **[i]** El CRUD de Usuario se desarrollará en el alcance para la promoción. En el alcance para la regularidad, para garantizar la funcionalidad del sistema, se incluirá un par de clientes preexistentes.

    **[ii]** El CRUD de los Formatos de los Libros no se implementará, pues estarán previamente cargados e incluíran opciones como: físico, digital y audiolibro.

---

#### Adicionales para Aprobación:

| Req      | Detalle                                                                                                                                                                                                                                            |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CRUD     | 1. CRUD Provincia<br>2. CRUD Autor<br>3. CRUD Categoría<br>4. CRUD Editorial<br>5. CRUD Localidad<br>6. CRUD Usuario<br>7. CRUD Libro<br>8. CRUD Reseña<br>9. CRUD Oferta<br>10. CRUD Pedido **<sup>[1]<sup>**<br>11. CRUD Envío **<sup>[2]<sup>** |
| CUU/Epic | 1. Comprar libro<br>2. Consultar estado de envío<br>3. Cancelar pedido<br>4. Reseñar libro<br>                                                                                                                                                     |

-   **Consideraciones:**

    **[1]:** Contará con un detalle de pedido y la cantidad de cuotas seleccionadas por el usuario como método de pago.

    **[2]:** Contará con un historial de precios de envío que será igual para todos los envíos. Salvo que el importe total del pedido supere el umbral establecido en el sistema como "envio_gratis", en ese caso, el envío será gratuito.

---

### Alcance Adicional Voluntario

<!--- Es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo --->

| Req      | Detalle                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Listado de ofertas vigentes filtrado por fecha actual, muestra fecha de fin, porcentaje de descuento y libros.<br>2. Listado de pedidos filtrado por usuario, muestra fecha y hora, estado, importe total, método de pago y libros adquiridos con su cantidad.<br>3. Listado de autores seguidos filtrado por usuario, muestra nombre y apellido.<br>4. Listado de libros en la lista de deseos filtrado por usuario, muestra ISBN, título, autores, editorial y precio. |
| CUU/Epic | 1. Consultar historial de compras<br>2. Agregar libro a lista de deseos<br>3. Seguir a autor                                                                                                                                                                                                                                                                                                                                                                                |
| Otros    | 1. Envío de comprobante de compra con los detalles del pago y la fecha estimada de entrega o retiro por email.                                                                                                                                                                                                                                                                                                                                                              |
