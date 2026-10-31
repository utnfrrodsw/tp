# Propuesta TP DSW — Manitas

## Grupo

### Integrantes

* 56821 - Arias, Francisco José
* 54456 - Baremboum, Micaela
* 42062 - Coria, Lautaro
* 52098 - Monzón, Maximiliano Nicolás

### Repositorios

* [fullstack app (monorepo)](https://github.com/MaxiNMonzon/Manitas): `manitas-backend` (API) y `manitas-frontend` (SPA)


## Tema

### Descripción

Aplicación que conecta clientes con profesionales de oficios para resolver tareas del hogar. El cliente busca un
profesional por oficio y zona, le pide presupuesto eligiendo un turno libre para la visita (o pide una urgencia que le
llega a todos los profesionales cercanos), acepta el presupuesto, paga por Mercado Pago y califica. Cada profesional
define sus tarifas, su horario y sus zonas. Se informan las promociones bancarias del mes según el método de pago.

### Modelo

```mermaid
erDiagram
    PROVINCIA ||--o{ LOCALIDAD : tiene
    LOCALIDAD ||--o{ ZONA : tiene
    ZONA ||--o{ CLIENTE : "residencia de"
    PROFESIONAL }o--o{ ZONA : "trabaja en"
    PROFESIONAL }o--o{ ESPECIALIDAD : hace
    ESPECIALIDAD ||--o{ TIPO_DE_SERVICIO : agrupa
    PROFESIONAL }o--o{ TIPO_DE_SERVICIO : "habilidades"
    PROFESIONAL ||--o{ MATRICULA : tiene
    ESPECIALIDAD ||--o{ MATRICULA : "habilita"
    PROFESIONAL ||--o{ HORARIO_LABORAL : "horario fijo"
    CLIENTE ||--o{ SOLICITUD_DE_SERVICIO : pide
    PROFESIONAL ||--o{ SOLICITUD_DE_SERVICIO : atiende
    ESPECIALIDAD ||--o{ SOLICITUD_DE_SERVICIO : "de"
    SOLICITUD_DE_SERVICIO ||--o{ TURNO : reserva
    PROFESIONAL ||--o{ TURNO : "ocupado en"
    METODO_DE_PAGO }o--o{ PROMOCION : "tiene"

    SOLICITUD_DE_SERVICIO {
        enum estadoServicio "solicitado, agendado, presupuestado, contratado, reprogramacion, finalizado, rechazado, cancelado, expirado"
        boolean urgente
        datetime fechaVisita
        datetime fechaInicio
        decimal costoVisita
        decimal costoFinal
        int horasTrabajo
        int calificacionServicio
        string idPagoMercadoPago
    }
```

Además: `CONSULTA` (consultas de la sección Ayuda, las lee el administrador). Diagrama original:
[modelo de dominio](https://drive.google.com/file/d/1yA9dty0EUn0jITPk4veSDCFWdFEMilrt/view).

## Alcance Funcional

### Alcance Mínimo

Regularidad:

| Req | Detalle | Dónde está |
| :- | :- | :- |
| CRUD simple | 1. CRUD Usuario (cliente y profesional)<br>2. CRUD Tipo de Servicio<br>3. CRUD Localidad<br>4. CRUD Método de Pago | 1. Registro + Mi perfil (ver, editar, dar de baja) y listado del admin<br>2–4. Panel de administración → Catálogos |
| CRUD dependiente | 1. CRUD Zona {depende de} CRUD Localidad<br>2. CRUD Profesional {depende de} CRUD Especialidad | 1. Panel de administración → Zonas<br>2. Registro / Mi perfil del profesional (elige especialidades, habilidades y zonas) |
| Listado + detalle | 1. Tipos de servicio filtrados por especialidad → detalle del tipo de servicio y su especialidad<br>2. Profesionales filtrados por especialidad (y zona) → detalle del perfil con especialidades, zonas, costo de visita y reseñas | 1. Admin → Tipos de servicio<br>2. Cliente → Profesionales |
| CUU/Epic | 1. Solicitar servicio (pedir presupuesto con turno)<br>2. Calificar servicio | Cliente → Profesionales / Mis solicitudes |

Adicionales para Aprobación:

| Req | Detalle | Dónde está |
| :- | :- | :- |
| CRUD | CRUD de todas las clases de negocio necesarias: Usuario (Cliente, Profesional), Especialidad, Tipo de Servicio, Provincia, Localidad, Zona, Método de Pago, Promoción, Horario laboral | Admin → Catálogos (Especialidad, Tipo de servicio, Provincia, Localidad, Zona, Método de pago, Promoción; Clientes y Profesionales en consulta); Profesional → Agenda → Mi horario; Usuario desde Mi perfil |
| CUU/Epic | 1. Solicitar presupuesto / servicio (también urgente)<br>2. Coordinar visita (turnos libres, aceptar y reprogramar)<br>3. Confirmar servicio (presupuesto + aceptación con reserva de horas)<br>4. Abonar servicio (Mercado Pago)<br>5. Calificar profesional<br>6. Informar promociones bancarias del mes<br>7. Notificar próximas visitas (avisos) | Encadenados: la solicitud (1) genera la visita (2), que habilita el presupuesto (3), que habilita el pago (4), que habilita la calificación (5), que alimenta el perfil del profesional que ve el próximo cliente (1) |

### Alcance Adicional Voluntario

| Req | Detalle |
| :- | :- |
| Listados | 1. Mis solicitudes del cliente por estado (en curso / completadas) con detalle<br>2. Solicitudes del profesional por estado (nuevas / en curso / historial) agrupadas en carpetas<br>3. Agenda mensual del profesional<br>4. Cobros del profesional (pendientes y depositados) |
| CUU/Epic | 1. Servicio urgente: le llega a todos los profesionales de la zona y el primero que acepta indica cuándo llega<br>2. Reprogramación de visita o trabajo con contrapropuestas<br>3. Consultas de Ayuda al administrador |
| Otros | 1. Pago con Mercado Pago Checkout Pro (sandbox) con verificación del pago en el servidor<br>2. Avisos dentro de la app (polling)<br>3. Vencimiento automático de solicitudes sin respuesta<br>4. Datos de prueba (`seed:demo`) y catálogo geográfico real (`seed:georef`, API Georef)<br>5. Documentación OpenAPI/Swagger |
