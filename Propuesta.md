# Propuesta TP DSW

### Integrantes
* 44123-Milanesi Renzo
* 46291-Gamba Emiliano Francisco


### Repositorios
*  [FRONTEND app](https://github.com/gitgamba/Frontend-DSW.git)
* [BACKEND app](https://github.com/gitgamba/DSW-TP-BE)

## Tema
### Descripción
Vamos a crear un Sistema de Gestion Web que va a permitir administrar estacionamientos.
Las funcionalidades que van a tener fijas son las opciones de ingresar y sacar vehiculos emitiendo los respectivos tickets y calculando el importa, mostrar la ocupacion del estacionamientos, crear y administrar las categorias y sus respectivas tarifas, eliminar producto del carrito de compras, manejar una base de usuarios en MYSQL, agregar productos nuevos a la página, administrar envíos (historial por usuario)


### Modelo

![Imgur](https://i.imgur.com/ZGDGsTk.png)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD categoría<br>2. CRUD modo de usuario|
|CRUD dependiente|1-CRUD Tarifa que depende de CRUD Categoria|
|Listado<br>+<br>detalle| 1-Listado de ocupacion en playa, filtrado por patente, categoria, fecha y usuario numero de ticket y patente => detalle CRUD<br>2-Listado de cierres de caja por usuario|
|CUU/Epic|1-Ingresar vehiculo<br>2-Emitir ticket de salida|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD ||CRUD simple|1. CRUD categoría<br>2. CRUD modo de usuario<br>3. CRUD cierre_caja|
4. CRUD Tarifa que depende de CRUD Categoria<br>5. CRUD ticket depende de CRUD usuario y CRUD tarifa|
|CUU/Epic|1-Realizar cierre de caja<br>2-Actualizar tarifas (puede darse el caso de que hayas autos en el estacionamiento)<br>3-Crear una nueva categoria|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1-Resumen mensual (tasa e ocupacion, promedio de tickets por categoria)<br>2-Listado de precios por categoria|
|CUU/Epic||
|Otros|1-Incluir permisos por usuario o tipos de usuario|
