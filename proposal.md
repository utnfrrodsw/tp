# API.Rest - MisCanchas

## Grupo
### Integrantes
* 49822 - Sesana, Octavio
* 50029 - Di Marco, Martin
* 49373 - Salvía, Camila
* 50026 - Vivas, Martin Ariel

### Repositorios
* frontend: https://github.com/camila-salvia/frontend-tp-dws2024
* backend: https://github.com/OctavioSesana/backend

## Tema
### Descripción
Sistema de alquiler de canchas de fútbol de dos tipos: Fútbol 5 y Fútbol 7.

### Modelo

Link Drive: https://drive.google.com/drive/folders/1Spls67U-GuqDTieQFtbJXADwzbpLSfh7


## Alcance Funcional 

### Alcance Mínimo
PROXIMA ENTREGA: se realizará la CRUD Cliente

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Cancha<br>2. CRUD Cliente<br>3. CRUD Reserva|
|CRUD dependiente|1. CRUD Cancha {depende de} CRUD Tipo Cancha<br>2. CRUD Reserva {depende de} CRUD Tipo de cancha|
|Listado<br>+<br>detalle| 1. Listado de canchas disponibles filtrado por tipo de cancha, muestra código y tipo => detalle CRUD Canchas<br> 2. Listado de reservas para el usuario correspondiente (muestra mail del mismo), muestra código de cancha, fecha, y hora de inicio. => detalle muestra datos completos de la reserva y mail del cliente con la sesión iniciada|
|CUU/Epic|1. Reservar una cancha para jugar<br>2. Cobrar alquiler de cancha|

### Alcance total del sistema
PROXIMA ENTREGA: Examen Final

Examen Final:
| Req | Detalle |
|-----|---------|
| **CRUD simple** | 1. CRUD Cancha <br> 2. CRUD Cliente (Persona) <br> 3. CRUD Artículo <br> 4. CRUD Reserva <br> 5. CRUD ReservaArticulo|
| **CRUD dependiente** | 1. CRUD Cancha (depende de Tipo Cancha) <br> 2. CRUD Reserva (depende de Cancha y Cliente) <br> 3. CRUD Reserva_Articulo (depende de Reserva y Artículo) |
| **Listado + detalle** | 1. Listado de canchas disponibles filtrado por tipo, con código y tipo → detalle de Cancha <br> 2. Listado de reservas por cliente (mail), con fecha, hora, código de cancha → detalle de Reserva <br> 3. Listado de artículos asociados a una reserva y su estado |
| **CUU/Epic** | 1. Reservar cancha para jugar <br> 2. Cobrar seña de alquiler de cancha vía MercadoPago <br> 3. Asociar artículos a una reserva y actualizar su disponibilidad <br> 4. Liberar artículos al eliminar una reserva <br> 5. Sección de comentarios/valoración de la página web <br> 6. Cancelar una reserva y actualizar estado de la cancha y los articulos seleccionados de la misma |

## Testings
### Backend
#### Test Unitario - Módulo de Reservas
Para asegurar la calidad del código, se implementó un test unitario en el backend para validar el formato de hora de las reservas. Este test verifica que una función de utilidad reciba correctamente la hora en formato HH:mm (ej. "19:00"), lo cual es crucial para la consistencia de los datos en la base de datos.

El test se ejecutó usando el framework Jest y el resultado fue el siguiente:
<img width="625" height="238" alt="image" src="https://github.com/user-attachments/assets/18c65543-96a3-4d5b-96b2-69a463650b40" />


Este resultado confirma que la función de validación de hora opera según lo esperado, garantizando la integridad del formato de datos en una parte crítica de la
aplicación.

#### Test Unitario - Módulo de Personas
Para garantizar la integridad de los datos en el registro de usuarios, se implementó un test unitario en el backend para validar el formato de los DNI. Este test verifica que una función de utilidad confirme que el DNI sea un número entero de 8 dígitos, una regla de negocio fundamental para la identificación de los clientes.

El test se ejecutó usando el framework Jest y el resultado fue el siguiente:

<img width="328" height="196" alt="image" src="https://github.com/user-attachments/assets/fa0d76f2-9f62-4664-b290-ee6d06f62302" />


Este resultado confirma que la función de validación de DNI opera según lo esperado, asegurando la calidad de los datos de los usuarios desde el momento de su registro.

#### E2E Test
Para garantizar la fiabilidad del sistema, se implementó un conjunto de pruebas end-to-end (E2E) con Cypress. Esta estrategia verifica que el flujo de usuario más crítico de la aplicación funcione correctamente, desde el front-end hasta el backend.

El test de reservas verifica el siguiente flujo completo:

- Autenticación: Simula el inicio de sesión de un usuario.
- Interacción con la UI: Navega por la interfaz de usuario, selecciona una cancha y llena el formulario de reserva.
- Integración completa: Envía la reserva a la API del backend y valida que se confirme exitosamente.

Este enfoque asegura que todos los componentes del sistema (front-end, backend y base de datos) se integren y funcionen correctamente en un entorno real.

Testing : https://youtu.be/Sks25qBIB7Y

### Frontend
#### Test Unitario - Comentarios.component
Se realizó un test unitario en Front End sobre este componente con la finalidad de verificar que, cuando un usuario está conectado, se le muestre el formulario para escribir un comentario sobre la página, y cuando no, se le muestre un mensaje. También comprueba que al enviar un comentario, este se guarde en una lista y se limpie el formulario. Todo esto se ejecuta simulando que se utilice la base de datos del proyecto para que el test se realice de forma segura y que no haya problema con la base de datos en el futuro.

Este test se realizó utilizando los frameworks Jasmine y Karma. 

<img width="1035" height="515" alt="image" src="https://github.com/user-attachments/assets/c444a013-4f17-4afa-ae96-71ab21cc1065" />

Aqui Karma ejecuta el test en una ventana de google

<img width="1035" height="698" alt="image" src="https://github.com/user-attachments/assets/ccd0dcd0-0ff7-49a3-8190-ea443697ea4c" />

#### Test Unitario - Canchas.component
Se realizó un test unitario en Front End sobre el componente CanchasComponent con el objetivo de verificar su correcto funcionamiento en distintos escenarios de interacción del usuario. El test comprueba que el listado de canchas se muestre correctamente, que al hacer clic sobre una cancha se desplieguen sus detalles, y que al seleccionar una cancha se guarde su identificador en el almacenamiento local. 
Para asegurar la independencia de los tests respecto a servicios externos, se utilizaron módulos de testing como HttpClientTestingModule y RouterTestingModule, simulando así las dependencias de red y navegación. 

<img width="812" height="363" alt="image" src="https://github.com/user-attachments/assets/98e2f20c-167e-4a81-96c0-c0b77f6f79e3" />

Este test fue implementado utilizando los frameworks Jasmine y Karma.
