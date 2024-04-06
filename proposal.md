# Propuesta TP DSW

## Grupo

### Integrantes

- 47651 - Gigli, Tomás Malcolm
- 46748 - Catalano, Daniela Andrea
- 50734 - Oldani, Marcos Alberto

### Repositorios

- [frontend app](http://hyperlinkToGihubOrGitlab)
- [backend app](http://hyperlinkToGihubOrGitlab)

## Tema

### Descripción

Se propone un sistema para la gestión de una veterinaria, cuyos objetos principales serán los clientes, animales, veterinarios, y las atenciones realizadas.
De los animales se conocerán su raza, especie y el cliente al que pertenecen. De las atenciones se conocerán el veterinario que la realizó, el animal involucrado, los insumos usados (con tipos y precios que varían en el tiempo), y sus precios (que varía con el tiempo).
Al calcular el costo de una atención se tendrá en cuenta también el margen de utilidad deseado, por lo que se utilizará un multiplicador que cambia con el tiempo y es necesario llevar cuenta de ello.
Los clientes podrán crear usuarios para ver los historiales de atenciones de sus animales.

### Modelo

![Modelo](https://github.com/oldaniMarcos/tp/assets/139399407/f08ee335-d4a2-43e8-a95a-c49e7f345a82)

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Atencion<br>2. CRUD Especie<br>3. CRUD TipoInsumo|
|CRUD dependiente|1. CRUD Raza {depende de} CRUD Especie<br>2. CRUD Insumo {depende de} CRUD TipoInsumo|
|Listado<br>+<br>detalle| 1. Listado insumos filtrado por tipo de insumo, muestra información sobre los insumos => detalle CRUD Insumo<br> 2. Listado de atenciones filtrado por rango de fecha, muestra datos de cada antención => detalle muestra datos completos de atenciones|
|CUU/Epic|determinar| 

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|determinar|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                                                                             |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Listados | 1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes |
| CUU/Epic | 1. Consumir servicios<br>2. Cancelación de reserva                                                                                                                                                                  |
| Otros    | 1. Envío de recordatorio de reserva por email                                                                                                                                                                       |
