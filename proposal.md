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
![Modelo de Dominio](https://github.com/lauratulian/TP-Desarrollo/blob/main/MD-TTADs.png)

*Link*: https://app.diagrams.net/#G1L1kh_Qq_2p5QrWXv7gXhloqTjuVEFaZ3 .

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

