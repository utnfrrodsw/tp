# Propuesta TP DSW

## Grupo

### Integrantes

- 47403 - Gómez, Agustín
- 46804 - Pitavino, Tomás
- 52967 - Bertotti, Santino
- 49806 - Zajarías, Enzo

### Repositorios

- [frontend app](https://github.com/lordagustin22/ECommerce-dsw-frontend)
- [backend app](https://github.com/lordagustin22/ECommerce-dsw-backend)

## Tema

### Descripción

Esto es un E-commerce de una mueblería. Los clientes podrán buscar, filtrar cada producto en un catálogo que se les muestra, así como agregarlos a favoritos. Los productos se pueden agregar directamente al carrito o pasar al checkout inmediatamente. Al hacer checkout se puede elegir el medio de pago que más le convenga al cliente. Conforme un cliente compra muchos productos, se les va otorgando puntos que les permitirán tener descuentos. Los costos de envío se reducirán cuando los clientes compren en mucha cantidad. Las compras en mucha cantidad son consideradas como compras mayoristas. Hay un sistema de reseñas donde cada cliente puede dejar su opinión del producto.

Los administradores pueden subir, actualizar, gestionar y borrar cada uno de los productos.

### Modelo

![imagen del modelo](E-Commerce-DER.png)

## Alcance Funcional

### Alcance Mínimo

Regularidad:

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Cliente<br>2. CRUD Material<br>3. CRUD Descuento<br>4. CRUD Categoría|
|CRUD dependiente|1. CRUD Mueble {depende de} CRUD Material y CRUD categoria<br>2. CRUD Lista de Favoritos {depende de} CRUD Cliente|
|Listado<br>+<br>detalle| 1. Listado de muebles filtrado por categoría y etiqueta de mueble, muestra nombre, precio y stock => detalle CRUD Mueble<br> 2. Listado de productos en carrito filtrado por rango de fecha, muestra nro de producto, cantidad pedida, descuento si es aplicable, estado y nombre del cliente => detalle muestra datos completos del pedido y del cliente|
|CUU/Epic|1. Realizar pedido <br>2. Realizar el pago del pedido <br> 3. Gestión del pedido (estado de realización y/o entrega)|

Adicionales para Aprobación

|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cliente<br>2. CRUD Mueble<br>3. CRUD Categoría<br>4. CRUD Lista de Favoritos<br>5. CRUD Historial<br>7. CRUD Descuento|
|CUU/Epic|1. Realizar pedido <br>2. Realizar el pago del pedido<br> 3. Gestión del pedido (estado de realización y/o entrega) <br>4. Reseña con moderación<br>5. Pago con stripe/ML (AD)|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Filtrado de productos agregados a favoritos ordenados por fecha (de agregado a favoritos), muestra mueble, cliente y fondos <br>2. Historial de productos comprados filtrados por cliente muestra datos del cliente y de cada producto fechas, estado, descripcion del producto, stock, categoria y etiqueta<br>3. Historial de productos comprados por el cliente filtrados por un rango de fechas, muestra fecha de pago realizado, cantidad comprada, precio unitario, subtotal y precio total |
| CUU/Epic | 1. Cancelación de pedido<br>2. Cancelación de pedidos                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Otros    | 1. Alertas cuando un producto favorito baja de precio o vuelve a stock.                                                                                                                                                                                                                                                                                                                                                                                                                              |

1. Modelado del Negocio

- Clientes:
  - Compradores de muebles

- Administradores:
  - Gestionan catálogo, pedidos y usuarios.

2. Requisitos Funcionales
   - Para Clientes:
     - Registro/login (email o redes sociales).
     - Catálogo de muebles con filtros (categoría, precio, material).
     - Carrito de compras + checkout
     - Historial de pedidos.
     - Reseñas y ratings.

   - Para Administradores:
     - Panel de control (CRUD de productos, usuarios).
     - Gestión de inventarios
     - Dashboard de ventas
     - Gestión de envíos

3. MVP (Mínimo Producto Viable)
   - Fase 1: Catálogo + carrito + checkout básico.
   - Fase 2: Administrador + Usuario + Autenticación + panel de administrador.
   - Fase 3 (opcional): Dashboard de ventas + reseñas + integración con logística.
