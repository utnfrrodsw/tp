# 📋 API Documentation - Tienda Retro

## 🔗 Base URL
```
http://localhost:3001/api
```

## 🏥 Health Check
### GET /health
Verifica que la API esté funcionando.

**Respuesta:**
```json
{
  "success": true,
  "message": "API Tienda Retro funcionando",
  "version": "1.0.0",
  "timestamp": "2025-09-04T21:30:00.000Z",
  "endpoints": [...]
}
```

---

## 👥 Usuarios

### GET /usuarios
Obtiene todos los usuarios activos.

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "count": 5,
  "message": "Usuarios obtenidos correctamente"
}
```

### GET /usuarios/:id
Obtiene un usuario específico.

### POST /usuarios
Crea un nuevo usuario.

**Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez", 
  "email": "juan@email.com",
  "contrasena": "123456",
  "direccion": "Calle 123",
  "telefono": "1234567890",
  "rol": "usuario"
}
```

### PUT /usuarios/:id
Actualiza un usuario existente.

### DELETE /usuarios/:id
Elimina un usuario (soft delete).

---

## 🏷️ Categorías

### GET /categorias
Obtiene todas las categorías activas.

### GET /categorias/:id
Obtiene una categoría específica.

### POST /categorias
Crea una nueva categoría.

**Body:**
```json
{
  "nombre": "Clubes Argentinos",
  "descripcion": "Camisetas de clubes de fútbol argentino"
}
```

### PUT /categorias/:id
Actualiza una categoría existente.

### DELETE /categorias/:id
Elimina una categoría (soft delete).

---

## 👕 Camisetas

### GET /camisetas
Obtiene todas las camisetas con filtros opcionales.

**Query Parameters:**
- `equipo`: Filtra por equipo (ej: `?equipo=Boca`)
- `temporada`: Filtra por temporada (ej: `?temporada=2022`)
- `talle`: Filtra por talle (ej: `?talle=M`)
- `condicion`: Filtra por condición (ej: `?condicion=Nueva`)

**Ejemplo:**
```
GET /camisetas?equipo=Argentina&talle=L
```

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "count": 3,
  "debug": {
    "filtrosRecibidos": {"equipo": "Argentina", "talle": "L"},
    "filtrosAplicados": {...}
  },
  "message": "Camisetas obtenidas correctamente"
}
```

### GET /camisetas/:id
Obtiene una camiseta específica con datos de categoría y vendedor.

### POST /camisetas
Crea una nueva camiseta (CRUD básico).

### PUT /camisetas/:id
Actualiza una camiseta existente.

### DELETE /camisetas/:id
Elimina una camiseta (soft delete).

### 🚀 POST /camisetas/publicar
**CASO DE USO:** Publica una camiseta para venta (precio fijo o subasta).

**Body:**
```json
{
  "titulo": "Camiseta Argentina Mundial 2022",
  "descripcion": "Camiseta oficial utilizada en Qatar 2022",
  "equipo": "Argentina",
  "temporada": "2022",
  "talle": "L",
  "condicion": "Nueva",
  "imagen": "https://...",
  "precioInicial": 15000.00,
  "esSubasta": false,
  "stock": 1,
  "categoriaId": 2,
  "vendedorId": 1,
  "fechaFinSubasta": "2025-12-31T23:59:59Z"
}
```

**Campos requeridos:**
- `titulo`, `equipo`, `temporada`, `talle`, `condicion`, `precioInicial`, `vendedorId`

**Validaciones:**
- `precioInicial` > 0
- `stock` >= 1
- `talle`: XS, S, M, L, XL, XXL
- `condicion`: Nueva, Usada, Vintage
- Si `esSubasta` = true y se envía `fechaFinSubasta`, debe ser fecha futura

**Respuesta:**
```json
{
  "success": true,
  "data": {...},
  "message": "Camiseta publicada para venta directa correctamente",
  "caso_uso": "publicar_camiseta_para_venta",
  "detalles": {
    "tipo_venta": "precio_fijo",
    "precio_inicial": 15000.00,
    "stock": 1,
    "estado": "disponible"
  }
}
```

---

## 🧪 Testing Endpoints

### Secuencia de prueba recomendada:

1. **Health Check:** `GET /health`
2. **Ver categorías:** `GET /categorias`
3. **Crear categoría:** `POST /categorias`
4. **Ver usuarios:** `GET /usuarios`
5. **Crear usuario:** `POST /usuarios`
6. **Ver camisetas:** `GET /camisetas`
7. **Filtrar camisetas:** `GET /camisetas?equipo=Boca`
8. **Publicar camiseta:** `POST /camisetas/publicar`
9. **Ver detalle:** `GET /camisetas/1`

### Herramientas recomendadas:
- **Postman** (completo)
- **Thunder Client** (VS Code extension)
- **Navegador web** (solo GET)
- **curl/PowerShell** (línea de comandos)

---

## ❌ Códigos de Error

- `200`: OK
- `201`: Created
- `400`: Bad Request (validación)
- `404`: Not Found
- `500`: Internal Server Error

## 📝 Notas

- Todos los endpoints devuelven JSON
- Las fechas están en formato ISO 8601
- Los IDs son números enteros
- Los soft deletes marcan registros como inactivos en lugar de eliminarlos
