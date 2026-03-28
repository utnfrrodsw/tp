# Propuesta TP DSW

## Grupo
### Integrantes
* 52115 - Soria, Marian Luz
* 52362 - Baistroqui, Lucas
* 53009 - Oliva, Ivan

### Repositorios
* [frontend y backend app](https://github.com/ivanoliva7/Codigo-Menu-Inclusivo.git)

## Menú-Inclusivo
### Descripción
Menú-Inclusivo es una plataforma web que conecta a personas con necesidades alimenticias específicas con restaurantes que ofrecen opciones adaptadas a sus dietas. Al crear tu usuario, podrás realizar reservas en línea, guardar tus preferencias y recibir recomendaciones personalizadas según tus necesidades.

### Modelo
![imagen del modelo](https://github.com/user-attachments/assets/d4f143ea-a32a-4602-854f-eb8af59ed9e3
)

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario <br>2. CRUD Local <br>3. CRUD Preferencia|
|CRUD dependiente|1. CRUD Comida {depende de} CRUD Local <br>2. CRUD Precio {depende de} CRUD Comida|
|Listado<br>+<br>detalle| 1. Listado de Menú filtrado por local => detalle muestra el conjunto de comidas de un local <br> 2. Listado de locales filtrado por preferencias => detalle muestra datos completos del local|
|CUU/Epic|1. Personalizar usuario <br>2. Gestionar restaurante|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD ||
|CRUD dependiente||
|CUU/Epic||


### Alcance Adicional Voluntario


|Req|Detalle|
|:-|:-|
|Listados ||
|CUU/Epic||
|Otros||

