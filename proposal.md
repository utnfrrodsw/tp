# Propuesta TP DSW

### Integrantes
* 44123-Milanesi Renzo
* 46291-Gamba Emiliano Francisco


### Repositorios
*  [FRONTEND app](https://github.com/gitgamba/DSW-FRONTEND-2026)
* [BACKEND app](https://github.com/gitgamba/DSW-BACKEND-2026)

## Tema
### Descripción
Vamos a crear un Sistema de Gestión Web que va a permitir administrar una agenda de operadores de una empresa de hospedaje.

Las reservas, inmuebles y huéspedes se obtienen de [Stays](https://stays.net), un channel manager que centraliza las reservas de Booking, Airbnb y otras plataformas. El sistema se conecta a la API de Stays (ya contamos con usuario y acceso habilitado) y sincroniza los datos a demanda.

Con esas reservas se arma una agenda de check-ins y check-outs: cada reserva genera dos movimientos (check-in y check-out) y cada movimiento se asigna a un operador, que recibe una notificación dentro de la aplicación.

#### Tipos de usuario
|Tipo|Qué puede hacer|
|:-|:-|
|Administrador|Crear usuarios, crear y sincronizar reservas, crear y asignar movimientos a cualquier usuario.|
|Supervisor|Crear y asignar movimientos.|
|Limpieza|Ver su agenda, recibir las notificaciones de los movimientos asignados y marcarlos como realizados.|

No hay registro público: el primer administrador se crea con un seed y es quien da de alta al resto de los usuarios.


### Modelo

### Tecnologías

|Parte|Tecnologías|
|:-|:-|
|Backend|Node.js, Express, TypeScript, Zod, Prisma, SQL Server (Azure SQL), JWT + bcrypt, Jest|
|Frontend|React, Vite, TypeScript, React Router, React Bootstrap, FullCalendar|
|Deploy|API en Render, frontend en Vercel, base en Azure SQL|
|Integración|API externa de Stays|

Tecnologías distintas a las dadas en la cátedra :
* **Prisma** en lugar de MikroORM: es un ORM para TypeScript que soporta SQL Server y genera el cliente tipado a partir de un único archivo de esquema.
* **SQL Server (Azure SQL)** en lugar de MySQL: es la base que ya conocemos; Azure ofrece una base gratuita en la nube, así que no corre en local y la compartimos los dos.

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Tipo de usuario|
|CRUD dependiente|1. CRUD Movimiento que depende de CRUD Usuario|
|Listado<br>+<br>detalle| 1. Listado de reservas, filtrado por fecha, inmueble y usuario asignado => detalle CRUD<br>2. Listado de hoja de ruta por usuario|
|CUU/Epic|1. Generar agenda por usuario<br>2. Emitir notificaciones a los responsables de los movimientos|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Huésped<br>2. CRUD Inmueble<br>3. CRUD Notificación que depende de CRUD Movimiento<br>4. CRUD Reserva que depende de CRUD Inmueble y CRUD Huésped|
|CUU/Epic|1. Sincronizar reservas, inmuebles y huéspedes desde Stays<br>2. Generar agenda de check-in y check-out (vista de lista por día y vista de calendario)<br>3. Asignar y reasignar usuarios a los movimientos (puede darse el caso de que un usuario no pueda ir a hacer el check-in y deba asignarse otro)<br>4. Notificar al usuario los datos del check-in / check-out|
|Otros|1. Login y permisos por tipo de usuario (Administrador, Supervisor, Limpieza)|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Resumen mensual (inmuebles más alquilados, promedio de duración de reservas)<br>2. Listado de reservas por inmueble o usuario|
|CUU/Epic||
|Otros|1. Permisos por usuario (además de por tipo de usuario)|
