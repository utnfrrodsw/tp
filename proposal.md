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
Los organizadores de los eventos realizarán las cargas de los mismos. Estos tendrán permisos especiales, como personalizar y editar los eventos. 
Una vez que el usuario realize la selección y finalize la compra de la entrada, recibirá en su casilla de correo un mensaje de confirmación el cual será utilizado como entrada.

### Modelo
![imagen del modelo]()

### Reglas de negocio

## Alcance Funcional 

Registro y Autenticación:
-Permitir a los usuarios registrarse y autenticarse de manera segura.
-Permitir a los organizadores crear un evento

Gestión de Perfiles de Usuario:
-Los usuarios pueden ver y editar su perfil.

Gestión de eventos:
-Los organizadores pueden editar un evento.

Selección de eventos:
-Mostrar a los usuarios los eventos disponibles.
-Permitir a los usuarios reservar un evento.

Visualización de eventos disponibles:
-Presentar una variedad de eventos.
-Proporcionar detalles claros sobre la fecha y lugar.

### Alcance Mínimo
Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Cliente<br>2. CRUD Evento<br>3. CRUD Organizador|
|CRUD dependiente|1. CRUD Evento {depende de} CRUD Organizador|
|Listado<br>+<br>detalle| 1. Listado de eventos filtrados por fecha, hora y lugar => detalle CRUD Evento|
|CUU/Epic|1. Comprar una entrada para un evento|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Evento<br>2. CRUD Usuario<br>3. CRUD Compra<br>4. CRUD Organizador|
|CUU/Epic|1. Comprar una entrada para un evento<br>2. Realizar la carga de un evento|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Eventos filtrados por disponibilidad <br>2. Eventos a los que asistirá el usuario|
|CUU/Epic|1. Cancelar una compra|

