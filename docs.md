# Documentación

## Link al [README.md](https://github.com/valenpeppi/tp/blob/main/README.md) del proyecto.

---

## Minuta mensual de avance en el proyecto

### Abril 2025 — Idea

- Definición de idea. Entrega de la proposal. Creación del Modelo entidad-relación
- Definición de los requerimientos tecnicos y funcionales.

---

### Mayo 2025 — Aprendizaje

-Primeros conocimientos de los lenguajes a utilizar en la aplicación.
-Definición grupal de tecnologías a implementar

---

### Junio 2025 — Kickoff 

**Frontend**
- Instalacion de Vite + React + TypeScript.
- Base de rutas (`App`/`Main`) y estructura de `pages/` y `shared/`.
- Contexts iniciales: Auth, Events, Message.
- Interfaz de usuario: Home, Login, Registro, layout y estilos base.

**Backend**
- Inicialización de **Express** con estructura modular en `src/`.
- Seguridad de la navegación de rutas y autenticación con JWT y Bcrypt.

---

### Julio 2025 — Modelo de Datos y CRUDs

**Prisma / DB**
- Configuración de ambiente y conexión de la ORM Prisma con MySQL.
- Modelado completo: `User`, `Event`, `EventType`, `Place`, `Sector`, `EventSector`, `Seat`, `Ticket`, `Sale`, `SaleItem`, etc.
- Relaciones, claves compuestas e índices.
- Migraciones y seeds (lugares, sectores, eventos de prueba).

**API REST**
- CRUDs para places, sectors, events, seats, users, sales.
- Middlewares base (CORS, parsing, manejo de errores).

**Frontend**
- Hardcodeo de eventos y usuarios para trabajar la lógica y funcionamiento.
- Listado/catálogo de eventos.

---

### Agosto 2025 — Linea de Venta y UI Interactiva

**Event Detail**
- `EventDetailPage` (header + body) con EventDetailContext.

**Carrito y Linea de venta**
- CartContext y páginas: `Cart`, `Pay`.
- Validaciones iniciales de stock y agrupación por evento/sector.

**Responsive**
- Ajustes de breakpoints, iconografía y componentes reutilizables.

---

### Septiembre 2025 — Pagos iniciales, gestion como Administrador
**Pagos**
- Comienzos de integración Stripe y MercadoPago (clients, endpoints y webhooks).
- Estados de compra.

**Admin**
- Implementación del AdminHome y FeatureEvents (marcar eventos como destacados).

**Organizador**
- Flujo de crear evento para organizadores.

---

### Octubre 2025 — Testing y adicionales

**Testing**
- Playwright E2E: flujo completo de compra; casos de login y navegación.
- Vitest (FE): validaciones y rutas en testeos unitarios del FrontEnd.
- Jest (BE): validaciones y rutas en testeos unitarios del BackEnd.
- Supertest: Test de integración en el BackEnd.

**Seguridad + Correcion de errores** 
- Correcciones de grouping en carrito: enumeradas vs generales.
- Mejoras de UX (loading states, mensajes, errores).

**Extras**
- Asistente virtual de ayuda: ChatBot.

---

## Tracking de features, bugs e issues


### 1) [BE] PrismaClientValidationError en `getSectorsByPlace`
Síntoma: error al invocar `prisma.sector.findMany()` por tipado/parsing del `idPlace` recibido como `string`.  
Impacto: endpoint `/api/places/:idPlace/sectors` caía con 500.  
Acción: conversión explícita `Number(idPlace)` y manejo de error con `details: error.message`.   
Refs: `src/places/places.controller.ts`

---

### 2) [TEST][FE] Timeout E2E al esperar `/cart` (flujo compra mixta)
Síntoma: `buy.e2e.spec.ts` fallaba por selector de cantidad inexistente cuando el evento ofrecía entradas enumeradas o no enumeradas de forma condicional.  
Impacto: test se quedaba en “Waiting for navigation to /cart”.   
Refs: `react-app/tests/buy.e2e.spec.ts`

---

### 3) [FE] Agrupación de ítems (enumeradas vs generales) en carrito
Síntoma: Asientos enumerados y cantidades generales se mezclaban en el mismo grupo, rompiendo el POST a backend.  
Impacto: totales erróneos y confirmaciones inconsistentes.  
Acción: lógica `buildTicketGroups()` separa por `idEvent-idPlace-idSector` y sólo agrega `ids` cuando son enumeradas; para generales usa `quantity` donde see limpian IDs.
Refs: `CartContext`.

---

### 4) [BE][PAY] Webhook Stripe
Síntoma: confirmaciones duplicadas cuando llegaban reintentos.  
Impacto: ventas confirmadas dos veces o ignoradas sin trazabilidad.  
Acción: chequeo previo de `seatEvent.state='sold'`, y rutas de “release” para devolver `reserved → available` en fallos/expiraciones.   
Refs: `src/payments/stripe.webhook.ts`

---

### 5) [TEST][FE] Configuración Vitest + TS + JSDOM
Síntoma: errores de tipos y ambiente de pruebas (matchers de jest-dom, tipos globales).  
Impacto: tests de UI fallaban al montar componentes.  
Acción: `vitest.config.ts` + `tsconfig.vitest.json` con `"types": ["vitest/globals", "@testing-library/jest-dom"]`, `environment: 'jsdom'`, `setupFiles`.  
Refs: `react-app/vitest.config.ts`, `react-app/tsconfig.vitest.json`, `react-app/src/setupTests.ts`

---

### 6) [BE] Carga de `.env`
Síntoma: log mostraba ` Cargando variables desde ${envFile}` y path de `.env.test`.  
Impacto: confusión al cargar variables de entorno, especialmente en testeos.  
Acción: TEMPLATE STRING real en `console.log`, y `dotenv.config({ path: path.resolve(envFile) })`.  
Refs: `src/config/env.ts`

---

### 7) [DB][BE] Estados de `seatEvent`
Síntoma: asientos quedaban “enganchados” en `reserved` bajo fallas/expiraciones o múltiples tabs.  
Impacto: inventario “fantasma” no liberado y mal diseño UX.  
Acción: `updateMany` en release; chequeos previos a confirmar; limpieza de `idSale/lineNumber` al liberar.  
Refs: `src/payments/stripe.webhook.ts`

---

### 8) [FE] Fallback de imágenes y assets 404 en `EventDetail`
Síntoma: imágenes remotas ausentes generaban 404/“broken image”.  
Impacto: estética deteriorada.  
Acción: assets locales (`estadio-arroyito`, `bioceres-arena`, `el-circulo`) como fallback.  
Refs: `src/pages/eventDetail/EventDetailPage.*`

---

### 9) [TEST][BE] Mocks de Prisma en unit tests
Síntoma: unit tests dependían del DB real o se rompían por retorno de tipos.  
Acción: mock estático de `prisma` (findMany/… con `jest.fn()`), limpieza de mocks en `beforeEach`.  
Refs: `src/places/places.controller.test.ts`

---

### 10) [SEC][BE] Endpoints sensibles
Síntoma: riesgo de replay/brute-force sobre `/payments/*`.  
Impacto: Riesgos de doble proceso.  
Acción: `webhookRateLimit` y límites razonables aplicados a rutas de pago.  
Refs: `src/middlewares/rateLimit.ts`, `src/payments/*.routes.ts`

---

### 11) [FE] Validaciones de login y manejo de errores HTTP
Síntoma: confusión entre mensajes 401/422 y estados locales; ausencia de limpieza de mensajes previos.  
Impacto: UX inconsistente al reintentar login.  
Acción: tests que cubren vacíos, formato de email, 401; mocks de Axios tipados; `clearMessages()` al iniciar. 
Refs: `src/pages/login/LoginUser.test.tsx`

---

### 12) [FE] Puntos de quiebre y layout.
Síntoma: solapamientos en modales/overlays en móviles y “tablet” al rotar.  
Impacto: imposibilidad de seleccionar asiento/cantidad.  
Acción: CSS Modules con breakpoints y grid/areas más conservadoras en modal. 
Refs: `seatSelector/styles/*.module.css`

---

### 13) [BE] ConfirmSale vía webhook
Síntoma: `SalesController.confirmSale` esperaba shape específico (`body: { dniClient, tickets }` y `auth.dni`).  
Impacto: confirmación no hacía flujo correcto de usuario/venta.  
Acción: armado explícito de `mockReq`/`mockRes` y logs controlados en webhook.  
Refs: `src/payments/stripe.webhook.ts`

---

## EVIDENCIA DE RESULTADOS DE TESTING

### Test unitario - Backend

#### Places
<img width="1190" height="305" alt="image" src="https://github.com/user-attachments/assets/6fc30515-1189-4292-aff7-982c23152935" />


#### Seats
<img width="1174" height="253" alt="image" src="https://github.com/user-attachments/assets/0249d56e-ad2c-4f0d-b2b1-a7586113594b" />


#### Sales
<img width="1194" height="251" alt="image" src="https://github.com/user-attachments/assets/055fe55f-add5-40d7-951d-937ae116e945" />


#### Events
<img width="1188" height="262" alt="image" src="https://github.com/user-attachments/assets/213745d7-6cb0-4331-b404-4bedc05d6539" />

---

### Test de integración - Backend

#### Places
<img width="863" height="356" alt="image" src="https://github.com/user-attachments/assets/d843137a-6c0b-4921-87ef-ce4d22612a15" />


### Test unitario - FrontEnd

#### Login
<img width="895" height="457" alt="image" src="https://github.com/user-attachments/assets/7a92b5b0-2652-437a-98c4-77105236fa7c" />


### Test E2E - FrontEnd

<img width="806" height="198" alt="image" src="https://github.com/user-attachments/assets/5a481fea-ca05-4ced-ab21-6e0134804522" />


---

# API Backend Venta de Entradas

Documentacion funcional de la API expuesta por el backend Express + Prisma.

## Base URL y conceptos globales

- Servidor HTTP: `http://localhost:3000` (puerto configurable via `PORT`).
- Prefijo comun de la API: `/api`.
- Archivos estaticos (imagenes de eventos): `GET /uploads/<nombre_archivo>`.

### Autenticacion

- Se utiliza JWT con esquema `Authorization: Bearer <token>`.
- Los tokens de usuarios finales se obtienen en `POST /api/auth/login` o `POST /api/auth/google`.
- Los tokens de empresas organizadoras se obtienen en `POST /api/auth/login-company`.
- Endpoints protegidos agregan `verifyToken`; algunos requieren ademas `isCompany` o `isAdmin`.
- Los tokens incluyen un `bootId`. Si el servidor se reinicia y cambia el `bootId`, los tokens previos quedan invalidados (respuesta `401` con codigo `RESTART_INVALIDATED_TOKEN`).

### Formato de respuestas y errores

- Controladores publicos suelen devolver `200` con datos crudos o `{ ok: true, data: ... }`.
- Errores controlados incluyen un mensaje en castellano y, en algunos casos, `details`.
- Errores de validacion usan `400`, falta de autenticacion `401`, falta de permisos `403`, no encontrado `404`, conflictos `409`, error interno `500`.

## Sistema

### GET `/api/system/boot`
- **Descripcion:** expone el identificador de arranque actual del backend.
- **Auth:** no requiere.
- **Respuesta 200:**
  ```json
  { "bootId": "uuid-o-similar" }
  ```

## Autenticacion y usuarios

### POST `/api/auth/register`
- **Descripcion:** alta de usuario final con verificacion reCAPTCHA.
- **Auth:** no requiere.
- **Body (JSON):**
  ```json
  {
    "dni": 12345678,
    "name": "Juan",
    "surname": "Perez",
    "mail": "juan@example.com",
    "password": "Secreta123",
    "birthDate": "2000-01-31",
    "captchaToken": "<token_recaptcha_v2>"
  }
  ```
- **Respuestas:** `201` registro exitoso (`{ "message": "Usuario registrado correctamente." }`).
- **Errores:** `400` campos faltantes o DNI invalido / CAPTCHA invalido,`409` DNI o email repetido,`500` error interno.

### POST `/api/auth/register-company`
- **Descripcion:** alta de empresa organizadora con reCAPTCHA.
- **Body (JSON):**
  ```json
  {
    "companyName": "Eventos SRL",
    "cuil": "30-12345678-9",
    "contactEmail": "contacto@eventos.com",
    "password": "Clave123",
    "phone": "1122334455",
    "address": "Av. Siempre Viva 123",
    "captchaToken": "<token_recaptcha_v2>"
  }
  ```
- **Respuestas:** `201` exito, 
- **Errores:** `400` faltante, `409` CUIL o email repetido, `500` error interno.

### POST `/api/auth/login`
- **Descripcion:** login de usuario final.
- **Body:** `{ "mail": "juan@example.com", "password": "Secreta123" }`.
- **Respuesta 200:**
  ```json
  {
    "token": "<jwt>",
    "user": {
      "dni": 12345678,
      "mail": "juan@example.com",
      "name": "Juan",
      "role": "user"
    }
  }
  ```
- **Errores:** `400` faltan credenciales, `401` credenciales invalidas, `500` error interno.

### POST `/api/auth/login-company`
- **Descripcion:** login de empresas organizadoras.
- **Body:** `{ "contactEmail": "contacto@eventos.com", "password": "Clave123" }`.
- **Respuesta 200:** token y datos basicos de la empresa.
- **Errores:** `400` faltan credenciales, `401` credenciales invalidas, `500` error interno.

### POST `/api/auth/google`
- **Descripcion:** Login o registro con credenciales de Google OAuth.
- **Body:** `{ "credential": "<token_google_jwt>" }`.
- **Respuesta 200:** Misma estructura que `/login`, devuelve token JWT y datos de usuario.
- **Errores:** `400` falta credencial, `401` token Google invalido, `404` usuario no encontrado (si no hay coincidencia de email/googleId), `500` error interno.

### POST `/api/auth/check-password-strength`
- **Descripcion:** verifica la fortaleza de una contraseña.
- **Body:** `{ "password": "..." }`.
- **Respuesta 200:** `{ "strength": "strong", "score": 80, "feedback": [] }`.

### POST `/api/auth/forgot-password`
- **Descripcion:** solicita email de recuperacion de contraseña.
- **Body:** `{ "email": "..." }`.
- **Respuesta 200:** `{ "message": "Si el correo existe, se ha enviado un enlace de recuperación" }`.
- **Errores:** `400` faltan credenciales, `500` error interno.

### POST `/api/auth/reset-password`
- **Descripcion:** establece nueva contraseña con token del email.
- **Body:** `{ "token": "...", "newPassword": "..." }`.
- **Respuesta 200:** `{ "message": "Contraseña actualizada correctamente" }`.
- **Errores:** `400` enlace ha expirado, token inválido, contraseña debil, falta token o contraseña.


### POST `/api/auth/change-password`
- **Descripcion:** cambia contraseña (autenticado).
- **Auth:** requiere token.
- **Body:** `{ "currentPassword": "...", "newPassword": "..." }`.
- **Respuesta 200:** `{ "message": "Contraseña actualizada correctamente" }`.
- **Errores:** `400` contraseña debil, falta contraseña actual o nueva, `401` token invalido, `500` error interno.

### PUT `/api/auth/profile`
- **Descripcion:** actualiza datos del perfil.
- **Auth:** requiere token.
- **Body:** `{ "name": "...", "surname": "...", "phone": "..." }`.
- **Respuesta 200:** `{ "ok": true, "message": "Perfil actualizado", "user": { ... } }`.
- **Errores:** `400` faltan credenciales, `500` error interno.

### DELETE `/api/auth/profile`
- **Descripcion:** elimina la cuenta del usuario/empresa.
- **Auth:** requiere token.
- **Respuesta 200:** `{ "ok": true, "message": "Cuenta eliminada" }`.
- **Errores:**  `400` faltan credenciales, `500` error interno.

### GET `/api/auth/validate`
- **Descripcion:** valida un token vigente y devuelve el payload.
- **Auth:** requiere `Authorization` con JWT valido.
- **Respuesta 200:** `{ "valid": true, "user": { ...payload } }`.
- **Errores:** `400` token faltante o `404` empresa o usuario no encontrado, `500` error interno.


## Lugares y sectores

### GET `/api/places/getPlaces`
- **Descripcion:** devuelve lugares ordenados alfabeticamente.
- **Auth:** no requiere.
- **Respuesta 200:** array de objetos `place`.
- **Errores:** `500` error interno.

### GET `/api/places/:idPlace/sectors`
- **Descripcion:** sectores definidos para un lugar (con campos crudos de la tabla `sector`).
- **Auth:** no requiere.
- **Respuesta 200:** array de sectores.
- **Errores:** `500` error interno.


## Eventos

### POST `/api/events/createEvent`
- **Descripcion:** crea un evento nuevo (solo empresas).
- **Auth:** requiere `verifyToken` + `isCompany`.
- **Body:** `multipart/form-data` con:
  - Campos de texto: `name`, `description`, `date` (ISO o formato parseable por JS), `idEventType`, `idPlace`.
  - `sectors`: cadena JSON con formato `[{ "idSector": 1, "price": 1500.0 }]`.
  - `image` (opcional): archivo JPG/PNG/GIF/WEBP <= 5 MB.
- **Validaciones destacadas:** longitud maxima de nombre (45) y descripcion (255), fecha valida, existencia de organizador/tipo de evento/lugar, al menos un sector con precio.
- **Respuesta 201:**
  ```json
  {
    "ok": true,
    "message": "Evento creado exitosamente",
    "data": {
      "idEvent": 10,
      "name": "Show",
      "state": "Pending",
      "image": "/uploads/event-...png",
      "imageUrl": "http://localhost:3000/uploads/event-...png",
      "...": "otros campos del evento"
    },
    "availableSeats": 120
  }
  ```
- **Errores:** `400` validacion, `403` token no autorizado o sin rol company, `500` errores al guardar o generar asientos.

### GET `/api/events/company`
- **Descripcion:** eventos de la empresa (cualquier estado).
- **Auth:** requiere `verifyToken` + `isCompany`.
- **Respuesta 200:** `{ "ok": true, "data": [ { ...evento, "imageUrl": "..."} ] }`.
- **Errores:** `403` token no autorizado o sin rol company, `500` error interno.

### DELETE `/api/events/:id`
- **Descripcion:** elimina un evento.
- **Auth:** requiere `verifyToken` + `isCompany`.
- **Respuesta 200:** `{ "ok": true, "message": "Evento eliminado exitosamente" }`.
- **Errores:** `403` token no autorizado o sin rol company, `400` ID inválido o hay entradas vendidas, `404` evento no encontrado, `500` error interno.

### PUT `/api/events/:id`
- **Descripcion:** actualiza un evento (solo empresas).
- **Auth:** requiere `verifyToken` + `isCompany`.
- **Body:** `multipart/form-data` con:
  - Campos de texto: `name`, `description`, `date` (ISO o formato parseable por JS), `idEventType`, `idPlace`.
  - `sectors`: cadena JSON con formato `[{ "idSector": 1, "price": 1500.0 }]`.
  - `image` (opcional): archivo JPG/PNG/GIF/WEBP <= 5 MB.
- **Respuesta 200:** `{ "ok": true, "message": "Evento actualizado exitosamente" }`.
- **Errores:** `403` token no autorizado o sin rol company, `400` validacion, `404` evento no encontrado, `500` error interno.



### GET `/api/events/pending`
- **Descripcion:** eventos pendientes de aprobacion para pantalla de admin.
- **Auth:** requiere token de usuario con rol `admin`.
- **Respuesta 200:** `{ "ok": true, "data": [ { ...evento, "imageUrl": "..."} ] }`.


### GET `/api/events/all`
- **Descripcion:** todos los eventos (cualquier estado) para admin.
- **Auth:** requiere `admin`.
- **Respuesta 200:** `{ "ok": true, "data": [ { ...evento, "imageUrl": "..."} ] }`.


### PATCH `/api/events/:id/approve`
- **Descripcion:** marca un evento como `Approved`.
- **Auth:** requiere `admin`.
- **Respuesta 200:** `{ "ok": true, "data": { "idEvent": 1, "state": "Approved", "imageUrl": "..." } }`.

### PATCH `/api/events/:id/reject`
- **Descripcion:** marca un evento como `Rejected`.
- **Auth:** requiere `admin`.
- **Respuesta 200:** `{ "ok": true, "data": { "idEvent": 1, "state": "Rejected", "imageUrl": "..." } }`.

### PATCH `/api/events/:id/feature`
- **Descripcion:** alterna el flag `featured` del evento.
- **Auth:** requiere `admin`.
- **Respuesta 200:** `{ "ok": true, "data": { "idEvent": 1, "featured": true } }`.

### PATCH `/api/events/:id/state-delete`
- **Descripcion:** alterna el flag `state` del evento.
- **Auth:** requiere `admin`.
- **Respuesta 200:** `{ "ok": true, "data": { "idEvent": 1, "state": "Deleted" } }`.
- **Errores:** `404` evento no encontrado, `400` ID invalido.



### GET `/api/events/event-types`
- **Descripcion:** lista simple de tipos de evento.
- **Auth:** publica.
- **Respuesta 200:** array crudo de `eventType`.
- **Errores:** `500` error interno.

### GET `/api/events/types`
- **Descripcion:** lista de tipos de evento con envoltura `{ ok, data }`.
- **Auth:** publica.
- **Respuesta 200:** `{ "ok": true, "data": [ ... ] }`.
- **Errores:** `500` error interno.

### GET `/api/events/featured`
- **Descripcion:** eventos aprobados y destacados.
- **Auth:** publica.
- **Respuesta 200:** `{ "ok": true, "data": [ { "availableSeats": 50, "minPrice": 1500, "agotado": false, ... } ] }`.

### GET `/api/events/approved`
- **Descripcion:** eventos aprobados con stock disponible (se filtran los agotados).
- **Auth:** publica.
- **Respuesta 200:** `{ "ok": true, "data": [ ... ] }` .

### GET `/api/events/available-dates/:idPlace`
- **Descripcion:** fechas ocupadas (Approved o Pending) para un lugar.
- **Respuesta 200:** `{ "ok": true, "data": ["2025-10-20", "2025-10-21"] }`.

### GET `/api/events/search?query=texto`
- **Descripcion:** buscador (prefijo en nombre del evento o match exacto en tipo).
- **Respuesta 200:** `{ "ok": true, "data": [ { "id": 5, "name": "...", "price": 2500, "availableSeats": 30, "agotado": false } ] }`.
- **Errores:** `400` consulta demasiado corta, `500` error interno.

### GET `/api/events/events/:id`
- **Descripcion:** resumen para la ficha del evento.
- **Respuesta 200:** 
  ```json
  {
    "ok": true,
    "data": {
      "id": 5,
      "eventName": "Show",
      "description": "...",
      "type": "Recital",
      "date": "2025-11-20T23:00:00.000Z",
      "placeName": "...",
      "placeType": "enumerated",
      "availableTickets": 80,
      "agotado": false,
      "imageUrl": "http://localhost:3000/uploads/...",
      "minPrice": 2500
    }
  }
  ```
- **Errores:** `404` evento no encontrado, `500` error interno.

### GET `/api/events/events/:id/sectors`
- **Descripcion:** sectores del evento con precio y disponibilidad.
- **Respuesta 200:** `{ "ok": true, "data": [ { "idSector": 1, "name": "...", "price": 3500, "enumerated": true, "availableTickets": 20 } ] }`.
- **Errores:** `404` evento no encontrado, `500` error interno.

### GET `/api/events/events/:id/sectors/:idSector/seats`
- **Descripcion:** estados de los asientos del sector respecto del evento.
- **Respuesta 200:** `{ "ok": true, "data": [ { "id": 12, "state": "available", "label": "12" } ] }`.
- **Errores:** `400` ID de evento o sector inválido, `500` error interno.

### GET `/api/events/events/:id/tickets/map`
- **Descripcion:** mapa de asientos disponibles para key rapida (`"<idPlace>-<idSector>-<idSeat>"`).
- **Respuesta 200:** `{ "ok": true, "data": { "1-2-15": 15, "1-2-16": 16 } }`.
- **Errores:** `404` evento no encontrado, `500` error interno.


## Asientos

### GET `/api/seats/events/:idEvent/sectors/:idSector/seats`
- **Descripcion:** fuente secundaria para obtener asientos del evento/sector (incluye label real si existe).
- **Respuesta 200:**
  ```json
  {
    "data": [
      { "id": 1, "label": "Fila A Asiento 1", "state": "available" }
    ]
  }
  ```
- **Errores:** `500` error interno.

## Ventas

### POST `/api/sales/confirm`
- **Descripcion:** confirma una venta y pasa asientos `reserved` a `sold`. Se usa internamente por los flujos de pago (no requiere token).
- **Body (JSON):**
  ```json
  {
    "dniClient": 12345678,
    "tickets": [
      {
        "idEvent": 5,
        "idPlace": 2,
        "idSector": 1,
        "ids": [101, 102]
      }
    ]
  }
  ```
- **Reglas:** verifica existencia del usuario, limite de 6 tickets por evento (sumando compras previas), requiere que los asientos sigan en estado `reserved`.
- **Respuesta 201:** `{ "message": "Venta confirmada", "idSale": 987 }`.
- **Errores:** `400` datos faltantes o excede limite, `404` usuario inexistente, `500` error al confirmar.

### GET `/api/sales/my-tickets`
- **Descripcion:** devuelve tickets vendidos al usuario autenticado.
- **Auth:** requiere token de usuario (el DNI se toma del JWT).
- **Respuesta 200:** `{ "data": [ { "id": "5-1", "eventId": 5, "sectorType": "enumerated", "seatNumber": 101, ... } ] }`.
- **Errores:** `401` token invalido, `500` error al confirmar.

### GET `/api/sales/stats`
- **Descripcion:** estadisticas globales para pantalla admin.
- **Auth:** requiere `isAdmin`.
- **Respuesta 200:** `{ "salesToday": 10, "revenueToday": 50000, "pendingEvents": 2, ... }`.
- **Errores:** `500` error al confirmar.

### GET `/api/sales/company-stats`
- **Descripcion:** estadisticas propias de la empresa autenticada.
- **Auth:** requiere `isCompany`.
- **Respuesta 200:** `{ "activeEvents": 5, "ticketsSold": 100, "totalRevenue": 200000 }`.
- **Errores:** `403` token invalido, `500` error al confirmar.

### GET `/api/sales/check?dniClient=12345678`
- **Descripcion:** verifica si existe una venta confirmada para ese DNI en los ultimos 5 minutos (se usa tras checkout).
- **Respuesta 200:** `{ "confirmed": true, "idSale": 987 }` o `{ "confirmed": false }`.
- **Errores:** `400` DNI invalido, `500` error al confirmar.

## Pagos - Stripe

Las rutas de Stripe no exigen autenticacion porque son consumidas por el frontend tras un flujo de seleccion controlado.

### POST `/api/stripe/checkout`
- **Descripcion:** crea una sesion de Checkout y reserva asientos.
- **Body (JSON):**
  ```json
  {
    "items": [
      { "name": "Entrada VIP", "amount": 350000, "quantity": 2 }
    ],
    "dniClient": 12345678,
    "customerEmail": "comprador@example.com",
    "ticketGroups": [
      {
        "idEvent": 5,
        "idPlace": 2,
        "idSector": 1,
        "ids": [101, 102]
      }
    ]
  }
  ```
  - `amount` esta expresado en centavos (ARS * 100).
  - Para sectores `nonEnumerated` se debe enviar `quantity`; los IDs se asignan automaticamente.
- **Respuesta 200:** `{ "url": "https://checkout.stripe.com/c/session..." }`.
- **Errores comunes:** `400` datos incompletos o asientos ya no disponibles, `500` error general.

### POST `/api/stripe/release`
- **Descripcion:** libera manualmente reservas (por ejemplo tras cancelar el flujo).
- **Body:** `{ "ticketGroups": [ { "idEvent": 5, "idPlace": 2, "idSector": 1, "ids": [101, 102] } ] }`.
- **Respuesta 200:** `{ "released": 2 }`.
- **Errores:** `500` error al confirmar, `400` datos incompletos.

### GET `/api/stripe/confirm-session?session_id=...`
- **Descripcion:** fuerza la confirmacion de venta si el webhook no llego.
- **Respuesta 200:** `{ "confirmed": true }` 
- **Errores:** `500` error al confirmar, `400` datos incompletos, `404` session inexistente, `409` pago no confirmado.

### POST `/api/stripe/webhook`
- **Descripcion:** endpoint para webhooks de Stripe (montado como `/api/stripe/webhook/`).
- **Headers:** requiere `Stripe-Signature`.
- **Body:** JSON puro (Express usa `express.raw`).
- **Eventos manejados:**
  - `checkout.session.completed` / `...async_payment_succeeded`: confirma la venta.
  - `checkout.session.expired`, `...async_payment_failed`, `payment_intent.payment_failed`: libera asientos.
- **Proteccion:** rate limit 60 req/min.

## Mensajes (Contacto)

### POST `/api/messages`
- **Descripcion:** envia un mensaje nuevo.
- **Body:** `{ "title": "Asunto", "description": "Mensaje...", "senderEmail": "..." }`.
- **Respuesta 201:** `created`.
- **Errores:** `500` error al confirmar, `400` datos incompletos.

### GET `/api/messages`
- **Descripcion:** lista mensajes recibidos (admin).
- **Auth:** requiere `isAdmin`.
- **Respuesta 200:** `{ "data": [ { "id": 1, "title": "Asunto", "description": "Mensaje...", "senderEmail": "..." } ] }`.
- **Errores:** `500` error al confirmar.

### PUT `/api/messages/:id/reply`
- **Descripcion:** responde el mensaje via email.
- **Auth:** requiere `isAdmin`.
- **Body:** `{ "responseText": "..." }`.
- **Respuesta 200:** `{ message: 'Mensaje respondido.', data: message }`.
- **Errores:** `500` error al confirmar.

### PUT `/api/messages/:id/reject`
- **Descripcion:** cambia estado a rechazado.
- **Auth:** requiere `isAdmin`.
- **Respuesta 200:** `{ message: 'Mensaje rechazado.', data: message }`.
- **Errores:** `500` error al confirmar.

### PUT `/api/messages/:id/discard`
- **Descripcion:** descarta el mensaje.
- **Auth:** requiere `isAdmin`.
- **Respuesta 200:** `{ message: 'Mensaje descartado.', data: message }`.
- **Errores:** `500` error al confirmar.


## IA

### POST `/api/ai/`
- **Descripcion:** proxy que reenvia prompts a OpenRouter (Deepseek/Gemma).
- **Body:** `{ "message": "texto libre" }`.
- **Respuesta 200:** `{ "reply": "respuesta del modelo" }`.
- **Errores:** `400` sin mensaje, `504` timeout en ambos modelos.

### POST `/api/ai/generate-reply`
- **Descripcion:** genera una respuesta sugerida  actuando como soporte técnico.
- **Body:** `{ "userMessage": "mensaje del usuario a responder" }`.
- **Respuesta 200:** `{ "reply": "respuesta generada por IA..." }`.
- **Errores:** `400` sin mensaje, `504` timeout en ambos modelos.

## Notas adicionales

- Los asientos se generan automaticamente al crear eventos (`createSeatEventGridForEvent`).
- Las rutas protegidas deben invocarse con el JWT mas reciente si el backend fue reiniciado (ver `/api/system/boot`).
- `uploads/` se genera automaticamente si no existe al subir imagenes de eventos.

