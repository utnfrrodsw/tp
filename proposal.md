# Propuesta TP DSW

## Grupo

### Integrantes

- 52077 – Boveri, Rafaela
- 52280 – Cardelli, Lázaro
- 50258 – Martina, Santiago
- 51191 – Mateo, Alexis

### Repositorios

- [frontend app](https://github.com/AlexisMateo02/tp_frontend_dsw)
- [backend app](https://github.com/AlexisMateo02/tp_backend_dsw)

## Tema

### Descripción

_El sistema a desarrollar será una plataforma web para la compra y venta de productos náuticos nuevos y usados, como kayaks, remos y accesorios.
Los usuarios podrán registrarse, realizar compras, gestionar entregas y dejar valoraciones de nuestros productos.
En paralelo, la plataforma ofrecerá un foro de ventas en donde los usuarios podrán realizar publicaciones, en el cual otros usuarios se podrán contactar con los vendedores si les interesa._

### Diagrama de Entidad-Relación

![Diagrama de Entidad-Relación](docs/DSW_MD_y_DER-DER.drawio.png)

## Alcance Funcional

### Alcance Mínimo

Regularidad
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo_Kayak<br>2. CRUD Tipo_Articulo<br>3. CRUD Localidad<br>4. CRUD Provincia|
|CRUD dependiente|1. CRUD Producto {depende de} Tipo_Kayak / Tipo_Articulo/ Tipo_Embarcacion/ Tipo_SUP<br>2. CRUD Punto de entrega {depende de} Localidad<br>3. CRUD Localidad {depende de} Provincia
|Listado<br>+<br>detalle| 1. Listado de publicaciones filtrado por nombre de producto y/o vendedor => detalle muestra producto, precio y contacto<br> 2. Listado de productos filtrado por nombre, tipo, estado(nuevo/usado) y ordenar por precio => detalle muestra descripción y especificaciones técnicas|
|CUU/Epic|1. Publicar productos para la venta (gestión completa de una publicación)<br>2. Realizar una compra (selección de publicaciones + pago)|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo_Kayak<br>2. CRUD Tipo_Articulo<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Producto<br>6. CRUD Punto_Entrega<br>7. CRUD Usuario |
|CUU/Epic|1. Publicar productos para la venta<br>2. Realizar una compra mediante múltiples pagos<br>3. Valorar a un producto <br>4. Consultar el historial de compras y publicaciones realizadas<br>5. Gestionar publicaciones existentes, incluyendo modificación<br>6. Consultar pagos realizados en compras|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                                 |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Historial de compras de un comprador con filtros por fecha y estado<br>2. Publicaciones realizadas por un vendedor con detalle de la publicación y puntos de entrega |
| CUU/Epic | 1. Edición de publicaciones (solo si están activas)<br>2. Cancelar una compra pendiente                                                                                 |
| Otros    | 1. Envío de notificación por email al concretar una compra                                                                                                              |
