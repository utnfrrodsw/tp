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

### Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Atencion<br>2. CRUD Especie<br>3. CRUD TipoInsumo|
|CRUD dependiente|1. CRUD Raza {depende de} CRUD Especie<br>2. CRUD Insumo {depende de} CRUD TipoInsumo|
|Listado<br>+<br>detalle| 1. Listado de clientes y sus mascotas filtrable por DNI, muestra detalles de clientes y mascotas<br> 2. Grafico de ingesos filtrados por mes, muestra valores acumulados de las atenciones por cada dia, ingreso mas alto, mas bajo, promedio|
|CUU/Epic|1. Registro de atencion <br> 2. Gestion de especies/razas| 

### Aprobación / Adicional
|Req|Detalle|
|:-|:-|
|CRUD/CRUD dependientes |1. CRUD Cliente<br>2. CRUD Animal {depende de} Cliente<br>3. CRUD Raza {depende de} Especie<br>4. CRUD Especie<br>5. CRUD Atencion<br>6. CRUD Veterinario<br>7. CRUD Insumo<br>8. CRUD TipoInsumo<br>9. CRUD PrecioInsumo {depende de} Insumo<br>10. CRUD PrecioAtencion<br>|
|CUU/Epic|1. Registro de usuario <br> 2. Gestion de mascotas <br> 3. Ver atenciones (cliente) <br> 4. Registro de atencion <br> 5. Gestion de atenciones <br> 6. Actualizar precio de atenciones <br> 7. Gestion de clientes <br> 8. Gestion de especies/razas <br> 9. Gestion de insumos <br> 10. Actualizacion de precios de insumo <br> 11. Gestion de tipos de insumos <br> 12. Gestion de veterinarios <br> 13. Consular listado de clientes y mascotas <br> 14. Consultar ingresos mensuales|                                                                                                                                                                
