# Propuesta TP DSW

## Grupo

### Integrantes

- 53769 - Rego, Matias Miguel Angel.
- 54822 - Bautista, Isaac Juan.
- 55425 - Vigistain, Tomas.

### Repositorio

- [Aplicación full stack](https://github.com/Matias-rego/TP-DS-Isaac-Rego-Vigistain) (monorepo).

## Tema y alcance

El proyecto consiste en un sistema web de gestión para un taller de reparación y mantenimiento de dispositivos electrónicos. Centraliza clientes, equipos, órdenes de trabajo, fallas, estados de reparación, presupuestos, costos adicionales y pagos.

Los flujos principales son registrar una orden para un cliente y su equipo, seguir el historial de estados, crear y enviar un presupuesto, y registrar los costos y pagos asociados.

## Arquitectura y tecnologías

- Frontend: React, TypeScript y Vite.
- Backend: Node.js, Express y TypeScript, organizado por módulos y capas de controller/service/repository.
- Persistencia: MySQL mediante Prisma ORM y migraciones versionadas.
- API: REST bajo `/api`; documentación en [api-doc.md](../../server/api-doc.md).
- Actualizaciones en tiempo real: Socket.IO.
- Archivos e imágenes: Cloudinary.
- Presupuestos: generación de PDF y envío por correo con servicios configurados mediante variables de entorno.

## Modelo de datos

El diagrama, enumeraciones, tipos, relaciones y reglas vigentes se mantienen en el [documento del modelo de datos](modelo-datos.md), derivado del schema [`server/prisma/schema.prisma`](../../server/prisma/schema.prisma). Ese documento sustituye al diagrama y diccionario anteriores, desactualizados tras las migraciones.

Las entidades principales son usuario, cliente, tipo de cliente, equipo, orden, falla y tipo de falla, historial de estado, presupuesto, costo añadido, tipo de pago y pago. Los identificadores son UUID v7 almacenados en columnas `CHAR(36)`; los importes monetarios usan `Decimal`.

## Funcionalidades previstas

- Autenticación, registro, activación de cuenta, recuperación de contraseña y perfiles con roles `admin` y `tecnico`.
- Gestión de clientes, tipos de cliente, equipos, usuarios, tipos de falla y tipos de pago.
- Alta de órdenes con equipo existente o nuevo y fallas iniciales.
- Historial de estados asociado a orden y usuario.
- Presupuestos vinculados uno a uno con órdenes, mano de obra, descuentos y costos adicionales.
- Registro de pagos asociados a presupuesto y tipo de pago.
- Búsqueda y consulta de órdenes, equipos, fallas y métricas de estados.
- Envío de presupuestos por correo, carga de archivos y actualizaciones en tiempo real donde están implementadas.

## Alcance funcional del trabajo

El sistema contempla CRUDs simples y dependientes y los flujos de negocio de reparación. Las operaciones disponibles y las rutas todavía no implementadas están diferenciadas en la [documentación de API](../../server/api-doc.md); la existencia de una entidad en la base de datos no implica que cuente con un CRUD operativo.


### Alcance Mínimo

Regularidad:

| Req                         | Detalle                                                                                                                                                                                                                                                                                                                                                                                |
|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CRUD simple                 | 1\. CRUD Tipo_Falla<br />2. CRUD Tipo_Cliente<br />3. CRUD Tipo_Pago                                                                                                                                                                                                                                                                                                                             |
| CRUD dependiente            | 1\. CRUD falla {depende de} CRUD Tipo_falla y CRUD Equipo<br />2. CRUD Cliente {depende de} CRUD Tipo_Pago                                                                                                                                                                                                                                                        |
| Listado<br />+<br />detalle | 1\. Clientes registrados filtrados a traves de distintos atributos <br /> 2. Equipos que se encuentran en un determinado estado posible, muestra estado anterior, fecha de cambio de estado, tecnico a cargo, informacion del equipo correspondiente. => detalle muestra datos completos del cambio de estado, del equipo en cuestion y del tecnico a cargo. |
| CUU/Epic                    | 1\. Generar orden de trabajo<br />2. Realizar presupuesto de reparacion                                                                                                                                                                                                                                                                                       |

Adicionales para Aprobación

| Req      | Detalle                                                                                                                                                                                                                                                                                                               |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CRUD     | 1\. CRUD Tipo_Falla<br />2. CRUD Equipo<br />3. CRUD Tipo_Cliente<br />4. CRUD Usuario <br />5. CRUD Cliente<br />6. CRUD Falla {depende de} CRUD Tipo_falla y CRUD Equipo <br />
| CUU/Epic | 1\. Generar orden de trabajo <br />2. Realizar presupuesto de reparacion <br />3.  Implementacion de metodos de seguridad: recuperacion de contraseña por mail mediante tokens y verificacion de dos pasos a la hora del registro                                                                                                                                                                   |

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                                                                                 |
|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Listados | 1\. Fallas de los equipos ordenadas segun su frecuencia de  ocurrencia => detalle CRUD Fallas<br />2. Ordenes que ya hayan cumplido su fecha estimada de entrega o se encuentren a pocos dias de cumplirla                                          |
| CUU/Epic | 1\. Consultar estados de una orden <br />2. Cancelación de Orden                                                                                                                                                        |
| Otros    | 1\. Enviar presupuesto de la orden a traves del mail registrado a cada cliente y esperar la respuesta de confirmacion del mismo. <br/> 2.  Generar Reportes estadistidos de fallas  |
