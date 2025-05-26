# Propuesta TP DSW

## Grupo
### Integrantes
* 52901 - Morganti, Candela
* 53497 - Fabbri, Agustin Leonel
* 49941 - Del Popolo, Chiara
* 49853 - Gianotto, Leandro


### Repositorios
* [fullstack app](https://github.com/agusfabbri/DSW2025-Fabbri_Morganti_DelPopolo_Gianotto)


## Tema
### Descripción
El proyecto es un sistema de e-commerce de tecnología donde los usuarios pueden registrarse, iniciar sesión, explorar productos organizados en distintas categorías (como celulares, computadoras y accesorios), agregar artículos al carrito, realizar compras y hacer seguimiento del estado de sus pedidos. Cada producto contará con información básica como nombre, precio, descripción, imagen y disponibilidad de stock. Además, los usuarios podrán dejar reseñas y calificaciones en los productos que hayan comprado. El pago de las compras se realizará a través de la pasarela de pago Mercado Pago, lo que brinda una solución segura y práctica para el usuario.
Desde el lado del administrador (vendedor), el sistema permitirá gestionar el catálogo de productos, actualizar stock y administrar los pedidos recibidos, cambiando su estado según el avance (por ejemplo: pendiente, enviado, entregado). 

### Modelo
![dsw2](https://github.com/user-attachments/assets/27058b21-ed13-409d-8c8a-8d640d9f9215)


## Alcance Funcional 

### Alcance Mínimo
|Req|Detalle|
|:-|:-|
|CRUD simple |1. CRUD Producto<br>2. CRUD Categoria<br>3. CRUD Usuario|
|CRUD dependiente |1. CRUD Peduido (depende de) CRUD Usuario<br>2. CRUD Detalle de pedido (depende de) CRUD Producto|
|Listado<br>+<br>detalle |1. Listado de productos filtrado por categoría o nombre, muestra nombre, precio, stock ⇒ detalle CRUD Producto<br>2. Listado de pedidos filtrado por usuario, muestra número de pedido, fecha, total ⇒ detalle muestra datos completos del pedido y productos incluidos|
|CUU/Epic|1. Agregar productos al carrito y realizar una compra<br>2. Visualizar historial de compras|



Adicionales
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Reseñas de productos<br>2. CRUD Métodos de pago<br>3. CRUD Dirección de envío<br>4. CRUD Estado de pedido<br>5. CRUD Notificaciones<br>6. CRUD Carrito de compras|
|CUU/Epic|1. Calificar productos comprados<br>2. Modificar datos personales y dirección<br>3. Consultar estado de un pedido|

