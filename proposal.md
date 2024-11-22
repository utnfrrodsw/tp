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

## IMPORTANTE --> El BackEnd tiene todos los CRUD, en el Front hay 2, 1 dependiente y 1 independiente y el CU.

### Alcance Mínimo

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Editorial<br>|
|CRUD dependiente|1. CRUD Libro {depende de} CRUD Editorial y CRUD Autor (SOLO EN BACK)<br>|
|Listado<br>+<br>detalle| 1. Listado de préstamos filtrado por ID (LADO DEL CLIENTE).<br> 2. Listado de préstamos filtrado por estado (LADO DEL SERVIDOR)|
|CUU/Epic|1. Devolver un Libro (Front y Back).<br>2. Retirar varios Libros (Solo back y sin separar en endpoints adecuados)|

Adicionales para Aprobación

Adicionales del backend:

- Validación con zod.
- Middlewares que capturan error 500 y error en el envio del JSON.
- Búsqueda de préstamos de un socio, filtrando por estado con query params.
- Búsqueda de préstamos filtrando por estado con query params.
- Búsqueda de sanciones de un socio. 
- Búsqueda de ejemplares pendientes de un socio.
- Testeos de los CU con Jest.
- Validación de req.params junto a la validación del body de cada petición, usando una funcion de orden superior que recibe el schema de zod y devuelve la funcion validadora.
- Clases débiles con CP compuesta como Ejemplar y Linea de préstamo, gestionando el número secuencial en memoria.
- Manejo de TODOS los posibles errores, aprovechando la integridad referencial del uso de MySQL. Y los errores que no tira la BD, también están contemplados y manejados.
- Uso de entidades virtuales para utilizar querys especificos. (Editoriales con conteo de libros)
- Manejo correcto de todos los posibles borrados fisicos. 


### Alcance Adicional Voluntario

-- 

