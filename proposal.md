# Propuesta TP DSW 

## Grupo
### Integrantes
* 51136 - Cano, Julián
* 42795 - Delbianco, Emanuel Iván
* 50275 - Panatti, Marina Andrea
* 50429 - Spitale, Camila

### Repositorios
* [frontend app]
* [backend app]

## Tema

### Descripción

PetGuardian permite a sus usuarios reservar un servicio de cuidado de mascotas. Podrán elegir entre los cuidadores disponibles, reservar los días que sean necesarios y coordinar las visitas a su domicilio. Para asegurar la calidad del servicio los cuidadores serán evaluados y aprobados por un administrador. Al final de la experiencia los clientes podrán reseñar las visitas y asignar un puntaje.

### Modelo

[Diagrama de Clases](https://drive.google.com/file/d/10Lp5SGvsbdNWY-dEyrsU1QMi-pRPHlO3/view?usp=sharing)

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Cliente<br>3. CRUD Administrador<br>4. CRUD Cuidador|
|CRUD dependiente|1. CRUD Reserva {depende de} CRUD Cliente y CRUD Cuidador<br>2. CRUD Mascota {depende de} CRUD Cliente|
|Listado<br>+<br>detalle| 1. Listado de reservas por período de tiempo seleccionado.<br> 2. Listado de cuidadores que incluya el número total de reservas realizadas, así como la cantidad de reservas completadas y canceladas, junto con las puntuaciones promedio.|
|CUU/Epic|1. Crear Usuario<br>2. Crear Reserva|

### Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Cliente<br>3. CRUD Administrador<br>4. CRUD Cuidador<br>5. CRUD Reseña<br>6. CRUD Reserva<br>7. CRUD Mascota<br>8. CRUD Estado|
|CUU/Epic|1. Crear Usuario<br>2. Crear Reserva <br>3. Crear Reseña<br>4. Habilitar Cuidador<br>5. Cancelar Reserva|

### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |-|
|CUU/Epic|-|
|Otros|1. Enviar notificación de solicitud de reserva a Cuidador. <br>2. Enviar notificación de aceptación de reserva a Cliente. <br>3. Enviar notificación de cancelación de reserva a Cuidador.|
