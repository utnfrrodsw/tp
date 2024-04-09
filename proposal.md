<h1><strong>Propuesta TP DSW </strong></h1>


<br>

<h3>Grupo</h3>

Integrantes


48177 - Vivas, Magali


49847 - Birchmeyer, Alex


47286 - Battista, Jonatan


49384 - Sacchini, Tomas




<br>



<h3>Repositorios</h3>


<u>frontend app </u> Nota: aún no fue creado.


<u>backend app </u> Nota: aún no fue creado.



<hr>





<h3>Tema:  “Sistema para pinturería” </h3>


<strong>Descripción </strong>

El sistema se encargará de proveer servicios para una pinturería familiar con múltiples sucursales. Servirá como un sistema de gestión interno para realizar el control de stock, actualización de precios y administración de los productos que se encuentren a la venta. También, le otorgará al cliente la posibilidad de acceder a un listado de los productos que se encuentran disponibles y si lo desea, realizar la compra desde la comodidad de su hogar.


<br>
<bold>
 Modelo


Alcance Funcional
</bold>



![TP DSW drawio](https://github.com/MaguiVivasDSW/TP-DSW-2024-/assets/166454023/ccefe73c-069a-4196-bed4-37946a9b6b15)







<table>
    <tbody>
        <tr>
            <th rowspan="4">CRUD SIMPLE</th>
            <td>CRUD Sucursal</td>
        </tr>
        <tr>
            <td>CRUD Persona</td>
        </tr>
        <tr>
            <td>CRUD Localidad</td>
        </tr>
        <tr>
            <td>CRUD Producto</td>
        </tr>
        <tr>
            <th rowspan="7">CRUD DEPENDIENTE</th>
            <td>CRUD Pedido {depende de} CRUD Producto</td>
        </tr>
        <tr>
            <td>CRUD Ítem {depende de} CRUD pedido</td>
        </tr>
        <tr>      
            <td>CRUD Envío {depende de} CRUD Pedido</td>
        </tr>
        <tr>
            <td>CRUD Venta {depende de} CRUD Pedido</td>
        </tr>
        <tr>
            <td>CRUD Cliente {depende de} CRUD Persona</td>
        </tr>
        <tr>
            <td>CRUD Vendedor {depende de} CRUD Persona</td>
        </tr>
        <tr>
            <td>CRUD Proveedor {depende de} CRUD Persona</td>
        </tr>
        <tr>
            <th rowspan="3">LISTADO + DETALLE</th>
            <td>Listado de productos filtrado por tipo de producto, muestra producto y precio => detalle CRUD Producto</td>
        </tr>
        <tr>
            <td>Listado de ventas filtrado por rango de fecha, muestra venta, producto, cliente => detalle muestra datos completos del pedido, cliente y envío en caso de ser necesario.</td>
        </tr>
        <tr>
            <td>Listado de productos filtrado por tipo de producto, muestra producto y cantidad disponible => detalle muestra CRUD Producto</td>
        </tr>
        <tr>
            <th rowspan="4">CUU/EPIC</th>
            <td>Realizar la compra de un producto.</td>
        </tr>
        <tr>
            <td>Realizar la preparación de un pedido.</td>
        </tr>
        <tr>
            <td>Actualización de stock de un producto.</td>
        </tr>
        <tr>
            <td>Cancelación de un pedido realizado.</td>
        </tr>
        <tr>
            <th>OTROS</th>
            <td>Envío de correo al cliente cuando realiza la compra.</td>
        </tr>
    </tbody>
</table>

 
<strong>Primer CRUD a presentar:</strong>
CRUD Sucursal
