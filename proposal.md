# Propuesta TP DSW

## Grupo
### Integrantes
* 48059, Taborra Facundo
* 48271, Buschittari Nahuel
* 47793, Obiedo Agustín
* 48026, Ignacio Di Martino

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Es una aplicación móvil para ayudar a los clientes a encontrar servicios específicos, como plomeros, electricistas, servicios de internet, y más. Con esta aplicación, los usuarios podrán buscar y comparar presupuestos, conocer los tiempos de trabajo estimados y coordinar una fecha y hora para llevar a cabo sus proyectos. Esto proporcionará una gran facilidad a los clientes al permitirles encontrar el mejor servicio para sus necesidades, al tiempo que fomenta una competencia directa entre diferentes empresas. Además, los clientes podrán dejar reseñas sobre los servicios recibidos, lo que ayudará a mejorar la calidad del trabajo de las empresas involucradas.

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

Desde el registro de cliente y/o prestador de servicios hasta el pedido y pago de dicho servicio de la reseña del lado del cliente. Del lado del presetador tendremos la posibilidad de armar presupuestos, enviarlos y recibir los pagos.

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Localidad <br>2. CRUD Profesion (por el cliente)<br>3. CRUD Anuncio|
|CRUD dependiente|1. CRUD Presupuesto {depende de} CRUD Anuncio<br>2. CRUD Cliente y Prestador {depende de} CRUD Localidad<br>3. CRUD Prestador {depende de} CRUD Profesion|
|Listado<br>+<br>detalle| 1. Listado de Servicios Requeridos filtrado por localidad y especialidad => detalle CRUD Servicio<br> 2. Listado de presupuestos filtrado por precio de menor a mayor y por la cantidad de estrellas del prestador (evaluado por reseñas de trabajo), o podemos filtras por horas de trabajo estimadas => detalle muestra los datos del presupuesto con el precio de la mano de obra, materiales requeridos con su precio y un monto total de todo el trabajo|
|CUU/Epic|1. Realizar un presupuesto<br>2. Realizar una reseña a un prestador|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cliente<br>2. CRUD Servicio requerido<br>3. CRUD Localidad<br>4. CRUD Materiales<br>5. CRUD Reseña<br>6. CRUD Presupuesto<br>7. CRUD Prestador|
|CUU/Epic|1. Hacer pedido de servicio por el cliente <br>2. Realizar presupuesto (prestador) para el cliente <br>3. Confirmación del presupuesto eligiendo fecha y hora y cobrando el monto requerido|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Servicios requeridos anteriormente filtrados por precios y por la reseña dada a dicho prestador, esto le serviria al cliente para evaluar prestadores ya contratados<br>2. Servicios dados por el prestador filtrado por precio, fecha|
|CUU/Epic|1. Confirmar presupuesto<br>2. Cancelación un servicio pedido para una fecha futura|
|Otros|1. Envío de recordatorio de reserva por email|

