# Seguridad de la API

## Autenticación con JWT

Implementamos un sistema de autenticación basado en **JSON Web Tokens (JWT)**. Cuando un usuario inicia sesión correctamente, el servidor genera un token firmado que contiene:

- Información del Cliente (ID, email, rol)
- Fecha de expiración
- Firma criptográfica para validar integridad

### Uso del Token

Este token debe incluirse en el header `Authorization` de todas las peticiones a rutas protegidas:

```
Authorization: Bearer <token>
```

### Tipos de Tokens

| Token          | Duración | Uso                                                           |
| :------------- | :------- | :------------------------------------------------------------ |
| Access Token   | 15 min   | Autenticación de peticiones a la API                          |
| Refresh Token  | 7 días   | Renovación del Access Token sin requerir login nuevamente     |

---

## Protección de Endpoints

El acceso a los endpoints está controlado mediante middleware que:

1. **Verifica la presencia del JWT** en el header Authorization
2. **Valida la firma y vigencia** del token
3. **Comprueba los permisos** según el rol del usuario

### Niveles de Protección

- **Público**: Accesible sin autenticación
- **Autenticado**: Requiere token válido
- **Rol Específico**: Requiere token con rol particular:
  - **Administrador**: Crear/modificar productos y categorias

### Respuestas de Error

| Código | Escenario                              | Mensaje                                         |
| :----- | :------------------------------------- | :---------------------------------------------- |
| 401    | Token no proporcionado                 | "No token provided"                             |
| 401    | Token inválido o expirado              | "Invalid or expired token"                      |
| 403    | Token válido pero sin permisos         | "You don't have permission to access this resource" |

---

## Validación de Datos

Toda la información que llega al backend pasa por un proceso de validación riguroso:

### 1. Validación de Autorización

Se confirma que el JWT es válido y otorga acceso al endpoint solicitado.

### 2. Validación de Esquema

Se verifica que el cuerpo (`body`), parámetros (`params`) y consultas (`query`) cumplan con:

- **Tipos de datos correctos**: strings, números, booleanos, etc.
- **Formatos esperados**: emails, URLs, fechas, IDs de MongoDB
- **Campos requeridos**: presencia de datos obligatorios


## Seguridad Adicional

### Variables de Entorno

Las credenciales sensibles (secretos JWT, claves de API, strings de conexión) se almacenan en variables de entorno, nunca en el código.

### CORS

Se configuran políticas de CORS (Cross-Origin Resource Sharing) para permitir solo orígenes autorizados.
