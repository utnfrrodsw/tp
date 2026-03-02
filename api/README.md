# Documentación de la API del Supermercado

## Documentación

## Principios de Diseño


| Principio                 | Descripción                                                                                                                                            |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquitectura RESTful**  | Métodos HTTP estándar (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) para interactuar con los recursos                                                      |
| **Formato JSON**          | Todas las respuestas en formato `application/json` con estructura consistente                                                                           |
| **Autenticación JWT**     | Rutas protegidas mediante JSON Web Token en el header `Authorization`                                                                                   |

---

## Recursos Principales

La API proporciona operaciones CRUD para gestionar las siguientes entidades:

- **Autenticación** - Registro, login, tokens y recuperación de contraseña
- **Clientes** - Perfiles de compradores y administradores
- **Productos** - Gestión completa de productos y su respectivo stock
- **Categorias** - Tipos de productos disponibles
- **Distribuidores** - Registros de los cadetes quien realizaran la entrega y la zona.
- **Ventas** - Ventas y seguimientos de la misma
- **Zonas** - Registro de las zonas en las cuales trabajan los distribuidores y en las cuales viven los clientes
- **Item-venta** - Permite Agrupar los items y la cantidad de unidades sokicitadas de los mismos

---

## Índice de Documentación

| Documento                                    | Descripción                                                                     |
| :------------------------------------------- | :------------------------------------------------------------------------------ |
| **[Endpoints](./endPoints.md)**              | Lista completa de endpoints organizados por módulos                             |
| **[Formato de Respuesta](./formatoRespuesta.md)** | Estructura de respuestas JSON para operaciones exitosas y errores          |
| **[Seguridad](./seguridad.md)**              | Autenticación JWT, protección de rutas y validación                             |

---
