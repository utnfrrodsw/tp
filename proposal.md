# Propuesta TP DSW

## Grupo
### Integrantes
* 51841 - Redaelli, Martín
* 50553 - Riguetto, Fabricio

### Repositorios
* [frontend app](https://github.com/Fabririguetto/Frontend-dsw.git)
* [backend app](https://github.com/Fabririguetto/Backend-dsw.git)

## Tema
### Descripción
El sistema de gestión web para locales de venta de productos en general optimiza operaciones diarias. Desde control de inventario hasta ventas y atención al cliente, ofrece soluciones integrales. Facilita seguimiento de stock, registro de ventas y gestión de clientes. Asigna roles específicos a empleados para una operación eficiente. Mejora productividad y satisface demandas del mercado

### Modelo
[![Mermaid](https://www.mermaidchart.com/raw/141be040-305b-48e5-8d57-aeadefcfd581?theme=dark&version=v0.1&format=svg)

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
| CRUD Simple | CRUD Producto<br>CRUD Empleado |
| CRUD Dependiente | CRUD Ventas {depende de} CRUD producto|
| Listado<br>+<br>Detalle | Listado de productos filtrado por artículo o descripción, mostrando todos sus atributos |
| CUU 1.1 | Cargar Productos |


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |CRUD Producto<br>CRUD Cliente<br>CRUD Ventas<br>CRUD Empleado<br>CRUD Sucursal|
|CUU/Epic|CUU 1.1 Cargar Productos<br>CUU 1.2 Modificar Productos<br>CUU 2.1 Realizar nueva Venta<br>CUU 2.2 Informar detalles de un producto<br>CUU 2.3 Gestionar ABM Cliente<br>CUU 2.4 Ver historial de Ventas<br>CUU 3.1 Gestionar ABM Sucursales<br>CUU 4.1 Gestionar ABM Empleados<br>|
