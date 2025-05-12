# Propuesta TP DSW

## Grupo
### Integrantes
* 50694 - Nuñez, Felipe
* 51277 - Gonzalez, Valetin

### Repositorios
* [frontend app] (https://github.com/Valentingonza1/frontend-dsw)
* [backend app] (https://github.com/Valentingonza1/backend-dsw)

## Tema
### Descripción
 Sistema de e-commerce para carnicería. Los clientes podrán explorar cortes de carne disponibles, hacer pedidos, programar envíos o retiros, y ver el historial de compras. Los administradores podrán gestionar productos, clientes y pedidos.

### Modelo

![image](https://github.com/user-attachments/assets/992020ed-d164-49c0-a6e0-95754dcc94d3)

## Alcance Funcional 

### Alcance Mínimo

# CRUDs del Sistema - E-commerce Carnicería

## Alcance Mínimo

| Tipo de CRUD         | Descripción                                                                                                                                 |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| CRUD simple          | 1. *Categoría de Producto<br>2. **Cliente<br>3. **Unidad de Medida*                                                                  |
| CRUD dependiente     | 1. *Producto* (depende de Categoría de Producto y Unidad de Medida)<br>2. *Pedido* (depende de Cliente)                               |
| Listado + Detalle    | 1. Listado de productos filtrado por categoría, muestra nombre, precio y stock → Detalle con descripción, unidad, precio y stock<br>2. Listado de pedidos filtrado por fecha o cliente, muestra nro, cliente, total, estado → Detalle muestra productos, cantidades y precios |
| CUU / Epic           | 1. Realizar un pedido de productos<br>2. Confirmar la entrega de un pedido                                                                  |

---

## Adicionales para Aprobación

| Tipo de CRUD         | Descripción                                                                                                                                 |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| CRUD                 | 1. Categoría de Producto<br>2. Cliente<br>3. Unidad de Medida<br>4. Producto<br>5. Empleado (admin)<br>6. Pedido<br>7. Detalle de Pedido     |
| CUU / Epic           | 1. Realizar pedido<br>2. Confirmar entrega<br>3. Cancelar pedido y actualizar stock                                                         |

---

## Alcance Adicional Voluntario

| Tipo de Funcionalidad | Descripción                                                                                                                               |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Listados               | 1. Pedidos del día filtrado por fecha (cliente, productos, estado)<br>2. Historial de pedidos por cliente con fechas, productos y total |
| CUU / Epic             | 1. Enviar confirmación de pedido por email<br>2. Recomendaciones según compras anteriores                                                |
| Otros                  | 1. Integración con pasarela de pagos (real o simulada)<br>2. Actualización automática de stock   

