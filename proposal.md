# Propuesta TP DSW

## Grupo
### Integrantes

Vera Agostina, 51021 (comisión 305)
Collaud María Victoria, 51766 (comision 304)
Etchecopar Olivia, 51120 (comision 304)
Talia Milagros, 51406 (comision 305)


### Repositorios
* [frontend app] git@github.com:MilagrosTalia/Backend-Protectora.git
* [backend app] git@github.com:MilagrosTalia/Frontend-Protectora.git
  
## Tema

Protectora de animales. 

### Descripción

Nuestro proyecto se basará en una protectora de animales, los usuarios podrán registrarse en nuestra página y tendrán diferentes posibilidades para interactuar con nuestros animalitos. Se podrá realizar el proceso de adopción y/o tránsito de animales. Además, contará con una sección de e-commerce, donde podrán adquirir una serie de productos, como alimentos, y juguetes para nuestros amiguitos.

### Modelo

![Protectora de animales drawio](https://github.com/user-attachments/assets/b14cae83-61fa-440d-9eab-9192ac4c2798)



## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Animal <br>2. CRUD Adopción <br>3. CRUD Transito <br> 4. CRUD Zona 
|CRUD dependiente|1. CRUD Animal {depende de} CRUD Tipo Animal <br>2. CRUD Usuario {depende de} CRUD Zona|
|Listado<br>+<br>detalle| 1. Listado de Animales filtrado por Tipos de Animales, muestra los animales en espera de adopción según su especie <br> 2. Listado de productos disponibles filtrado por categoría|
|CUU/Epic|1. Realizar adopción <br>2. Realizar transito|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. 1. CRUD Tipo Animal <br>2. CRUD Adopción <br>3. CRUD Transito <br>4. CRUD Zona <br>5. CRUD Categoría Producto <br>6. CRUD Pedido|
|CUU/Epic|1. Realizar adopción <br>2. Realizar transito<br>3. Realizar la compra de productos<br> 4.Realizar donaciones ?|


