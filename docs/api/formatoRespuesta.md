> **[Portal de Documentación](../README.md)** / **[API](./README.md)** / Formato de Respuesta

# Formato de Respuesta de la API

Todas las respuestas de la API siguen un formato JSON consistente para facilitar su integración y manejo de errores. La estructura se divide en dos tipos: **respuestas exitosas** y **respuestas de error**.

---

## Respuestas Exitosas (Códigos 2xx)

Cuando una solicitud se procesa correctamente (códigos `200 OK`, `201 Created`, etc.), la respuesta contiene un objeto JSON con dos propiedades: `message` y `data`.

### Estructura

```json
{
  "message": "Descripción de la operación realizada",
  "data": { ... }
}
```

### Propiedades

| Propiedad | Tipo                      | Descripción                                                                                          |
| :-------- | :------------------------ | :--------------------------------------------------------------------------------------------------- |
| `message` | `string`                  | Mensaje legible que confirma la operación exitosa                                                    |
| `data`    | `object \| array \| null` | Contenido solicitado. Objeto para un recurso, array para listas, null para operaciones sin retorno  |

### Ejemplos

**Obtener un recurso único:**

```json
{
  "message": "Course retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Fundamentos de JavaScript",
    "description": "Aprende JavaScript desde cero",
    "isFree": true,
    "enrollmentCount": 150
  }
}
```

**Obtener una lista con paginación:**

```json
{
  "message": "Courses retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Fundamentos de JavaScript"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "React Avanzado"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

> **Nota:** Las listas incluyen un objeto `meta` con información de paginación.

**Crear un recurso:**

```json
{
  "message": "Course created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "TypeScript Esencial",
    "createdAt": "2025-12-22T10:30:00.000Z"
  }
}
```

**Eliminar un recurso:**

```json
{
  "message": "Course deleted successfully",
  "data": null
}
```

---

## Respuestas de Error (Códigos 4xx y 5xx)

Cuando una solicitud falla, la respuesta contiene únicamente la propiedad `message`. La propiedad `data` **no está presente**.

### Estructura

```json
{
  "message": "Descripción específica del error"
}
```

### Ejemplos por Código de Estado

**400 - Bad Request (Datos Inválidos)**

```json
{
  "message": "Validation failed: name is required"
}
```

**401 - Unauthorized (No Autenticado)**

```json
{
  "message": "Invalid or expired token"
}
```

**403 - Forbidden (Sin Permisos)**

```json
{
  "message": "Only professors can create courses"
}
```

**404 - Not Found**

```json
{
  "message": "Course not found"
}
```

**409 - Conflict**

```json
{
  "message": "User already enrolled in this course"
}
```

**500 - Internal Server Error**

```json
{
  "message": "An unexpected error occurred. Please try again later."
}
```

---

## Códigos de Estado HTTP

| Código | Significado           | Uso                                                            |
| :----- | :-------------------- | :------------------------------------------------------------- |
| `200`  | OK                    | Operación GET, PUT o PATCH exitosa                             |
| `201`  | Created               | Recurso creado exitosamente (POST)                             |
| `204`  | No Content            | Operación exitosa sin contenido de retorno                     |
| `400`  | Bad Request           | Datos de entrada inválidos                                     |
| `401`  | Unauthorized          | Token faltante, inválido o expirado                            |
| `403`  | Forbidden             | Usuario sin permisos suficientes                               |
| `404`  | Not Found             | Recurso no existe                                              |
| `409`  | Conflict              | Conflicto de estado (ej: registro duplicado)                   |
| `422`  | Unprocessable Entity  | Validación de datos falló                                      |
| `500`  | Internal Server Error | Error inesperado del servidor                                  |

---

## Buenas Prácticas

### Manejo en el Cliente

1. Verifica el código de estado HTTP antes de procesar la respuesta
2. Para respuestas exitosas (2xx), accede a `data` para obtener el contenido
3. Para errores (4xx/5xx), muestra o loguea el `message`
