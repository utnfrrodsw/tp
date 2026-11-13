# Propuesta TP DSW

## Grupo
### Integrantes
* 40533 - ALICE, Mauro Elias

### Repositorios
* [fullstack app](https://github.com/maualice/TP-DSW-ALICE)

## Tema
### Descripción
La ferretería se dedica a la comercialización de herramientas, materiales de construcción y artículos para el hogar, electricidad y plomería. El proyecto propone desarrollar una tienda online que permita gestionar productos, categorías, pedidos y clientes, incorporando pagos digitales, un sistema de beneficios por puntos y herramientas de administración, automatización y asistencia virtual para mejorar la experiencia de compra y la gestión del negocio

### Modelo
* [Modelo de dominio](https://github.com/maualice/TP-DSW-ALICE/blob/main/Modelo.png)

## Alcance Funcional 

## 1. Alcance Mínimo — Regularidad

| Req. | Detalle |
|---|---|
| CRUD simple | 1. CRUD de Categoría.<br>2. CRUD de Producto. |
| CRUD dependiente | 1. CRUD de Producto (depende de Categoría). |
| Listado + detalle | 1. Listado de productos filtrado por categoría, nombre y disponibilidad de stock; muestra nombre, precio, categoría y stock.<br>2. Listado de órdenes del usuario autenticado, mostrando número, fecha, estado y total; el detalle muestra los productos, cantidades, precios y datos de pago. |
| CUU / Epic | 1. Registrarse e iniciar sesión.<br>2. Agregar productos al carrito y gestionar sus cantidades.<br>3. Confirmar una compra y generar una orden.<br>4. Realizar el pago mediante Mercado Pago. |

## 2. Adicionales para Aprobación

| Req. | Detalle |
|---|---|
| CRUD | 1. CRUD de Usuario (administración).<br>2. CRUD de Categoría.<br>3. CRUD de Producto.<br>4. CRUD de Descuento. |
| Listados | 1. Listado de órdenes filtrado por fecha, estado y cliente, con acceso al detalle de cada orden.<br>2. Listado de productos con stock crítico.<br>3. Panel administrativo con métricas de ventas, órdenes y productos. |
| CUU / Epic | 1. Gestionar órdenes desde el panel administrativo.<br>2. Administrar usuarios y asignar roles de acceso (`user` y `admin`).<br>3. Consultar el estado de los pagos y su asociación con las órdenes.<br>4. Acumular puntos por compras y canjearlos por descuentos. |

## 3. Alcance Adicional Voluntario

| Req. | Detalle |
|---|---|
| Listados y reportes | 1. Generación de reportes de ventas por período.<br>2. Reporte de productos más vendidos y niveles de stock. |
| CUU / Epic | 1. Asistente conversacional para elaborar presupuestos según los productos y cantidades solicitados por el cliente.<br>2. Aplicación de descuentos mediante el canje de puntos. |
| Automatización | 1. Envío de notificaciones de stock crítico mediante n8n.<br>2. Notificaciones sobre cambios de estado de las órdenes y confirmaciones de pago. |
| Otros | 1. Historial de puntos acumulados y canjeados.<br>2. Validación de permisos según el rol del usuario. |
