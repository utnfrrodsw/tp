# Propuesta TP DSW

## Grupo
### Integrantes
* 53169 - Navos, Juan Ignacio
* 52238 - Crocenzi, Mateo Santiago

### Repositorio
* [Repositorio GitHub](https://github.com/juaninavos/Navos_Crocenzi-COM-305)

## Tema
### Descripción
Sistema web de compra y venta de camisetas de fútbol retro donde los usuarios pueden actuar como compradores y vendedores. Los usuarios pueden publicar camisetas con precio fijo o mediante subasta, realizar compras y participar en ofertas. El administrador gestiona usuarios, categorías, descuentos y supervisa las transacciones de la plataforma.

El sistema incluye funcionalidades de búsqueda y filtrado de productos, gestión de stock, sistema de subastas con ofertas en tiempo real, aplicación de descuentos y procesamiento de compras.

### Tipos de usuarios
- **Usuario**: Puede publicar camisetas para venta, comprar productos, participar en subastas realizando ofertas, gestionar su perfil y ver su historial de compras.
- **Administrador**: Tiene todos los permisos de usuario y además puede gestionar usuarios del sistema, crear y administrar categorías, crear descuentos promocionales, visualizar estadísticas de ventas y supervisar todas las transacciones.

### Modelo
[Diagrama de modelo de datos](https://github.com/juaninavos/Navos_Crocenzi-COM-305/blob/main/Modelo%20de%20dominio.png)

## Alcance Funcional 

### Regularidad
|Requisito|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Categoria|
|CRUD dependiente|1. CRUD Camiseta (depende de Usuario y Categoria)|
|Listado + detalle|1. Listado de camisetas filtrado por equipo, temporada, talle y condición, mostrando título, imagen, precio y estado. Al seleccionar una camiseta se muestra el detalle completo con toda la información.|
|CUU/Epic|1. Publicar camiseta para venta: permite al usuario crear una publicación eligiendo entre precio fijo o subasta, ingresando todos los datos necesarios y cargando una imagen.|

### Aprobación
|Requisito|Detalle|
|:-|:-|
|CRUD|1. CRUD Usuario<br>2. CRUD Categoria<br>3. CRUD Camiseta<br>4. CRUD Descuento<br>5. CRUD Subasta<br>6. CRUD Oferta<br>7. CRUD Compra|
|CUU/Epic|1. Publicar camiseta para venta con opción de precio fijo o subasta<br>2. Realizar ofertas en subastas: los usuarios pueden ofertar por camisetas en subasta, el sistema valida que cada oferta sea mayor a la anterior y actualiza el precio actual en tiempo real<br>3. Realizar compra de camiseta: permite al usuario agregar productos al carrito, aplicar descuentos automáticos según categorías o productos específicos, y completar la compra con procesamiento de pago|



