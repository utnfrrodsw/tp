# Propuesta TP DSW

## Grupo
### Integrantes
* 51565 - Bonaroti, Francisco
* 49539 - Salerno, Nicolás
* 50708 - Vacs, Francisco

### Repositorios
* [frontend app](https://github.com/FranciscoVacs/Bohemia_FE)
* [backend app](https://github.com/FranciscoVacs/Bohemia_BE)

## Tema
### Descripción
Bohemia es una plataforma web desarrollada para la gestión y venta de entradas de las fiestas de la marca "Bohemia" en Argentina.

Sus principales características son:
Venta de Entradas: Permite a los usuarios comprar tickets de manera segura (con integración de MercadoPago), manejando sistemas de tandas (precios escalonados).
Gestión de Eventos: El administrador puede crear eventos y configurar los tickets de los mismos.
Experiencia de Usuario: Incluye registro de perfiles, historial de compras y generación automática de entradas con código QR para el acceso al evento.
Visualizacion de albumes de fotos de los eventos pasados.
Tecnológicamente, es una aplicación full-stack construida con Angular y Tailwindcss en el frontend y Node.js/Express con MySQL en el backend.

### Modelo![BohemiaPageDER](https://github.com/user-attachments/assets/9e5c26c1-59d9-47f8-b360-f31b5da2419f)

<img width="1509" height="739" alt="bohemia_DER drawio" src="https://github.com/user-attachments/assets/c3cb4745-11f7-4b2a-94f6-0e8877a0884c" />





## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Evento <br>2. CRUD Usuario<br>3. CRUD Djs|
|CRUD dependiente|1. CRUD Tipo de Ticket {depende de} CRUD Evento <br>2. CRUD Locacion {depende de} CRUD Ciudad|
|Listado<br>+<br>detalle| 1. Listado de eventos filtrado por ciudad, muestra fecha, ubicación y estado del evento=> detalle muestra datos completos del evento<br> 2. Listado de tipos de entrada filtrado por orden, muestra precio, estado y stock|
|CUU/Epic|1. Crear Evento <br>2. Comprar entrada|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo entrada<br>2. CRUD Usuario<br>3. CRUD Ciudad<br>4. CRUD Entrada<br>5. CRUD Evento<br>6. CRUD Compra<br>7. CRUD Galería<br>8. CRUD Djs<br>9. CRUD Locacion
|CUU/Epic|1. Crear Evento<br>2. Comprar entrada<br>3. Crear y ver galería|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados ||
|CUU/Epic|Generar entrada en PDF con código QR|
|Otros|Integración de compra con Mercado Pago | Subida de galerías de fotos a Cloudinary|

