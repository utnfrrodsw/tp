# API REST

Base URL local: `http://localhost:3000/api`. Los cuerpos JSON usan `Content-Type: application/json`, salvo `POST /uploads`, que recibe `multipart/form-data`.

La referencia refleja las rutas montadas en `src/api/routes.ts` y los schemas Zod actuales. La mayoría de las rutas de negocio requieren la cookie HTTP-only `access_token`; no se aplican restricciones de rol en esos montajes (`authenticate([])`). `auth`, `uploads` y el health-check son públicos, salvo las excepciones señaladas.

## Rutas

```text
/status
/auth: register, login, logout, refresh, forgot-password,
       reset-password/:token, validate/:token, me
/users: GET/POST /, GET/PUT/PATCH/DELETE /:id
/clients: GET/POST /, GET/PUT/DELETE /:id
/client-types: GET/POST /, GET/PUT/DELETE /:id
/equipments: GET/POST /, GET/PUT/DELETE /:id, GET /equipmentForClient/:id
/orders: GET/POST /, GET /:id, GET /ofEquipment/:id, GET /stats
/failures: POST /, GET /ofOrder/:id, GET /ofOrder/:id_order/total,
           PUT/DELETE /:id
/failure-types: GET/POST /, GET/PUT/DELETE /:id
/payment-types: GET/POST /, GET/PUT/DELETE /:id
/payments: GET/POST /, GET /ofBudget/:id, GET/DELETE /:id
/budgets: GET/POST /, GET /ofOrder/:id, GET/PUT/DELETE /:id,
          POST /:id/send-email
/added-cost: GET/POST /, GET /ofBudget/:id, GET /ofBudget/:id_budget/total,
             GET/PUT/DELETE /:id
/status: GET /, GET /ofOrder/:id, POST /
/uploads: POST /
```

All paths above are relative to `/api`.

## Convenciones

- IDs de entidades: UUID v7 en formato string. Se rechazan IDs que no sean UUID v7.
- Listados paginados aceptan `search`, `page`, `limit`, `sortOrder` y el `sortBy` permitido por módulo. Defaults comunes: `page=1`, `limit=50`, `sortOrder=asc`; el repositorio limita el tamaño efectivo de página a 200.
- Las respuestas de listados paginados tienen forma `{ data: [], metadata: { page, limit, total, totalPages } }`.
- Un body que tiene schema `strict` rechaza propiedades no declaradas. Campos opcionales pueden omitirse; las enumeraciones solo aceptan sus valores documentados en el [modelo de datos](../02-propuesta/modelo-datos.md).
- Error de validación: `400` `{ "message": "Validation failed", "errors": { ... } }`.
- Error no controlado: `{ "message": "Internal server error", "error": "..." }` en desarrollo. En producción se omite `error`.
- Un recurso inexistente normalmente responde `404` `{ "message": "... no encontrado" }`; el texto varía según el módulo.

## Health check

### `GET /status`

- Auth: no.
- Request: sin body.
- Response `200`: texto plano `ok`.

## Auth

### `POST /auth/register`

- Auth: no.
- Request: `{ "username": "tecnico1", "email": "tecnico@example.com", "password": "secreto123", "urlPicture": "https://example.com/foto.jpg" }`; `urlPicture` es opcional.
- Response `200`: `{ "message": "Usuario registrado exitosamente, valida tu cuenta a través del enlace enviado a tu correo electrónico" }`.
- El primer usuario queda con rol `admin`; los siguientes, `tecnico`. La cuenta comienza desactivada hasta validar el correo. Los usuarios técnicos requieren además validación administrativa.

### `POST /auth/login`

- Auth: no.
- Request: `{ "username": "tecnico1", "password": "secreto123" }`.
- Response `200`: `{ "message": "Login successful" }` y cookie HTTP-only `access_token` (duración: una hora).
- Responses `401`: credenciales incorrectas. `403`: cuenta inactiva o pendiente de aprobación.

### `POST /auth/logout`

- Auth: sí.
- Request: sin body.
- Response `200`: `{ "message": "Logout successful" }`; elimina la cookie.

### `POST /auth/refresh`

- Auth: no.
- Request: sin body.
- Response `200`: `{ "message": "Refresh token endpoint not implemented yet" }`. No renueva el token.

### `POST /auth/forgot-password`

- Auth: no.
- Request: `{ "email": "tecnico@example.com" }`.
- Response `200`: `{ "message": "Correo de recuperación enviado" }`; `404`: `{ "error": "Usuario no encontrado" }`.

### `POST /auth/reset-password/:token`

- Auth: no.
- Request: path param `token`; body `{ "password": "nueva-clave123" }`.
- Response `200`: `{ "message": "Contraseña actualizada correctamente" }`; `400` para token inválido/expirado o contraseña que no cumple la longitud requerida; `404` si el usuario no existe.
- Nota: el schema compartido admite contraseñas desde 6 caracteres, pero este controller exige al menos 8 y como máximo 72.

### `PUT /auth/validate/:token`

- Auth: no.
- Request: path param `token`; sin body.
- Response `200`: `{ "success": true, "message": "Cuenta validada con éxito", "usuario": { ... } }`; `400`: `{ "success": false, "message": "..." }`.

### `GET /auth/me`

- Auth: sí.
- Request: sin body.
- Response `200`: `{ "id_user": "<uuid-v7>", "userName": "tecnico1", "email": "tecnico@example.com", "rol": "tecnico", "urlPicture": "...", "status": true }`.
- Response `404`: usuario no encontrado.

## Users

### `GET /users`

- Auth: sí.
- Query: paginación común; `sortBy`: `userName`, `email`, `rol`, `id_user`.
- Response `200`: listado paginado de usuarios, sin `password_hash`.

### `POST /users`

- Auth: sí.
- Request: el endpoint no tiene schema ni implementación: `createUser` no envía respuesta. La petición puede quedar pendiente; no usar. Para registrar usuarios usar `POST /auth/register`.

### `GET /users/:id`

- Auth: sí. Path param `id` UUID v7.
- Response `200`: usuario sin hash de contraseña; `404`: usuario no encontrado.

### `PUT /users/:id` y `PATCH /users/:id`

- Auth: sí. Path param `id` UUID v7.
- Request: objeto con cualquier combinación de campos opcionales: `{ "userName": "tecnico2", "email": "nuevo@example.com", "urlPicture": "https://example.com/foto.jpg", "rol": "tecnico", "validationStatus": true }`.
- Response `200`: usuario actualizado sin `password_hash`; `404`: usuario no encontrado.

### `DELETE /users/:id`

- Auth: sí. Desactivación lógica (`status=false`), no borra físicamente.
- Response `200`: usuario actualizado; `404`: usuario no encontrado.

## Clients

### `POST /clients`

- Auth: sí.
- Request: `{ "clientName": "Ana Pérez", "clientEmail": "ana@example.com", "clientPhone": "+5491123456789", "cuit": "20-12345678-6" }`.
- El backend asigna el tipo de cliente; no enviar `id_client_type`.
- Response `201`: cliente creado.

### `GET /clients`

- Auth: sí.
- Query: paginación común; `categoryClient` opcional; `sortBy`: `clientName`, `clientEmail`, `cuit`, `dateOfRegistration`. `search` busca nombre, email o CUIT.
- Response `200`: `{ data: [ ...clientes ], metadata: { ... } }`.

### `GET /clients/:id`

- Auth: sí. Path param `id` UUID v7.
- Response `200`: cliente; `404`: cliente no encontrado.

### `PUT /clients/:id`

- Auth: sí. Body parcial con cualquier combinación de `clientName`, `clientEmail`, `clientPhone`, `cuit` y `status`.
- Response `200`: cliente actualizado; `404`: cliente no encontrado.

### `DELETE /clients/:id`

- Auth: sí. Desactivación lógica (`status=false`).
- Response `200`: cliente actualizado; `404`: cliente no encontrado.

## Client types

### `GET /client-types`

- Auth: sí.
- Query: paginación común; `sortBy`: `clientTypeName`, `amountForCategoryUp`, `id_client_type`.
- Response `200`: listado paginado.

### `POST /client-types`

- Auth: sí.
- Request: `{ "clientTypeName": "Frecuente", "amountForCategoryUp": 5 }`.
- Response `201`: tipo de cliente creado.

### `GET /client-types/:id`, `PUT /client-types/:id`, `DELETE /client-types/:id`

- Auth: sí. `id` es UUID v7.
- GET responde `200` con el tipo de cliente o `404` si no existe.
- PUT recibe body parcial `{ "clientTypeName": "Preferencial", "amountForCategoryUp": 10 }` y responde `200` con el recurso actualizado.
- DELETE responde `200` `{ "message": "Client deleted successfully" }`.

## Equipments

### `GET /equipments`

- Auth: sí.
- Query: paginación común; `sortBy`: `tipo_equipment`, `brand`, `model`, `id_client`, `id_equipment`, `observations`. `search` filtra equipos.
- Response `200`: listado paginado.

### `POST /equipments`

- Auth: sí.
- Request: `{ "tipo_equipment": "celular", "brand": "Marca", "model": "Modelo", "observations": "Pantalla marcada", "id_client": "<uuid-v7>" }`. `observations` es opcional.
- Response `201`: equipo creado.

### `GET /equipments/equipmentForClient/:id`

- Auth: sí. Path param `id` UUID v7.
- Response `200`: lista de equipos del cliente.

### `GET /equipments/:id`, `PUT /equipments/:id`, `DELETE /equipments/:id`

- Auth: sí. `id` es UUID v7.
- GET responde `200` con el equipo.
- PUT recibe body parcial con `tipo_equipment`, `brand`, `model`, `observations` o `id_client`; responde `200` con el equipo actualizado o `404` si no existe.
- DELETE responde `200` con el equipo eliminado, `404` si no existe o `409` si tiene órdenes asociadas.

## Orders

### `POST /orders`

- Auth: sí.
- Request: `id_client` es obligatorio; `equipment` puede referir un equipo existente o describir uno nuevo. `failures` requiere al menos una falla inicial.

```json
{
  "id_client": "<uuid-v7>",
  "equipment": {
    "tipo_equipment": "celular",
    "brand": "Marca",
    "model": "Modelo",
    "observations": "Marcas en la carcasa"
  },
  "observations": "No enciende",
  "equipmentPhotoUrl": "https://example.com/equipo.jpg",
  "estimatedDate": "2026-10-10",
  "id_user": "<uuid-v7>",
  "failures": [
    { "id_failure_type": "<uuid-v7>", "description": "No enciende" }
  ]
}
```

Para un equipo existente, usar `"equipment": { "id_equipment": "<uuid-v7>" }`. `observations`, `equipmentPhotoUrl`, `estimatedDate` e `id_user` son opcionales; las fechas usan `YYYY-MM-DD`.
- Response `201`: `{ "message": "Orden registrada con éxito", "order": { ... } }`.

### `GET /orders`

- Auth: sí.
- Query: paginación común; `sortBy`: `dateOfEntry`, `estimatedDate`, `deliveryDate`, `totalCharged`, `observations`, `id_equipment`. `search` busca en observaciones.
- Response `200`: listado paginado.

### `GET /orders/:id` y `GET /orders/ofEquipment/:id`

- Auth: sí. `id` UUID v7.
- Responses `200`: una orden o lista de órdenes del equipo, respectivamente.

### `GET /orders/stats`

- Auth: sí.
- Request: sin body ni parámetros.
- Response `200`: métricas de órdenes agrupadas por estado.

## Failures

### `POST /failures`

- Auth: sí.
- Request: array no vacío de `{ "id_failure_type": "<uuid-v7>", "failureDescription": "Descripción", "id_order": "<uuid-v7>" }`.
- Response `201`: `{ "message": "Fallas registradas con éxito", "failures": [ ... ] }`.

### `GET /failures/ofOrder/:id`

- Auth: sí. Path param `id` UUID v7.
- Response `200`: fallas registradas para la orden.

### `GET /failures/ofOrder/:id_order/total`

- Auth: sí.
- Response `200`: `{ "total": number }`, suma de importes estimados para las fallas de la orden.

### `PUT /failures/:id`

- Auth: sí. Path param UUID v7.
- Request: `{ "id_failure_type": "<uuid-v7>", "description": "Descripción actualizada" }`.
- Response `200`: `{ "message": "Falla actualizada con exito", "failure": { ... } }`.

### `DELETE /failures/:id`

- Auth: sí. Path param UUID v7.
- Response `200`: `{ "message": "Falla eliminada correctamente", "res": { ... } }`.

## Failure types

### `GET /failure-types`

- Auth: sí.
- Query: paginación común; `sortBy`: `failureDescription`, `estimatedImport`, `id_failure_type`.
- Response `200`: listado paginado.

### `POST /failure-types`

- Auth: sí.
- Request: `{ "failureDescription": "Cambio de pantalla", "estimatedImport": 25000 }`.
- Response `201`: tipo de falla creado.

### `GET /failure-types/:id`, `PUT /failure-types/:id`, `DELETE /failure-types/:id`

- Auth: sí. `id` es UUID v7.
- GET responde `200` con el tipo.
- PUT recibe body parcial `{ "failureDescription": "...", "estimatedImport": 25000 }` y responde `200` con el tipo actualizado.
- DELETE responde `200` `{ "message": "Type tailure deleted successfully" }`.

## Payment types

### `GET /payment-types`

- Auth: sí.
- Query: paginación común; `sortBy`: `paymentTypeName`, `paymentMethod`, `type_of_payment`, `id_payment_type`, `percentage`.
- Response `200`: listado paginado.

### `POST /payment-types`

- Auth: sí.
- Request: `{ "paymentTypeName": "Débito", "paymentMethod": "DEBITO", "type_of_payment": "Descuento", "percentage": 0 }`.
- Response `201`: tipo de pago creado.

### `GET /payment-types/:id`, `PUT /payment-types/:id`, `DELETE /payment-types/:id`

- Auth: sí. `id` es UUID v7.
- GET responde `200` con el tipo.
- PUT recibe body parcial con `paymentTypeName`, `paymentMethod`, `type_of_payment` o `percentage`; responde `200` con el tipo actualizado.
- DELETE responde `200` `{ "message": "Type tailure deleted successfully" }`.

## Budgets

### `GET /budgets`

- Auth: sí.
- Query: paginación común; `sortBy`: `laborCost`, `estimatedTotal`, `status`.
- Response `200`: listado paginado. `estimatedTotal` es calculado por el servicio, no una columna de Prisma.

### `POST /budgets`

- Auth: sí.
- Request: `{ "id_order": "<uuid-v7>", "laborCost": 35000, "discount": 0 }`; `discount` es opcional y los importes deben ser no negativos.
- Response `201`: presupuesto creado.

### `GET /budgets/ofOrder/:id`, `GET /budgets/:id`

- Auth: sí. `id` UUID v7.
- Response `200`: presupuesto; `404` si no existe presupuesto para la orden o el ID no existe.

### `PUT /budgets/:id`

- Auth: sí. Body parcial: `{ "laborCost": 40000, "discount": 5000, "status": "pendiente" }`.
- `status` acepta `pendiente`, `aprobado` o `rechazado`. Response `200`: presupuesto actualizado.

### `DELETE /budgets/:id`

- Auth: sí.
- Response `200`: resultado del borrado.

### `POST /budgets/:id/send-email`

- Auth: sí.
- Request: sin body.
- Response `200`: `{ "message": "Presupuesto enviado por mail correctamente." }`; `404` si no existe el presupuesto.

## Added costs

Base path: `/added-cost` (singular).

### `GET /added-cost`

- Auth: sí.
- Query: paginación común; `sortBy`: `addedCostAmount`, `addedCostDescription`, `type_addedCost`.
- Response `200`: listado paginado.

### `POST /added-cost`

- Auth: sí.
- Request: `{ "id_budget": "<uuid-v7>", "type_addedCost": "repuesto", "addedCostDescription": "Repuesto de pantalla", "addedCostAmount": 18000 }`.
- `type_addedCost` acepta `repuesto`, `procedimientoEspecial`, `garantia`, `reparacionExpress`, `limpiezaPuestaAPunto`, `serviciosSoftware`.
- Response `201`: costo añadido creado.

### `GET /added-cost/ofBudget/:id`, `GET /added-cost/:id`

- Auth: sí. La ruta de total debe consultarse antes de la ruta genérica.
- Responses `200`: lista de costos de un presupuesto o un costo; `404` si un costo individual no existe.

### `GET /added-cost/ofBudget/:id_budget/total`

- Auth: sí.
- Response `200`: `{ "total": number }`.

### `PUT /added-cost/:id`, `DELETE /added-cost/:id`

- Auth: sí. PUT recibe body parcial con `type_addedCost`, `addedCostDescription` y/o `addedCostAmount` positivo.
- Responses `200`: recurso modificado o resultado del borrado.

## Payments

### `GET /payments`

- Auth: sí.
- Query: paginación común; `sortBy`: `amount`, `dateOfPayment`.
- Response `200`: listado paginado.

### `POST /payments`

- Auth: sí.
- Request: `{ "id_budget": "<uuid-v7>", "id_payment_type": "<uuid-v7>", "amount": 12000 }`; `amount` debe ser positivo.
- Response `201`: pago creado.

### `GET /payments/ofBudget/:id`, `GET /payments/:id`, `DELETE /payments/:id`

- Auth: sí. `id` UUID v7.
- GET responde `200` con lista de pagos del presupuesto o un pago; pago individual inexistente responde `404`.
- DELETE responde `200` con el resultado del borrado.

## Status history

### `GET /status/ofOrder/:id`

- Auth: sí. Path param UUID v7.
- Response `200`: historial de estados de la orden.

### `POST /status`

- Auth: sí.
- Request: `{ "id_order": "<uuid-v7>", "id_user": "<uuid-v7>", "status": "diagnostico", "comment": "Equipo revisado", "notifyClient": false }`.
- `status` acepta los valores de `EnumOrderStatus`; `comment` y `notifyClient` son opcionales. Aunque el schema exige `id_user`, el controller toma el usuario efectivo de la sesión. `notifyClient` aún no dispara una notificación.
- Response `201`: registro de historial creado. Cambia el estado actual de la orden; al aprobarla, también puede aprobar su presupuesto.

### `GET /status` (listado de historial)

- Auth: sí según el montaje del módulo; paginación común y `sortBy`: `dateOfChange`, `status`.
- **Limitación actual:** el `GET /status` de health-check se registra antes que el router autenticado de historial y responde `ok`; por lo tanto, el listado de historial no es accesible en esa misma ruta. El endpoint `/status/ofOrder/:id` sí está disponible.

## Uploads

### `POST /uploads`

- Auth: no.
- Request: `multipart/form-data` con un archivo en el campo `file`.
- Response `201`: `{ "id": "<nombre-archivo>", "url": "https://..." }`.
- Response `400`: `{ "message": "No se recibió ningún archivo" }`.

## Fuera de alcance de esta referencia

La documentación describe lo que hacen actualmente las rutas y controladores. Los controladores que delegan errores usan el middleware común; en producción el detalle interno se omite. Las notificaciones WebSocket solo se emiten en las operaciones que actualmente invocan `emitEvent`.