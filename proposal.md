# Propuesta TP DSW

## Grupo
### Integrantes
Montini Agostino 50757


### Repositorios
--
Backend: Este mismo repositorio.
FrontEnd: https://github.com/AgosUTN/TP-Front2


## Tema
Sistema de gestion de prestamos de biblioteca
### Descripción
Es un sistema para gestionar los prestamos de una biblioteca, abarca el Alta y baja de socios, categorias, libros, editoriales, autores. 
El sistema (con alcance de regularidad) esta pensado para ser usado solo por el bibliotecario, el socio no interactua con el sistema.
Por ello no se hace uso de un usuario y contraseña. El sistema con alcance de AD puede contar con un FrontEnd en el que los socios puedan realizar consultas(prestamos,sanciones, libros disponibles).

### Modelo
Ver docs

## Alcance Funcional 

### Alcance Mínimo

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Categoria<br>2. CRUD Editorial<br>3. CRUD Autor<br>4.CRUD Socio|
|CRUD dependiente|1. CRUD Prestamo {depende de} CRUD Libro y CRUD Socio<br>2. CRUD Libro {depende de} CRUD Editorial, CRUD Categoria y CRUD Autor|
|Listado<br>+<br>detalle| 1. Listado de prestamos filtrado por libro(codigo).<br> 2. Listado de libros filtrado por autor|
|CUU/Epic|1. Realizar un prestamo.<br>2. Realizar la devolucion de un prestamo|

Nota: Obligatoriamente hay que hacer el CRUD de la clase PoliticasBiblioteca.


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |Todos los CRUD ya mencionados, incluyendo PoliticasBiblioteca|
|CUU/Epic|1.Realizar un prestamo.<br>2.Realizar la devolucion de un prestamo.<br>3.Consultar mis prestamos(perspectiva del cliente) este caso de uso requiere el frontend para cliente y un usuario y contraseña.<br>4.Notificar prestamo atrasado.|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |Todos los listados posibles.<br> 1.Busqueda de libro por titulo o categoria.<br>2.Busqueda de libros de un autor.<br>3.Busqueda de libros de una editorial.<br>4.Otros como listado de libros sin devolver, prestamos atrasados, socios sancionados, socios dados de baja, socios activos, prestamos en un intervalo de fecha.|
|CUU/Epic|En cuanto al negocio, parece no haber ningun caso de uso dejado de lado.|
|Otros|1. Envío de sancion por mail y/o por whatsapp. <br> 2. Ranking de libros mas prestados en general y por categoria.|

