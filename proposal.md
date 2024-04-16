# Propuesta TP DSW 2024 - COM 305 - Money Manager

## Grupo

### Integrantes

- 43187 - Tisocco, Lucas
- 42780 - Martinez, Santiago

### Repositorios

- [frontend app](http://hyperlinkToGihubOrGitlab)
- [backend app](http://hyperlinkToGihubOrGitlab)

## Tema

### Descripción

_Una aplicación para logueo de expensas y administración de finanzas personales_

### Modelo

![imagen del modelo](https://drive.google.com/file/d/1y-bcqGD1OsLHkULzMul8POQGeQC0jbD2/view)

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Método Pago<br>2. CRUD Categoría|
|CRUD dependiente|1. CRUD Transacción {depende de} CRUD Categoría y Metodo Pago|
|Listado<br>+<br>detalle| 1. Listado de transacciones filtrado por categoría, muestra desc y monto de transacción => detalle CRUD Transacción|
|CUU/Epic|1. Registrar una Transacción|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Método Pago<br>2. CRUD Categoría<br>3. CRUD Transacción<br>4. CRUD Monedas<br>5. CRUD Tasa de Cambio|
|CUU/Epic|1. Registrar una Transacción<br>2. Registrar un Intercambio de divisas|

### Alcance Adicional Voluntario

| Req      | Detalle                                |
| :------- | :------------------------------------- |
| Listados | 1. Historial de intercambio de divisas |
| CUU/Epic | 1. Agregar gasto regular (automático)  |
| Otros    | 1. Envío de resumen semanal por email  |
