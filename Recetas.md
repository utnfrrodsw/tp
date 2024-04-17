<a name="_hd6r2cdk8tvu"></a>RECETAS

El sistema de recetas permitirá al usuario entrar a la página y observar las diferentes recetas, estos usuarios también tendrán la posibilidad de ingresar nuevas recetas que serán evaluadas por un supervisor para su respectiva aprobación o rechazo, estas recetas constaran de ingredientes y una serie de pasos a seguir, en diversas ocasiones también tendrán concejos de  diferentes usuarios. Además, cada usuario podrá tener una carpeta con sus recetas favoritas.

**Integrantes:**

- 47791- Gomez Manna, Joaquina Esperanza
- 51095- Carloni, Nahuel Iván

[**Modelo de Dominio**](https://drive.google.com/file/d/11ih4yHBqKT7XvaegxXI5ATFMMyIvo4OX/view?usp=sharing)

Regularidad

|**Requerimiento**|<p>**cant. máx.**</p><p>**2 o 4 integ**</p>|**Detalle/Listado de casos incluidos**|
| :-: | :-: | :-: |
|CRUD simple|1 x integ|<p>-Usuario</p><p>-Ingrediente y Categoria</p>|
|CRUD dependiente|2|<p>-Receta Depende de Ingrediente</p><p>- Receta Depende de Categoría</p>|
|CUU/EPIC|2|<p>-Receta Favorito</p><p>-Evaluar Receta</p>|
|Listado + Detalle|2|<p>-Ingresando una categoría, se muestra un listado de recetas coincidentes con esta.</p><p>-El cliente podrá filtrar las recetas con mayor cantidad de favoritos.</p>|


Aprobación Directa

|**Requerimiento**|<p>**cant. máx.**</p><p>**2 o 4 integ**</p>|**Detalle/Listado de casos incluidos**|
| :-: | :-: | :-: |
|CRUD|todos|todos|
|CRUD dependiente.|todos|todos|
|CUU/Epic|2|- Favoritos|
|Nivel de acceso|2|<p>- Usuario</p><p>- Supervisor</p><p>- Owner</p>|

Clases:

Usuario

-Nombre

-Apellido

-IdUsuario

-Mail

-Teléfono

-Tipo

Receta

-Nombre

-IdReceta

Categoría

-Nombre

-idCategoria

Ingrediente

-Nombre

-IdIngrediente

Favoritos

-idReceta



