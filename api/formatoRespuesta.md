# Formato de Respuesta de la API

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
  "message": "Venta retrieved successfully",
  "data": {
    "_id": "1",
    "fecha": "2025-08-31T02:19:14.000Z",
    "total": 55000,
    "distribuidor": 1,
    "cliente": 5
  }
}
```

**Crear un recurso:**

```json
{
  "message": "Venta created successfully",
  "data": {
    "_id": "1",
    "fecha": "2025-08-31T02:19:14.000Z",
    "cliente": "1"
  }
}
```

**Eliminar un recurso:**

```json
{
  "message": "Venta deleted successfully",
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
  "message": "Venta not found"
}
```

**409 - Conflict**

```json
{
  "message": "The client is already registered"
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

