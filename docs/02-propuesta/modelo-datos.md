# Modelo de datos vigente

Fuente: [`server/prisma/schema.prisma`](../../server/prisma/schema.prisma). La base de datos es MySQL y Prisma es el ORM. Los identificadores se almacenan como `CHAR(36)` y la validación de entrada exige UUID v7; las capas de persistencia los generan al crear registros. Los importes se guardan como `Decimal`, no como `Float`.

## Diagrama

```mermaid
erDiagram
    User ||--o{ Order : asigna
    User ||--o{ Status_History : registra
    Client_Type ||--o{ Client : clasifica
    Client ||--o{ Equipment : posee
    Equipment ||--o{ Order : recibe
    Order ||--o{ Failure : registra
    Failure_Type ||--o{ Failure : categoriza
    Order ||--o| Budget : presupuestada
    Budget ||--o{ AddedCost : incluye
    Budget ||--o{ Payment : recibe
    Payment_Type ||--o{ Payment : clasifica
    Order ||--o{ Status_History : historial

    User {
        string id_user PK
        string userName UK
        string email UK
        string password_hash
        EnumRol rol
        boolean status
        boolean validationStatus
        string urlPicture
    }
    Client {
        string id_client PK
        string clientName
        string clientEmail UK
        string clientPhone
        string cuit UK
        datetime dateOfRegistration
        boolean status
        string id_client_type FK
    }
    Client_Type {
        string id_client_type PK
        string clientTypeName UK
        int amountForCategoryUp
    }
    Equipment {
        string id_equipment PK
        EnumEquipmentType tipo_equipment
        string brand
        string model
        string observations "nullable"
        string id_client FK
    }
    Order {
        string id_order PK
        int nroOrder UK
        string id_equipment FK
        string id_user "FK, nullable"
        EnumOrderStatus status
        string observations "nullable"
        string equipmentPhotoUrl "nullable"
        datetime dateOfEntry
        datetime estimatedDate "nullable"
        datetime deliveryDate "nullable"
        decimal totalCharged "nullable"
        boolean active
    }
    Failure_Type {
        string id_failure_type PK
        string failureDescription UK
        decimal estimatedImport
    }
    Failure {
        string id_failure PK
        string id_failure_type FK
        string id_order FK
        string description
        datetime dateOfFailure
        EnumFailureStatus status
    }
    Status_History {
        string id_status_history PK
        string id_order FK
        string id_user FK
        EnumOrderStatus status
        datetime dateOfChange
        string comment "nullable"
    }
    Budget {
        string id_budget PK
        int nroBudget UK
        string id_order "FK, UK"
        decimal laborCost
        decimal discount
        EnumBudgetStatus status
        datetime budgetDate
        string clientSuggestion "nullable"
    }
    AddedCost {
        string id_addedCost PK
        string id_budget FK
        EnumTypeAddedCost type_addedCost
        string addedCostDescription
        decimal addedCostAmount
    }
    Payment_Type {
        string id_payment_type PK
        string paymentTypeName UK
        EnumPaymentMethod paymentMethod
        EnumPaymentType type_of_payment
        decimal percentage
    }
    Payment {
        string id_payment PK
        string id_payment_type FK
        string id_budget FK
        datetime dateOfPayment
        decimal amount
    }
```

## Enumeraciones

- `EnumRol`: `admin`, `tecnico`.
- `EnumEquipmentType`: `celular`, `computadora`, `tablet`, `consola`, `notebook`, `impresora`, `televisor`, `otro`.
- `EnumOrderStatus`: `recibido`, `diagnostico`, `presupuestado`, `aprobado`, `reparacion`, `listo`, `entregado`, `cancelado`.
- `EnumBudgetStatus`: `pendiente`, `aprobado`, `rechazado`.
- `EnumPaymentMethod`: `DEBITO`, `MP`, `EFECTIVO`, `CREDITO`.
- `EnumPaymentType`: `Descuento`, `Recargo`.
- `EnumFailureStatus`: `resuelta`, `diagnosticada`.
- `EnumTypeAddedCost`: `repuesto`, `procedimientoEspecial`, `garantia`, `reparacionExpress`, `limpiezaPuestaAPunto`, `serviciosSoftware`.

## Entidades y reglas destacadas

- **User**: `userName` y `email` son únicos. `status` y `validationStatus` comienzan en `false`; la imagen tiene una URL por defecto. La contraseña se persiste como hash.
- **Client**: `clientEmail` y `cuit` son únicos. `cuit` se valida como CUIT de 11 dígitos. Cada cliente pertenece a un `Client_Type`; el estado inicia activo y `dateOfRegistration` se asigna al crear.
- **Client_Type**: `clientTypeName` es único; `amountForCategoryUp` es el umbral entero de categoría.
- **Equipment**: pertenece a un cliente. `tipo_equipment` usa `EnumEquipmentType`; `observations` es opcional.
- **Order**: se relaciona con un equipo y opcionalmente con un usuario. `nroOrder` es único; el estado inicial es `recibido`. Las fechas de estimación/entrega, la foto, las observaciones y el total cobrado son opcionales.
- **Failure**: pertenece a una orden y a un `Failure_Type`; el estado inicial es `diagnosticada`. En el modelo vigente la falla ya no se relaciona directamente con el equipo.
- **Status_History**: registra el estado alcanzado, la orden, el usuario y la fecha del cambio. No contiene campos `previousStatus` ni `newStatus`.
- **Budget**: tiene una relación uno a uno con la orden (`id_order` único). `nroBudget` es único, `discount` inicia en cero y el estado en `pendiente`. El total estimado se calcula en la lógica de negocio y no es una columna del modelo.
- **AddedCost**: representa costos detallados de un presupuesto; cada uno tiene tipo, descripción e importe decimal.
- **Payment_Type**: define método, tipo (descuento/recargo) y `percentage` (el nombre actual reemplaza al antiguo `percentaje`).
- **Payment**: relaciona un importe con un presupuesto y un tipo de pago; la fecha se asigna automáticamente.

## Tipos y valores por defecto relevantes

- Los campos `id_*` son `String @db.Char(36)` y las rutas validan sus valores como UUID v7.
- Los importes monetarios (`estimatedImport`, `totalCharged`, `laborCost`, `discount`, `addedCostAmount`, `percentage`, `amount`) usan `Decimal` con precisión definida en el schema.
- Los valores automáticos incluyen estados iniciales, fecha de alta/registro y valores de descuento/imagen indicados en cada modelo.
- Los nombres de tablas se mapean a los definidos mediante `@@map`; `AddedCost` y `Payment` conservan los nombres de modelo indicados por Prisma.
