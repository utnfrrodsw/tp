# Propuesta TP DSW

## Grupo
### Integrantes
* 48072 - Picia Facundo
* 48083 - Tomas Yasparra

### Repositorios
* [frontend app](https://github.com/cufardixx/TP_DSW_2024_3K1/tree/main/Backend)
* [backend app](https://github.com/cufardixx/TP_DSW_2024_3K1/tree/main/Frontend)


## Tema

La aplicación web ofrece un sistema de compra de entradas para eventos. Los usuarios ingresarán a la aplicaión y deberán registrarse ingresando sus datos personales. En el caso de que ya estén registrados, se loguearán con su usuario ó email y su contraseña. Una vez registrados, deberán seleccionar el evento al que deseen asistir. Además contarán con distintos filtros para visualizar eventos por fecha, lugar o disponibilidad.
Cada evento contará con diferentes categorias (cumpleaños, casamientos, aniversarios, etc) y podrán realizarse en diferentes ubicaciones (salones, clubes, etc)
Una vez que el usuario realize la selección y finalize la compra de la entrada, recibirá en su casilla de correo un mensaje de confirmación el cual será utilizado como entrada.

### Modelo
![imagen del modelo de dominio](https://github.com/user-attachments/assets/1a8577ea-ba61-4c32-813a-dde1572c2460)

### Reglas de negocio

## Alcance Funcional 

Registro y Autenticación:
-Permitir a los usuarios registrarse y autenticarse de manera segura.
-Permitir a los usuarios elegir una categoria y una ubicación para un evento.

Gestión de Perfiles de Usuario:
-Los usuarios pueden ver y editar su perfil.

Selección de eventos:
-Mostrar a los usuarios los eventos disponibles.
-Permitir a los usuarios comprar una entrada para un evento.

Visualización de eventos disponibles:
-Presentar una variedad de eventos.
-Proporcionar detalles claros sobre la fecha y lugar.

### Alcance Mínimo
Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD usuario<br>2. CRUD evento<br>3. CRUD categoria|
|CRUD dependiente|1. CRUD ubicacion {depende de} CRUD evento<br>2. CRUD entrada {depende de} CRUD usuario|
|Listado<br>+<br>detalle| 1. Listado de eventos filtrados por fecha, hora y lugar => detalle CRUD Evento|
|CUU/Epic|1. Comprar una entrada para un evento|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD usuario<br>2. CRUD evento<br>3. CRUD entrada<br>4. CRUD categoria<br>5. CRUD ubicacion|
|CUU/Epic|1. Comprar una entrada para un evento<br>2. Realizar la carga de un evento|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Eventos filtrados por disponibilidad <br>2. Eventos a los que asistirá el usuario|
|CUU/Epic|1. Cancelar una compra|

