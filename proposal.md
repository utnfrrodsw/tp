# Propuesta TP DSW

## Grupo
### Integrantes
* 44987 - Cabanellas, Ignacio
* 45091 - Cordoba, Lucas
* 45090 - Nicola, Francisco

### Repositorios
* [fullstack app] (https://github.com/IgnacioCabanellas/trading-platform)

## Tema
### Descripción

El sistema propuesto consiste en una plataforma web destinada al manejo de operaciones de compra y venta de activos financieros, simulando el funcionamiento de un order book. El usuario final podrá colocar órdenes de compraventa y ver el historial de sus operaciones a traves de los distintos activos que se ofrecen.

### Modelo
```mermaid
erDiagram

  user {
    UUID id PK
    string email
    string password
    Role role
    UUID limit_id FK
    boolean enabled
    Date created_at
    Date updated_at
  }

  order {
    UUID id PK
    UUID user_id FK
    OrderType type
    UUID trading_pair_id FK
    float quote_price
    float base_quantity
    float base_available
    OrderStatus status
    boolean enabled
    UUID created_by FK
    Date created_at
    Date updated_at
  }

  order_match {
    UUID buy_order FK
    UUID sell_order FK
    float base_amount
    Date created_at
  }

  movement {
    UUID id PK
    float amount
    UUID wallet_id FK
    Date created_at
  }

  asset {
    UUID id PK
    string symbol
    string name
    string description
    boolean enabled
    UUID created_by FK
    Date created_at
    Date updated_at
  }

  traiding_pair {
    UUID id PK
    UUID base_asset_id FK
    UUID quote_asset_id FK
    UUID created_by FK
    boolean enabled
    Date created_at
    Date updated_at
  }

  wallet {
    UUID id PK
    UUID user_id FK
    UUID asset_id FK
    float amount
    boolean enabled
    UUID created_by FK
    Date created_at
    Date updated_at
  }

  limit {
    UUID id PK
    string name
    float max_amount
    int max_daily_orders
    boolean enabled
    UUID created_by FK
    Date created_at
    Date updated_at
  }

  %% Relaciones
  user ||--o{ order : places
  user ||--o{ wallet : holds
  user ||--o{ limit : has
  order }o--|| traiding_pair : uses
  traiding_pair }o--|| asset : base_asset
  traiding_pair }o--|| asset : quote_asset
  asset }o--|| user : created_by
  traiding_pair }o--|| user : created_by
  wallet }o--|| asset : asset
  wallet }o--|| user : created_by
  limit }o--|| user : created_by
  wallet }o--|| movement : has
  order_match }o--|| order : sell
  order_match }o--|| order : buy
  order_match ||--|| movement : generates
```

## Alcance Funcional 

### Alcance Mínimo

#### Regularidad
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Activos<br>2. CRUD Límites<br>3.|
|CRUD dependiente|1. CRUD Usuarios<br>2. CRUD Traiding Pairs<br>|
|Listado<br>+ detalle|1. Listado de ordenes vigentes de una paridad<br>→ Muestra tipo, precio, cantidad<br>→ Detalla muestra la orden completa y su activo asociado <br>2. Listado de activos<br>→ Filtrable parcial por nombre<br>→ Muestra nombre y símbolo<br>→ Detalla nombre, descripción, fecha de alta|
|CUU/Epic|1. Ingresar activos a la cuenta <br> 2. Colocar una orden de compra o venta|


#### Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CUU/Epic|1. Cancelar ordenes pendientes|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Historial de movimientos del usuario <br> → Ordenado por fecha filtrable por activo <br> → Muestra ingreso y egreso de activos<br>→ Detalla fecha <br> 2. Listado de saldos por usuario <br> → Muestra activo, saldo disponible y bloqueado <br> → Detalle permite ver historial de movimientos|
|CUU/Epic|1. Generar un reporte donde se detallen las operaciones|
