# FAQ
* Soporte de la cátedra a tecnologías y lenguaje de programación
* Repositorio
* Otros runtimes
* Otros frameworks
* Bases de datos
* Alcance Funcional
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
* **Grupos**.
* 

