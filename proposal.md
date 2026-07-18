# Propuesta TP DSW

## Grupo

### Integrantes

* 53769 - Rego, Matias Miguel Angel.
* 54822 - Bautista, Isaac Juan.
* 55425 - Vigistain, Tomas.

### Repositorios

* [fullstack app.](https://github.com/Matias-rego/TP-DS-Isaac-Rego-Vigistain)(monorepo).

## Tema

### Descripción

El negocio consiste en un taller de reparaciones de dispositivos electrónicos que brinda servicios de reparación y mantenimiento de equipos. A partir de esto se propone desarrollar un sistema web de gestión para digitalizar y centralizar las operaciones del taller. El sistema permitirá registrar órdenes de trabajo, controlar el estado de las reparaciones, gestionar clientes y administrar el inventario, con el objetivo de mejorar la organización y el seguimiento del servicio.

### Modelo

```mermaid
classDiagram
  class Cliente {
    - id_cliente: int PK AI
    - id_tipo_cliente: int FK
    - nombre: varchar[100]
    - dni_cuit: varchar[20] UNIQUE
    - telefono: varchar[20]
    - mail: varchar[100]
    - fecha_registro: DATETIME
    - activo: boolean
    + altaCliente()
    + bajaCliente()
    + modificacionCliente()
    + eliminacionCliente()
  }

  class Tipo_Cliente {
    - id_tipo_cliente: int PK AI
    - pteDescuento: DECIMAL[5,2]
    - cantOrdenesPara: int
  }

  class Equipo {
    - id_equipo: int PK AI
    - id_cliente: int FK
    - tipo_equipo: ENUM*
    - observaciones: TEXT
    + altaEquipo()
    + modificacionEquipo()
    + bajaEquipo()
  }

  class Falla {
    - id_falla: int PK AI
    - id_equipo: int FK
    - id_tipo_falla: int FK
    - descripcion: VARCHAR[200]
    - tipo_falla: VARCHAR[100]
    - estado: ENUM['resuelta','diagnosticada']
    + cargaFalla()
  }

  class Tipo_falla {
    - id_tipo_falla: int PK AI
    - descripcion: VARCHAR[200]
    - importe_estimado: DECIMAL[10,2]
    + altaTipoFalla()
    + bajaTipoFalla()
    + modificacionTipoFalla()
  }

  class Orden {
    - id_orden: int PK AI
    - id_equipo: int FK
    - id_usuario: INT FK NULL
    - estado: ENUM**
    - falla_reportada: TEXT
    - diagnostico_tecnico: TEXT
    - fecha_ingreso: DATETIME
    - fecha_estimada: DATE NULL
    - fecha_entrega: DATETIME
    - total_cobrado: DECIMAL[10,2]
    + altaOrden()
    + modificacionOrden()
    + bajaOrden()
    + eliminaOrden()
    + generaPresupuesto()
  }

  class Historial_estados {
    - id_historial: int PK AI
    - id_orden: int FK
    - estado_anterior: VARCHAR[30]
    - estado_nuevo: VARCHAR[30]
    - id_usuario: int FK
    - fecha_cambio: DATETIME
    - comentario: TEXT
    + altaEstados()
  }

  class Presupuesto {
    - id_presupuesto: int PK AI
    - id_orden: int FK UNIQUE
    - mano_de_obra: DECIMAL[10,2]
    - descuento: DECIMAL[10,2]
    - total_estimado: DECIMAL[10,2]
    - estado: ENUM***
    + altaPresupuesto()
    + modificacionPresupuesto()
    + bajaPresupuesto()
  }

  class Pago {
    - id_pago: int PK AI
    - id_tipo_pago: int FK
    - id_presupuesto: int FK
    - fecha_pago: DATETIME
    - monto: DECIMAL[10,2]
  }

  class Tipo_Pago {
    - id_tipo_pago: int PK AI
    - pteDescuento: DECIMAL[5,2]
    - pteRecargo: DECIMAL[5,2]
    - medioPago: ENUM****
  }

  class Usuario {
    - id_usuario: int PK AI
    - nombre_usuario: VARCHAR[100]
    - email: VARCHAR[100]
    - password_hash: VARCHAR[255]
    - rol: ENUM['admin','tecnico']
    - activo: BOOLEAN
    + altaUsuario()
    + modificacionUsuario()
    + bajaUsuario()
  }

  Cliente "1" --> "0:*" Equipo
  Cliente "1:*" --> "1" Tipo_Cliente
  Equipo "1" --> "0:*" Falla
  Falla "0:*" --> "1" Tipo_falla
  Equipo "1" --> "1:*" Orden
  Orden "0:*" --> "0:1" Usuario
  Orden "1" --> "1:*" Historial_estados
  Orden "1" --> "0:1" Presupuesto
  Presupuesto "1" --> "0:*" Pago
  Pago "0:*" --> "1" Tipo_Pago

  note for Equipo "ENUM*: ('celular','computadora','tablet','consola','otro')"
  note for Orden "ENUM**: ('recibido','diagnostico','presupuestado','aprobado','reparacion','listo','entregado','cancelado')"
  note for Presupuesto "ENUM***: ('pendiente','aprobado','rechazado')"
  note for Tipo_Pago "ENUM****: ('DEBITO','MP','EFECTIVO','CREDITO')"
```

## Alcance Funcional

### Alcance Mínimo

Regularidad:

| Req                         | Detalle                                                                                                                                                                                                                                                                                                                                                                                |
|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CRUD simple                 | 1\. CRUD Tipo_Falla<br />2. CRUD Tipo_Cliente<br />3. CRUD Tipo_Pago                                                                                                                                                                                                                                                                                                                             |
| CRUD dependiente            | 1\. CRUD falla {depende de} CRUD Tipo_falla y CRUD Equipo<br />2. CRUD Cliente {depende de} CRUD Tipo_Pago                                                                                                                                                                                                                                                        |
| Listado<br />+<br />detalle | 1\. Fallas de los equipos ordenadas segun su frecuencia de  ocurrencia => detalle CRUD Fallas<br /> 2. Equipos que se encuentran en un determinado estado posible, muestra estado anterior, fecha de cambio de estado, tecnico a cargo, informacion del equipo correspondiente. => detalle muestra datos completos del cambio de estado, del equipo en cuestion y del tecnico a cargo. |
| CUU/Epic                    | 1\. Generar orden de trabajo<br />2. Realizar presupuesto de reparacion y realizacion de pago/s                                                                                                                                                                                                                                                                                        |

Adicionales para Aprobación

| Req      | Detalle                                                                                                                                                                                                                                                                                                               |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CRUD     | 1\. CRUD Tipo_Falla<br />2. CRUD Equipo<br />3. CRUD Tipo_Cliente<br />4. CRUD Usuario <br />5. CRUD Cliente<br />6. CRUD Falla {depende de} CRUD Tipo_falla y CRUD Equipo <br />
| CUU/Epic | 1\. Generar orden de trabajo <br />2. Realizar presupuesto de reparacion y realizacion de pago/s <br />3.  Generar Reportes estadistidos de fallas                                                                                                                                                                    |

### Alcance Adicional Voluntario

| Req      | Detalle                                                                                                                                                                                                                 |
|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Listados | 1\. Clientes registrados ordenados por antiguedad de los mismos  <br />2. Equipos que ya hayan cumplido su fecha estimada de entrega o se encuentren a pocos dias de cumplirla                                          |
| CUU/Epic | 1\. Consultar estados de una orden <br />2. Cancelación de Orden                                                                                                                                                        |
| Otros    | 1\. Enviar mail acerca del cambio de estado de una orden a su respectivo cliente <br /> 2. Enviar presupuesto de la orden a traves del mail registrado a cada cliente y esperar la respuesta de confirmacion del mismo. |
