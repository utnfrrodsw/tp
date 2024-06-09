# Propuesta TP DSW

## Grupo
### Integrantes
* legajo - Apellido(s), Nombre(s)
* 49623 - Iglina, Bruno Nicolas
* 51329 - Molina, Agustin José
* 50220 - Garcia, Agustin
* 50022 - Goya, Santiago

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.
* https://github.com/BrunoIglina/TP-MarketPlaceApuntes

## Tema
### Descripción
*2 a 6 líneas describiendo el negocio (menos es más)*
* Sistema de Ventas de apuntes, donde se pueden comprar apuntes y se libera un link de descarga, apuntes divididos en propiedad de alumno y catedra, con un sistema de reputacion para poder filtrar apuntes de una materia con mejor reputacion, alumno puede comprar apuntes o dar de alta apuntes para la venta.

### Modelo

* https://app.diagrams.net/#G13CUizdaE8i4Q9JTY018DBLUZk3CHlAbT#%7B%22pageId%22%3A%22LJzcoxC0tyBvRGHDO62-%22%7D
* ![image](https://github.com/BrunoIglina/tpDesarrolloDeSoftware/assets/129758494/9acd3391-5a23-4912-bb32-fe2ca0c64864)


*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 


### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Estudiante<br>2. CRUD Materia<br>3. CRUD Apunte <br>4. CRUD Multimedia|
|CRUD dependiente|1. CRUD Precio {depende de} CRUD Apunte<br>2. CRUD Apunte {depende de} CRUD Materia 3. CRUD Multimedia {depende de} CRUD Apunte<br>|
|Listado<br>+<br>detalle| 1. Listado de apuntes de una materia filtrado por calificacion de apuntes, muestra titulo y descripcion => detalle CRUD Apunte<br> 2. Listado de Estudiantes filtrado por calificacion de Estudiante, muestra legajo, nombre, apellido => detalle CRUD Estudiante|
|CUU/Epic|1. Comprar apunte<br>2. Vender apunte.


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Estudiante<br>2. CRUD Materia<br>3. CRUD Apunte <br>4. CRUD Multimedia<br>5. CRUD Compra<br>6. CRUD Precio<br>|
|CUU/Epic|1. Crear Usuario<br>2. Dar de baja apunte<br>3. Eliminar usuario.|


### Alcance Adicional Voluntario
//Queda por definir.
*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

