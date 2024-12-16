# Propuesta TP DSW - Veterinaria

## Grupo

### Integrantes

- 47651 - Gigli, Tomás Malcolm
- 46748 - Catalano, Daniela Andrea
- 50734 - Oldani, Marcos Alberto

### Repositorios

- [Frontend](https://github.com/oldaniMarcos/TP-DSW-Frontend)
- [Backend](https://github.com/oldaniMarcos/TP-DSW-Backend)

## Tema

### Descripción

Se propone un sistema para la gestión de una veterinaria, cuyos objetos principales serán los clientes, animales, veterinarios, y las atenciones realizadas.
De los animales se conocerán su raza, especie y el cliente al que pertenecen. De las atenciones se conocerán el veterinario que la realizó, el animal involucrado, los insumos usados (con tipos y precios que varían en el tiempo), y sus precios (que varía con el tiempo).
Para calcular el costo de una atención se tiene en cuenta el valor base de esta y el valor de venta de los insumos utilizados.
Los clientes podrán crear usuarios para ver los historiales de atenciones de sus animales.

### Modelo de Datos

![Modelo drawio](https://github.com/user-attachments/assets/41c4b8f2-23be-48ce-99de-d29f7ebccbdc)

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Atencion<br>2. CRUD Especie<br>3. CRUD TipoInsumo|
|CRUD dependiente|1. CRUD Raza {depende de} CRUD Especie<br>2. CRUD Insumo {depende de} CRUD TipoInsumo|
|Listado<br>+<br>detalle| 1. Listado insumos filtrado por tipo de insumo, muestra información sobre los insumos => detalle CRUD Insumo<br> 2. Listado de atenciones filtrado por rango de fecha, muestra datos de cada atención => detalle muestra datos completos de atenciones|
|CUU/Epic|determinar| 

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Cliente<br>2. CRUD Animal<br>3. CRUD Raza<br>4. CRUD Especie<br>5. CRUD Atencion<br>6. CRUD Veterinario<br>7. CRUD Insumo<br>8. CRUD TipoInsumo<br>9. CRUD PrecioInsumo<br>10. CRUD PrecioAtencion<br>|
|CUU/Epic|determinar|

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                                                                             |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Listados | determinar |
| CUU/Epic | determinar |                                                                                                                                                                  
| Otros    | determinar |                                                                                                                                                                    
