# FAQ
## Soporte de la cátedra a tecnologías y lenguaje de programación

### Otras Tecnologías: runtimes, frameworks o librerías
La cátedra dará soporte a las tecnologías dadas durante el cursado (por ejemplo NodeJS, Express y Angular).

Es bienvenido que los alumnos opten por el uso de otras tecnologías equivalentes por motivos de aprendizaje, curiosidad o motivación propia, deberán informarlo claramente en la proposal y ser aprobado por el profesor.

En este caso la cátedra no puede asegurar que sea capaz de proveer soporte para estas tecnologías y por lo tanto es responsabilidad de el/los alumnos de cumplir con los requisitos del TP al utilizarlas.

### Otros Lenguajes de programación
El uso de otro lenguaje de programación debe presentarse en la proposal con una justificación detallada de por qué JS no es adecuado para realizar el TP y el lenguaje propuesto debe cumplir con las siguientes condiciones:
* Permitir la ejecución de código asíncrono mediante event loop, corrutinas y promesas o técnicas equivalentes (no threads).
* Proveer frameworks web y permitir la construcción de una API.
* Mantener la separación de Frontend y Backend.
* Cubrir la deficiencia de JS indicada en la descripción.

Ejemplos podrían ser el uso de web assembly o Flutter + Dart.

## Repositorio
1. El desarrollo del trabajo práctico debe respaldarse mediante un repositorio git en github o gitlab al que los docentes deben tener acceso.
2. El repo debe ser creado a partir de un Fork del TP y deberán realizar un PR/MR para su entrega.
3. Se evaluará el uso apropiado de git, la continuidad en el desarrollo y los aportes que haya realizado cada integrante.

## Bases de datos
Se podrá utilizar cualquier base de datos relacional o no-relacional que cumpla con estos requisitos:
* Ser un servicio independiente al que se debe conectar (no una base de datos embebida).
* Debe tener persistencia de datos en disco.
* Debe accederse por medio de un ORM (o si no existe ninguno implementar el patrón repository).
* Debe permitir concurrencia de usuarios.
* No debe requerir ejecutarse en local.

## Alcance Funcional
   * **CRUD**: significa implementar las operaciones de Create, Read, Update y Delete de una Clase de negocio
	* **CRUD Simple** Es un CRUD de una Clase de negocio que no dependa ni requiera de otras. Por ejemplo en un carrito de compra las categorías de los productos.
	* **CRUD Dependiente** hace referencia a implementar un CRUD de una Clase de negocio que tenga una referencia a otra(s). Por ejemplo en un carrito de compra serían los productos que tienen una referencia a la categoría.
	* **CRUDs adicionales**: En caso que la app requiera más apps de las mínimas exigidas por el TP. Durante la etapa de regularidad pueden realizarse directamente en la base de datos y hacerse mediante la app para la entrega de aprobación.
	* **Mostrar detalle**:  El detalle de algún elemento del listado debe realizar una request al backend y (ya sea redirigiendo el elemento o en la misma página) debe permitir una de las opciones siguiente:
		* Mostrar más información que la disponible en el listado. Debe contener información de al menos 2 clases de negocio.
		* Redirigir al CRUD del elemento seleccionado.
	  Por ejemplo:	
		* En un listado de ventas donde se muestra fecha, nombre del cliente y monto total al seleccionar un elemento podría mostrar los datos de la venta y detallar los productos comprados, precio y cantidad, descuentos si hubiera, etc.
		* En un listado de productos podría redirigir al CRUD de productos.
	* **Caso de uso de usuario o epic con valor para el negocio**: Quiere decir implementar la/las operaciones necesarias para realizar un caso de uso que genera valor para el negocio. Por ejemplo tres casos de uso para un carrito de compras:
		* Vender. incluye agregar un producto al carrito y confirmar la compra al finale y brindar los datos de entrega y pago.
		* Valorar un producto comprado. Incluye para un cliente poder comentar y dar una puntuación a un sobre un producto comprado y mostrar dicha valoración y comentario en el detalle del producto.
		* Valorar un venta. Dar una puntuación y/o comentar sobre una venta completa y que se puedan mostrar los comentarios o puntuación en otro lugar.
	  El objetivo es realizar una o más acciones que utilicen la información brindada por casos de uso o CRUDs anteriores. Los casos de usos pueden estar relacionados entre si o no.
	  Ante la eventualidad que un caso de uso o epic presente demasiados escenarios se podrá pactar cuales implementar con los docentes
## Grupos
Los grupos deben ser de entre 2 y 4 integrantes.

**Trabajo individual**: Se desaconseja el realizar el trabajo de forma individual; pero si algún alumno tiene causas específicas, personales y fuera de su control que impidan realizar el trabajo en equipo de forma eficiente debe informarlo previamente al profesor y obtener su autorización para realizar el TP de manera individual.