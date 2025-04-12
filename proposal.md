# Propuesta TP DSW

## Grupo
### Integrantes
* legajo - Apellido(s), Nombre(s)
* 49623 - Iglina, Bruno Nicolas
* 51329 - Molina, Agustin José
* 50220 - Garcia, Agustin

### Repositorios
* [frontend app]([http://hyperlinkToGihubOrGitlab](https://github.com/BrunoIglina/TP-MarketPlaceApuntes))
* [backend app]([http://hyperlinkToGihubOrGitlab](https://github.com/BrunoIglina/TP-MarketPlaceApuntes-BackEnd))



## Tema
### Descripción
*2 a 6 líneas describiendo el negocio (menos es más)*
* Sistema de Ventas de apuntes, donde se pueden comprar apuntes y se libera un boton de descarga en seccion comprados, apuntes divididos en propiedad de alumno, con un sistema de reputacion para poder filtrar apuntes de una materia con mejor reputacion, alumno puede comprar apuntes,dar de alta apuntes para la venta, borrar apuntes publicados. El Administrador puede crear,editar,borrar materias, borrar apuntes y sancionar alumnos. La compra se realiza mediante mercado pago con cuentas de prueba.

### Modelo
Modelo De Dominio:
* https://app.diagrams.net/#G13CUizdaE8i4Q9JTY018DBLUZk3CHlAbT#%7B%22pageId%22%3A%22LJzcoxC0tyBvRGHDO62-%22%7D
* ![image](https://github.com/BrunoIglina/tpDesarrolloDeSoftware/assets/129758494/9acd3391-5a23-4912-bb32-fe2ca0c64864)

Diagrama Entidad Relacion:
* [https://app.diagrams.net/#G13CUizdaE8i4Q9JTY018DBLUZk3CHlAbT#%7B%22pageId%22%3A%22LJzcoxC0tyBvRGHDO62-%22%7D](https://app.diagrams.net/#G1wb3itMVaknBRyUf2BMh_zWFGDKJcsclp#%7B"pageId"%3A"8Ju_aoQj6V6sqzxl7aBi"%7D)
* ![image](https://github.com/user-attachments/assets/15a9c600-8cfb-411d-8d59-cf9c510a2c09)




## Alcance Funcional 


### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Estudiante<br>2. CRUD Materia<br>3. CRUD Apunte <br>4. CRUD Compra 5. CRUD Modificacion Apunte 6. CRUD Modificacion Materia 7. CRUD Administrador|
|CRUD dependiente|1. CRUD Precio {depende de} CRUD Apunte<br>2. CRUD Apunte {depende de} CRUD Materia 3. CRUD Modificacion Apunte {depende de} CRUD Apunte<br> 4. CRUD Modificacion Materia {depende de} CRUD Materia<br>|
|Listado<br>+<br>detalle| 1. Listado de apuntes de una materia filtrado por calificacion de apuntes, muestra titulo y descripcion => detalle CRUD Apunte<br> 2. Listado de Apuntes filtrado por calificacion, se puede ingresar titulo, muestra detalles del apunte => detalle CRUD Apunte|
|CUU/Epic|1. Comprar apunte<br>2. Vender apunte.


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Estudiante<br>2. CRUD Materia<br>3. CRUD Apunte <br>4. CRUD Multimedia<br>5. CRUD Compra<br>6. CRUD Precio<br>|
|CUU/Epic|1. Crear Usuario<br>2. Dar de baja apunte<br>3. Eliminar usuario.|


### Alcance Adicional Voluntario


