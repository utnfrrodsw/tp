# Propuesta TP DSW 2024 - COM 305 - Money Manager

## Grupo

### Integrantes

- 43187 - Tisocco, Lucas
- 42780 - Martinez, Santiago

### Repositorios

- [frontend app](https://github.com/santi-m123/MoneyManager-Frontend.git)
- [backend app](https://github.com/lucastisocco/MoneyManager-Backend.git)

## Tema

### Descripción

_Una aplicación para logueo de expensas y administración de finanzas personales_

### Modelo

![imagen del modelo](https://github.com/lucastisocco/tp/blob/main/TP_DSW_Tisocco_Martinez.jpg)

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Método Pago<br>2. CRUD Categoría|
|CRUD dependiente|1. CRUD Transacción {depende de} CRUD Categoría y Metodo Pago|
|Listado<br>+<br>detalle| 1. Listado de transacciones filtrado por categoría, muestra desc y monto de transacción => detalle CRUD Transacción|
|CUU/Epic|1. Generar informe con graficos de gastos por categoria, moneda, etc.|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Método Pago<br>2. CRUD Categoría<br>3. CRUD Transacción<br>4. CRUD Monedas<br>5. CRUD Tasa de Cambio|
|CUU/Epic|1. Generar informe con graficos de gastos por categoria, moneda, etc.<br>2. Mostrar graficos de la evolucion de cambio de una moneda respecto a otra.|


### Alcance Adicional Voluntario

| Req      | Detalle                                |
| :------- | :------------------------------------- |
| Listados | 1. Historial de intercambio de divisas |
| CUU/Epic | 1. Agregar gasto regular (automático)  |
| Otros    | 1. Envío de resumen semanal por email  |
