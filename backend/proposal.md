# Propuesta TP DSW

## Grupo
### Integrantes
* 50970 Bouvier, Juan Adrián
* 48711 Speranza Facundo
* 50839 Tejedor Paloma
* 42969 Zapata, Mayra Belen

## Tema
### Descripción

### Club de Deportes

Realizaremos un software para la administración de un Club de Deportes. Este registrará los datos de las personas socias y los empleados, permitirá dar de alta, dar baja y ejecutar la modificación de los diferentes deportes para el club. Permitirá organizar torneos para las personas que sean socias. Los socios deberan abonar mensualmente su cuota dependiendo su edad, ya que se pueden realizar diferentes promociones y descuentos.

### Modelo

![TP Diagrama de Clases drawio](https://github.com/JotaBame/TP-DSW-304/assets/63957828/f0b4aa2f-7e6e-4e3e-9be5-abe18613ccc0)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD horarios<br>2. CRUD tipo-deporte<br>3. CRUD costo<br>4. CRUD empleado|
|CRUD dependiente|1. CRUD deporte {depende de} CRUD tipo-deporte, CRUD costo, CRUD horarios<br>2. CRUD socio {depende de} CRUD deporte|
|Listado<br>+<br>detalle| 1. Listado de deporte filtrado por horario y costo (al cual inscribirse) => detalle CRUD deporte<br> 2. Listar deportes de un usuario|
|CUU/Epic|1. Inscribirse a un torneo<br>2. Dar de baja un deporte|

Adicionales para Aprobación:
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Socio <br>2. CRUD Empleado<br>3. CRUD Torneo<br>4. CRUD Deporte<br>5. CRUD Costo<br>6. CRUD horarios<br>7. CRUD tipo-deporte|
|CUU/Epic|1. Inscribirse a un torneo<br>2. Dar de baja un deporte<br>3. Realizar el pago de una cuota, teniendo en cuenta bonificaciones y descuento|




