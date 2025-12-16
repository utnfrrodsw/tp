# Propuesta TP DSW

## Grupo
### Integrantes
* 47921 - Garabelli, Joaquin
* 49848 - Bellini, Esteban
* 49876 - Hintersech, Lara

### Repositorios
* [frontend app](https://github.com/estebannbn/frontend-electroservi)
* [backend app](https://github.com/estebannbn/backend-electroservi)

## Tema
### Descripción
Nuestro sistema será una web para un negocio de servicio técnico de electrodomésticos. Hay 3 tipos de usuarios: Clientes, Técnicos, y Administradores; cada uno con distintas funciones.

### Modelo
![imagen del modelo](md.drawio.png)

## Alcance Funcional 

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD TipoDeTrabajo<br>3. CRUD Material<br>4. CRUD Repuesto<br>5. CRUD Electrodoméstico|
|CRUD dependiente|1. CRUD Cliente {depende de} CRUD Usuario<br>2. CRUD Tecnico {depende de} CRUD Usuario<br>3. CRUD Administrador {depende de} CRUD Usuario<br>4. CRUD Trabajo {depende de} CRUD Servicio y CRUD Tecnico<br>5. CRUD Servicio {depende de} CRUD TipoDeTrabajo y CRUD Cliente|
|Listado<br>+<br>detalle| 1. Listado de servicios filtrado por rango de fecha y estado. Muestra cantidad de servicios reparados, cantidad con solo diagnostico, cantidad de heladeras, cantidad de microondas, cantidad de televisores, fondos totales recaudados, suma de gastos, suma de gastos en pedidos => detalle resumen general de todos los servicios en dicho rango de fechas<br> 2. Listado de tipos de trabajo. Muestra cantidad de servicios de este tipo realizados, ganancias totales generadas, ganancias totales para los técnicos, ganancias totales para el negocio => detalle muestra estadísticas|
|CUU/Epic|1. Registrar cliente<br>2. Solicitar servicio<br>3. Modificar datos de usuario<br>4. Registrar técnico<br>5. Registrar pago a tecnico<br>6. Deshabilitar o habilitar un técnico<br>7. Modificar tipo de trabajo<br>8. Modificar o registrar material<br>9. Modificar o registrar repuesto<br>10. Realizar Pedido de materiales<br>11. Realizar Pedido de repuestos<br>12. Realizar relevamiento de servicio<br>13. Pedir repuestos para servicio<br>14. Pedir materiales para servicio<br>15. Finalizar relevamiento de servicio<br>16. Modificar servicio<br>17. Mostrar estadísticas de periodo<br>18. Aceptar reparacion<br>19. Mostrar resultados de reparación|

### Comentarios
1. Podriamos cambiar el listado 2 de la tabla anterior.
