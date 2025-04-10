# Propuesta TP DSW

## Grupo
### Integrantes
52378 - Bustos Valentín<br>
52224 - Gambotto Angel Uriel<br>
52407 - Maidana Lucca<br>
52429 - Pennice Gastón<br>

### Repositorios
* [backend app](https://github.com/valentinbustos03/backend-app)
* [frontend app](https://github.com/valentinbustos03/frontend-app)

## Tema
### Descripción
Esta web app está diseñada para gestionar de manera integral todos los aspectos de un negocio gastronómico. Permite a los administradores, meseros, chefs y clientes interactuar en una plataforma centralizada para optimizar las operaciones, desde la toma de pedidos hasta la gestión de inventarios, horarios, pagos y experiencia del cliente. La aplicación es completamente adaptable a diferentes tipos de restaurantes, como restaurantes de comida rápida, restaurantes gourmet, cafeterías, etc.

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Menu<br>2. CRUD Usuario<br>3. CRUD Inventario<br>4. CRUD Proveedor|
|CRUD dependiente|1. CRUD Pedido {depende de} CRUD Usuario y CRUD Inventario<br>2. CRUD Reserva {depende de} CRUD Usuario|
|Listado<br>+<br>detalle| 1. Lista Pedidos: Filtrar por fecha, estado del pedido (pendiente, en preparación, entregado) => detalle CRUD Pedido<br> 2. Lista Empleados: Filtrar por turno, puesto, rendimiento. => detalle muestra datos del empleado y la calificacion de clientes|
|CUU/Epic|1. Gestionar pedidos: Los clientes realizan pedidos, y el sistema se encarga de llevarlos a la cocina para su preparación, luego son servidos por los meseros.<br>2. Gestionar reservas: Los clientes pueden reservar mesas y el restaurante confirma la disponibilidad.|
<br>

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Menu<br>2. CRUD Usuario<br>3. CRUD Inventario<br>4. CRUD Proveedor<br>5. CRUD Pedido<br>6. CRUD Reserva<br>7. CRUD Mesa|
|CUU/Epic|1. Controlar inventario: Cuando un ingrediente se está agotando, se notifica al empleado la falta de stock com los posibles proveedores.<br>2.  Analizar ventas: Los administradores generan informes sobre las ventas de cada producto y la rentabilidad del restaurante.|
<br>

### Alcance Adicional Voluntario
|Req|Detalle|
|:-|:-|
|Listados |1. Listado de clientes.<br>2. Listado de proveedores. <br>3. Listado de ingredientes filtrado por origen/tipo.<br>4. Listado de productos filtrado por categoria.<br>5. Listado de reservas filtradas por fecha y turno.|
|CUU/Epic|1. Gestionar usuarios.<br>2. Gestionar opciones del menú.<br>3. Gestionar la reposicion de ingredientes.<br>4. Gestionar productos del menú.<br>5. Gestionar promociones del menú.|
|Roles y acceso|1.Administrador<br>2. Chef<br>3. Mesero<br>4. Cliente<br>5. Invitado|
|Otros|1. Notificacion del estado de pedido a los clientes.|

