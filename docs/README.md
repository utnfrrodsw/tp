# Documentación — Musicboxd

Punto de entrada de la documentación del TP, tal como lo pide
[`docs.md`](../docs.md) de la cátedra. Todo lo que sigue está en Markdown y
versionado en el repositorio.

## Índice

| Documento | Qué contiene |
|:-|:-|
| [Propuesta del TP](../proposal.md) | Tema, integrantes, DER, alcance funcional y stack. Es el documento que aprobó la cátedra. |
| [Minutas de reunión y avance](minutas.md) | Registro de las reuniones del equipo: qué se decidió, qué se repartió y qué quedó pendiente. |
| [Tracking de features, bugs e issues](tracking.md) | Issues del GitHub Project, ramas, pull requests y estado de cada feature. |
| [Estado del alcance](estado-alcance.md) | Qué ítems de la propuesta están terminados y cuáles faltan, punto por punto. |
| [Diagrama de entidad-relación](der.md) | El modelo de datos completo en Mermaid, con las restricciones y el comportamiento ante borrados. |
| [Instalación y ejecución](#instalación-y-ejecución) | Cómo levantar el proyecto sin conocer cómo está hecho. |
| [Enunciado de la cátedra](enunciado.md) | Copia del enunciado original del TP (era el `README.md` del fork). |
| [FAQ de la cátedra](../FAQ.md) | Preguntas frecuentes publicadas por los docentes. |

## Instalación y ejecución

Las instrucciones completas viven al lado del código de cada app, porque cada una
tiene sus propios requisitos:

- **[Backend](../backend/README.md)** — Node + Express + MySQL: creación de la
  base, variables de entorno, carga del catálogo con el seed y scripts
  disponibles.
- **[Frontend](../frontend/README.md)** — Vite + React: variables de entorno,
  scripts y cómo se comunica con la API.

El resumen de los cuatro comandos para arrancar de cero está en el
[README del proyecto](../README.md).

## Gestión del proyecto

- **Metodología**: Scrum adaptado a un equipo de tres, con iteraciones de dos
  semanas y una reunión de sincronización semanal. El detalle y el registro de
  cada reunión están en [minutas.md](minutas.md).
- **Herramienta de tracking**: GitHub Issues + GitHub Projects sobre el propio
  repositorio, para que cada issue quede vinculado a su rama y a su pull request.
  El estado de cada uno está volcado en [tracking.md](tracking.md).
- **Flujo de trabajo en git**: ramas `feature/<issue>-<descripción>` que salen de
  `develop`, un pull request por issue y merge a `develop` con revisión de
  Santino Gallo. `main` guarda las versiones entregadas.

## Modelo de datos

El DER vigente está en [der.md](der.md), en Mermaid. La
[propuesta](../proposal.md#modelo) tiene la imagen del DER aprobado, junto con
los ajustes que se le hicieron al modelo original y el motivo de cada uno. La descripción de las
tablas ya creadas, las reglas de negocio que viven en el modelo y los desvíos
respecto del pasaje a tablas están en la sección
[Modelo de datos](../backend/README.md#modelo-de-datos) del README del backend.

## Decisiones de arquitectura

Las tres decisiones que atraviesan todo el proyecto están documentadas en detalle
en el README del backend:

1. **[La base propia es la única fuente de verdad](../backend/README.md#la-base-propia-es-la-única-fuente-de-verdad)** —
   la aplicación no consulta APIs de metadata musical en runtime; el catálogo se
   carga una sola vez con un seed en dos etapas.
2. **[Arquitectura en capas](../backend/README.md#arquitectura-en-capas)** —
   `routes → controller → service → repository → entity`, sin saltear capas.
3. **[Membresías y pasarela de pago](../backend/README.md#membresías-y-pasarela-de-pago)** —
   por qué la membresía Pro es un [pago único](../backend/README.md#pago-único-no-suscripción-recurrente)
   y no una suscripción recurrente, y qué hace cada paso del circuito de
   MercadoPago.
