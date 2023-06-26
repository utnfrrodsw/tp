# Propuesta TP DSW

## Grupo
### Integrantes
* 46904 - Tulian , Maria Laura

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
El sistema en desarrollo busca la gestión de la ONG “Me llaman calle” la cual se encarga de repartir viandas todos los jueves y domingos a la gente en situación de calle. 
En resumen, el sistema tiene como objetivo informar a los usuarios la misión, descripción, recorridos y cómo pueden ayudar. También permitirá a las autoridades llevar un control detallado de las compras, donaciones y cada ronda realizada.


### Modelo
![![MD-TTADs](https://github.com/lauratulian/TP-Desarrollo/assets/82680814/2589fe49-9d2e-47f5-b896-fda13f0097d4)]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo



Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Gastos|
|CRUD dependiente|1. CRUD Gastos {depende de} CRUD Tipo Gasto|
|Listado<br>+<br>detalle| 1. Listado de gastos filtrado por tipo de gasto, muestra nro y tipo de gasto, fecha => detalle CRUD Gastos<br> |
|CUU/Epic|1. Inscribirse como voluntario|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Gasto<br>2. CRUD Donacion<br>3. CRUD Ronda<br>4. CRUD ONG<br>5. CRUD Gasto|
|CUU/Epic|1.Inscripcion como voluntario<br>2. Alta de voluntario|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Otros|1. Envío de novedades de la ONG|

