# Minutas de reunión y gestión del proyecto — Fluffy

TP DSW 2026 · Adopción de Mascotas
Integrantes: Altamirano, Marianela (53948) · Sayago, Valentina (54027)

---

## Metodología de trabajo

El grupo arrancó siendo de tres integrantes, pero durante el desarrollo una
compañera se dio de baja y el proyecto quedó a cargo de dos personas. Por eso,
si bien el alcance funcional se dimensionó originalmente para tres, lo
sostuvimos y completamos entre las dos.

Al quedar un grupo de dos, no seguimos una metodología formal con reuniones
fijas, sino que nos coordinamos de manera continua según lo que necesitaba cada
etapa del proyecto. Nos comunicábamos principalmente por **WhatsApp** para el
día a día, hacíamos **videollamadas por Discord** cuando teníamos que discutir
algo más a fondo o resolver un problema juntas, y nos juntábamos **en persona**
en los momentos de más trabajo (por ejemplo antes de cada entrega).

No tuvimos un reparto rígido de tareas: las dos tocamos tanto el backend como
el frontend, y nos íbamos acomodando según lo que hacía falta y la
disponibilidad de cada una. Para no pisarnos y llevar registro de lo que hacía
cada una, trabajamos con **ramas separadas en GitHub** e integrábamos los
cambios mediante **Pull Requests**, revisándolos antes de mergear a `main`.

---

## Minutas por hito

### Hito 1 — Propuesta del enunciado
**Fecha aproximada:** Abril 2026
**Modalidad:** Presencial / videollamada

**Temas tratados:**
- Elección del tema: sistema de gestión de adopción de mascotas.
- Definición del alcance funcional (CRUDs, listados, epics) para regularidad y
  aprobación.
- Elección del stack: Node + Express + TypeScript + MikroORM + MySQL (backend),
  React + Vite (frontend).

**Decisiones:**
- Separar el proyecto en dos repositorios (backend y frontend), agnósticos y
  comunicados por API REST.
- Completar y entregar la plantilla de propuesta para su aprobación.

---

### Hito 2 — Setup inicial y bases del proyecto
**Fecha aproximada:** Mayo – Julio 2026
**Modalidad:** WhatsApp + videollamadas

**Temas tratados:**
- Configuración del backend (TypeScript, estructura de carpetas, scripts).
- Configuración del frontend (Vite + React).
- Conexión a base de datos en la nube mediante MikroORM.

**Decisiones:**
- Arquitectura en capas en el backend (entity, DAO, service, controller, routes).
- Convención de trabajo con git: ramas y Pull Requests.

---

### Hito 3 — Desarrollo de CRUDs y entidades
**Fecha aproximada:** Agosto – Septiembre 2026
**Modalidad:** Presencial + WhatsApp

**Temas tratados:**
- Implementación de los CRUDs de las entidades del dominio.
- Modelo de dominio y relaciones entre entidades.
- Listados con filtro y vistas de detalle.

**Decisiones:**
- Validación de datos con Zod y manejo centralizado de errores.
- Distribución del trabajo por funcionalidades según disponibilidad de cada una.

---

### Hito 4 — Entrega y defensa de Regularidad
**Fecha aproximada:** Octubre 2026
**Modalidad:** Coordinación por WhatsApp + videollamada

**Temas tratados:**
- Verificación del cumplimiento de los requisitos de regularidad.
- Preparación de la documentación y la defensa.

**Decisiones:**
- Alcanzar la condición de regularidad con los CRUDs, listados y epics mínimos.

---

### Hito 5 — Refactor de arquitectura
**Fecha aproximada:** Octubre 2026
**Modalidad:** Videollamadas + GitHub

**Temas tratados:**
- Refactor del backend a arquitectura en 5 capas, en inglés.
- Refactor del frontend a arquitectura feature-based, con React Query, Tailwind
  y React Hook Form + Zod.

**Decisiones:**
- Unificar convenciones (código en inglés, estructura por features).
- Integrar los cambios mediante Pull Requests revisados entre ambas.

---

### Hito 6 — Entrega y defensa de Aprobación Directa
**Fecha aproximada:** Noviembre 2026
**Modalidad:** WhatsApp + videollamadas + presencial

**Temas tratados:**
- Tests automatizados (unitarios y end-to-end).
- Deploy del backend y la base en Railway, y del frontend en Netlify.
- Alcance adicional voluntario: notificaciones por email, subida de imágenes a
  Cloudinary.
- Grabación del video de demostración y preparación de la documentación final.

**Decisiones:**
- Repartir la grabación del video y la preparación de los entregables.
- Cerrar las mejoras de calidad (ESLint, coherencia de seguridad en rutas).

---

## Tracking de features, bugs e issues

El seguimiento del desarrollo se realizó a través de **GitHub**, en los dos
repositorios del proyecto:

- **Ramas por feature:** cada funcionalidad o mejora se desarrolló en su propia
  rama (ej: `refactor-arquitectura`, `feature/emails-notificaciones`,
  `test/application-table`).
- **Pull Requests:** la integración a `main` se hizo mediante PRs, revisados
  entre las integrantes antes de mergear.
- **Historial de commits:** registra la continuidad del desarrollo y los aportes
  de cada una.

Links a los repositorios:
- Backend: https://github.com/dsw-2026/backend
- Frontend: https://github.com/dsw-2026/frontend
