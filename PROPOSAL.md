# Propuesta TP DSW

## Grupo
### Integrantes
* 54461 - Collado, Franco
* 54315 - Massagli, Franco
* 54283 - Aleart, Tomas

### Repositorios
* [Monorepo PlanIt](https://github.com/FrancoCollado/PlanIt)
* [frontend app](https://github.com/FrancoCollado/PlanIt/tree/main/apps/web)
* [backend app](https://github.com/FrancoCollado/PlanIt/tree/main/apps/api)

## Tema
### Descripción
Una aplicación estilo “marketplace” para bienes y servicios relacionados a eventos, donde las personas puedan acceder en un solo lugar a diferentes propuestas por parte de los negocios. Nuestra intención es que la persona pueda organizar el evento en su totalidad a través de la app, es una especie de vidriera virtual.

### Modelo
<!-- TODO: agregar el diagrama del modelo de datos (por ejemplo en docs/modelo.png) -->


## Alcance Funcional

### Alcance Mínimo

Regularidad:
| Req | Detalle |
| :--- | :--- |
| **CRUD simple** | 1. CRUD Eventos<br>2. CRUD Usuarios<br>3. CRUD Categoría |
| **CRUD dependiente** | 1. CRUD de Servicios {depende de} Categoría<br>2. CRUD de Tablero {depende de} Cliente |
| **Listado + detalle** | 1. Listado de servicios filtrado por categoría => detalle incluido en cada card<br>2. Listado de servicios filtrado por evento => detalle incluido en cada card |
| **CUU/Epic** | 1. Suspensión de la empresa por parte del administrador<br>2. Publicación de un nuevo servicio con fotos y precios<br>3. Guardado de servicio dentro del tablero |

Adicionales para Aprobación
| Req | Detalle |
| :--- | :--- |
| **CRUD** | 1. CRUD Eventos<br>2. CRUD Usuarios<br>3. CRUD Categoría<br>4. CRUD Servicios<br>5. CRUD Tablero |
| **CUU/Epic** | 1. Suspensión de la empresa por parte del administrador<br>2. Publicación de un nuevo servicio con fotos y precios<br>3. Guardado de servicio dentro del tablero |


### Alcance Adicional Voluntario

| Req | Detalle |
| :--- | :--- |
| **Listados** | 1. Filtrar servicio por atributo zona<br>2. Filtrar servicio por empresa (por nombre, ej. filtrar los servicios de “Marta Cura”) |
| **Otros** | 1. Identificacion y manejo de servicios excedidos en cuenta de empresa<br>2. Integracion de mercado pago para contratacion de cuenta pro<br>3. Suspension de cuenta de cliente por parte del administrador |
