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

Se propone un sistema para la gestión de una veterinaria, que involucra animales, atenciones, clientes, especies, insumos, precios de atencion, precios de insumo, razas, tipos de insumo y veterinarios. Se divide en una seccion para clientes y otra para administradores. Los clientes podran registrarse con usuario y contraseña, y tendran la posibilidad de registrar sus mascotas y ver las atenciones realizadas. Los administradores podran registrar las atenciones, gestionar todos los registros, y acceder a listados que muestran todos los clientes con sus mascotas y un grafico de los ingresos por mes elegido, mostrando tambien maximo, minimo y promedio.
Se cuentan con mecanismos para evitar que los clientes accedan al area de administracion y viceversa, y la identidad de cada usuario se verifica con JSON Web Tokens

### Modelo de Datos

![Modelo drawio](https://github.com/user-attachments/assets/4d22a9c2-86b6-4c82-b7cf-b9369c2cff46)

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
