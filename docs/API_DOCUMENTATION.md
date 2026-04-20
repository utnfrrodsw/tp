# API Documentation - TPDSW-COM304 Backend REST (Cobertura Completa)

## 1. Información General

### Nombre del proyecto
**TPDSW-COM304 - Sistema de Gestión de Libros y Reseñas (Backend REST API)**

### Descripción breve
API REST desarrollada con **Express + MikroORM + JWT** para gestión de usuarios, libros, reseñas, favoritos, listas, seguimiento social, feed de actividad, recomendaciones, notificaciones, votación y métricas.

### Base URL
```text
http://localhost:3000/api
```

### Healthcheck
```text
GET http://localhost:3000/health
```

### Formato de datos
```text
application/json
```

### Autenticación
```text
Bearer Token JWT
```

Header para endpoints protegidos:
```http
Authorization: Bearer <token>
```

---

## 2. Autenticación (`/api/auth`)

### POST /auth/register
Registra usuario y devuelve tokens.

**Body:**
```json
{
  "email": "usuario@correo.com",
  "username": "usuario123",
  "password": "Password123!"
}
```

**Response real (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "<jwt_token>",
  "refreshToken": "<jwt_refresh_token>"
}
```

### POST /auth/login
Inicia sesión y devuelve tokens.

**Body:**
```json
{
  "email": "usuario@correo.com",
  "password": "Password123!"
}
```

**Response real (200):**
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "<jwt_token>",
  "refreshToken": "<jwt_refresh_token>"
}
```

### POST /auth/refresh-token
Renueva access token usando refresh token.

**Body:**
```json
{
  "refreshToken": "<jwt_refresh_token>"
}
```

**Response real (200):**
```json
{
  "token": "<new_jwt_token>"
}
```

### POST /auth/request-password-reset
Solicita recuperación de contraseña.

**Body:**
```json
{
  "email": "usuario@correo.com"
}
```

**Response real (200):**
```json
{
  "message": "Si el email está registrado, recibirás instrucciones para restablecer tu contraseña"
}
```

### POST /auth/reset-password
Resetea contraseña con token.

**Body:**
```json
{
  "token": "<reset_token>",
  "newPassword": "NuevaPassword123!"
}
```

**Response real (200):**
```json
{
  "message": "Contraseña actualizada correctamente"
}
```

---

## 3. Usuarios (`/api/usuarios`)

### POST /usuarios/check-exists
Valida existencia de username/email (registro).

### GET /usuarios
Obtiene usuarios (protegido).

### GET /usuarios/me
Perfil autenticado.

**Response real (200):** objeto usuario sin `password` ni `refreshToken`.

### PUT /usuarios/me
Actualiza perfil autenticado (`nombre`, `biografia`, `ubicacion`, `genero`, `email`, `username`, `avatar`).

**Response real (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 12,
    "username": "nuevo_username"
  }
}
```

### GET /usuarios/perfil/:userId
Perfil público (auth opcional).

### GET /usuarios/:id
Obtiene usuario por ID (protegido).

### PUT /usuarios/:id
Actualiza usuario por ID (protegido, con validación de ownership).

### DELETE /usuarios/all
Elimina todos los usuarios (protegido).

---

## 4. Libros (`/api/libro`)

### GET /libro
Listado paginado.

**Query real:** `page`, `limit`, `autor`, `autorId`.

**Response real (200):**
```json
{
  "libros": [
    {
      "id": 101,
      "slug": "el-hobbit",
      "titulo": "El Hobbit",
      "autores": ["J.R.R. Tolkien"],
      "imagen": "https://...",
      "averageRating": 0
    }
  ],
  "total": 1,
  "totalPages": 1,
  "currentPage": 1,
  "hasNextPage": false,
  "hasPrevPage": false
}
```

### GET /libro/search
Búsqueda (`q` o `query`).

### GET /libro/nuevos
Nuevos lanzamientos (`limit` opcional).

### POST /libro/ensure-exists/:externalId
Crea/asegura libro externo (usado por rating rápido/frontend).

### GET /libro/slug/:slug
Detalle por slug o `externalId`.

### GET /libro/categoria/:categoriaId
Libros por categoría.

### GET /libro/estrellas
Libros con mínimo de estrellas (`minEstrellas` entre 1 y 5).

### GET /libro/:externalId/listas
Listas del usuario que contienen un libro externo (protegido).

### GET /libro/:id/reviews
Reseñas por libro.

### GET /libro/:id
Libro por ID interno.

### POST /libro
Crea libro.

### PUT /libro/:id
Actualiza libro.

### DELETE /libro/:id
Elimina libro.

---

## 5. Reseñas (`/api/resena`)

### GET /resena
Listado de reseñas.

**Query real:** `libroId`, `usuarioId`, `estado`, `page`.

**Nota importante:**
- Caso general devuelve objeto paginado `{ reviews, total, page, pages }`.
- Con `estado=pending` (moderación), devuelve **array** serializado para panel admin.

### GET /resena/populares
Reseñas populares (opcional auth).

### GET /resena/:id
Detalle de reseña.

### POST /resena
Crea reseña (protegido).

**Body real:** requiere `comentario`, `estrellas` y `libro` con al menos `titulo`.

**Response real (201):**
```json
{
  "message": "Reseña creada",
  "resena": {
    "id": 777,
    "estado": "pending"
  }
}
```

### PUT /resena/:id
Actualiza reseña propia.

### DELETE /resena/:id
Elimina reseña propia.

### POST /resena/:id/responder
Crea respuesta a reseña (protegido).

### Moderación (admin)
- `PUT /resena/:id/approve`
- `PUT /resena/:id/reject`
- `GET /resena/admin/rechazadas`
- `GET /resena/admin/moderation/stats`
- `POST /resena/analyze`

**Error especial real (auto-rechazo):**
```json
{
  "error": "Tu reseña contiene contenido inapropiado y no puede ser publicada",
  "details": "Por favor, revisa nuestras normas de comunidad y asegúrate de que tu comentario sea respetuoso y constructivo.",
  "reasons": ["..."],
  "moderationScore": 10,
  "blocked": true
}
```

---

## 6. Favoritos (`/api/favoritos`)

### GET /favoritos/mis-favoritos
Favoritos del usuario autenticado.

### POST /favoritos
Agrega favorito.

**Body real:**
```json
{
  "libroData": {
    "externalId": "google-book-id",
    "source": "google",
    "nombre": "El Hobbit",
    "autores": ["J.R.R. Tolkien"],
    "sinopsis": "...",
    "imagen": "https://...",
    "enlace": "https://..."
  }
}
```

**Response real (201):**
```json
{
  "id": 501
}
```

### DELETE /favoritos/:favoritoId
Elimina favorito.

---

## 7. Listas y contenido (`/api/lista` + `/api/contenido-lista`)

### GET /lista
Listas del usuario autenticado.

### GET /lista/:id
Detalle de lista con filtros/orden.

**Query real:** `orderBy`, `filterAutor`, `filterCategoria`, `filterRating`, `search`.

### POST /lista
Crea lista.

**Body:**
```json
{
  "nombre": "Mis favoritos de fantasía",
  "tipo": "custom"
}
```

Tipos usados: `read`, `to_read`, `pending`, `custom`.

### PUT /lista/:id
Actualiza lista.

### PUT /lista/:id/reordenar
Reordenamiento drag&drop.

**Body:**
```json
{
  "ordenamiento": [
    { "libroId": 101, "orden": 0 },
    { "libroId": 85, "orden": 1 }
  ]
}
```

### DELETE /lista/:id
Elimina lista.

### GET /contenido-lista/:listaId
Contenido de una lista (protegido + ownership).

### GET /contenido-lista/user/all
Contenido total del usuario autenticado.

### POST /contenido-lista
Agrega libro a lista (protegido + ownership).

**Body real:**
```json
{
  "listaId": 31,
  "libro": {
    "id": "google-book-id",
    "titulo": "El Hobbit",
    "autores": ["J.R.R. Tolkien"],
    "descripcion": "...",
    "imagen": "https://...",
    "enlace": "https://...",
    "source": "google"
  }
}
```

### DELETE /contenido-lista/:listaId/:libroId
Elimina libro de lista (usa `externalId` como `:libroId`).

---

## 8. Funcionalidades sociales y personalización

## 8.1 Seguimientos (`/api/seguimientos`)
- `POST /follow` (body: `{ "seguidoId": number }`)
- `DELETE /unfollow/:seguidoId`
- `GET /seguidores/:usuarioId`
- `GET /seguidos`
- `GET /counts/:userId`
- `GET /verificar/:usuarioId`
- `GET /is-following/:seguidoId`

## 8.2 Feed (`/api/feed`)
- `GET /` (protegido) con `limit`, `offset`, `tipos`, `_t`
- `DELETE /cache` (protegido)

**Response real feed:**
```json
{
  "actividades": [],
  "total": 0,
  "limit": 20,
  "offset": 0,
  "hasMore": false
}
```

## 8.3 Recomendaciones (`/api/recomendaciones`)
- `GET /` (protegido, query `limit`)
- `DELETE /cache` (protegido)

**Response real recomendaciones:**
```json
{
  "libros": [],
  "metadata": {
    "algoritmo": "...",
    "totalRecomendaciones": 0,
    "usuarioId": 12
  }
}
```

## 8.4 Reacciones (`/api/reaccion`)
- `GET /resena/:resenaId`
- `POST /` (protegido, body `{ "resenaId": number, "tipo": "like|dislike|corazon" }`)
- `DELETE /:usuarioId/:resenaId` (protegido)

## 8.5 Notificaciones (`/api/notificaciones`)
- `GET /` (query `limit`, protegido)
- `GET /count` (protegido)
- `PATCH /:id/leida` (protegido)
- `PATCH /marcar-todas-leidas` (protegido)
- `DELETE /:id` (protegido)

**Responses reales:**
```json
{ "notificaciones": [] }
```
```json
{ "count": 0 }
```

---

## 9. Votación, rating y métricas

## 9.1 Votación de libros (`/api/votacion`)
- `POST /` (protegido, body `{ "libroId": number, "voto": "positivo|negativo" }`)
- `DELETE /:libroId` (protegido)
- `GET /usuario/:libroId` (protegido)
- `GET /estadisticas/:libroId`
- `GET /top?limit=10`

## 9.2 Rating agregado (`/api/rating-libro`)
- `GET /`
- `GET /:id`
- `GET /libro/:libroId`
- `POST /` (body `{ "libroId": number|string, "avgRating": number, "cantidadResenas": number }`)
- `DELETE /:id`
- `DELETE /libro/:libroId`

## 9.3 Stats de plataforma (`/api/stats`)
- `GET /` (hero stats)
- `GET /detailed` (stats extendidas)

**Response real `/stats`:**
```json
{
  "librosCreados": 0,
  "reseniasTotales": 0,
  "lectoresActivos": 0,
  "librosFavoritos": 0
}
```

---

## 10. Integraciones externas y catálogo auxiliar

## 10.1 Google Books (`/api/google-books`)
- `GET /buscar?q=...&startIndex=0&maxResults=40`
- `GET /:id`
- `POST /add` (protegido + admin)

## 10.2 Hardcover (`/api/hardcover`)
- `GET /trending`
- `GET /libro/:slug`

## 10.3 External Authors (`/api/external-authors`)
- `GET /search-author`
- `GET /author/:id`

## 10.4 CRUD catálogo/admin usado en frontend

### Autores (`/api/autor`)
- `GET /`
- `GET /search`
- `GET /:id/stats`
- `GET /:id`
- `POST /`
- `POST /external/save`
- `PUT /:id`
- `DELETE /:id`
- `DELETE /cache/clear`

### Categorías (`/api/categoria`)
- `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

### Editoriales (`/api/editorial`)
- `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

### Sagas (`/api/saga`)
- `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` (create/update/delete con admin)

### Permisos (`/api/permisos`)
- `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

### Actividades (`/api/actividades`)
- `GET /`, `GET /:id`, `GET /usuario/:usuarioId`, `POST /`, `DELETE /:id`

### Newsletter (`/api/newsletter`)
- `POST /subscribe`
- `POST /unsubscribe`
- `GET /subscriptions` (protegido)

### Protected (`/api/protected`)
- `GET /` (test de ruta protegida)

---

## 11. Estructura de respuestas (estado real)

No existe un único envelope global en todo el backend.

Formatos reales detectados:

1) Objeto directo:
```json
{
  "id": 101,
  "nombre": "El Hobbit"
}
```

2) Array directo:
```json
[
  { "id": 1 },
  { "id": 2 }
]
```

3) Mensaje + entidad:
```json
{
  "message": "Reseña creada",
  "resena": { "id": 777 }
}
```

4) Paginado:
```json
{
  "reviews": [],
  "total": 0,
  "page": 1,
  "pages": 1
}
```

5) Error simple:
```json
{
  "error": "Mensaje de error"
}
```

6) Error de validación:
```json
{
  "errors": ["Error 1", "Error 2"]
}
```

---

## 12. Códigos HTTP (uso real)

| Código | Uso en el proyecto |
|---|---|
| 200 | Lectura/actualización/eliminación exitosa, y algunos create idempotentes |
| 201 | Creación de recurso (`register`, `resena`, `favorito`, etc.) |
| 202 | Carga en progreso (hardcover trending) |
| 400 | Validación de request, parámetros faltantes, reglas de negocio |
| 401 | No autenticado / token inválido |
| 403 | Sin permisos (ownership o admin) |
| 404 | Recurso no encontrado |
| 409 | Conflicto (ej. favorito duplicado) |
| 500 | Error interno |

---

## 13. Manejo de errores

Formato más frecuente en backend:
```json
{
  "error": "Error message"
}
```

Ejemplo real JWT inválido:
```json
{
  "error": "Invalid or expired token"
}
```

Ejemplo real validación de reseñas:
```json
{
  "errors": [
    "El comentario es obligatorio",
    "Las estrellas deben estar entre 1 y 5"
  ]
}
```

Ejemplo real auto-moderación bloqueante:
```json
{
  "error": "Tu reseña contiene contenido inapropiado y no puede ser publicada",
  "details": "Por favor, revisa nuestras normas de comunidad y asegúrate de que tu comentario sea respetuoso y constructivo.",
  "reasons": ["toxicidad", "profanidad"],
  "moderationScore": 10,
  "blocked": true
}
```

---

## 14. Cobertura auditada (backend + frontend)

Esta documentación fue auditada cruzando:
- **Rutas montadas** en `Backend/src/app.ts`.
- **Definición de endpoints** en `Backend/src/routes/*.ts`.
- **Contratos de respuesta** en controladores principales.
- **Consumo real** desde `Frontend/src/services/*`.

