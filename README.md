# tpalquilervehiculos

Trabajo practico DSW

# Propusta Alquiler de Vehiculos

## Grupo

### Integrantes

- Alvarez, Thiago
- 46178 - Joffre Lucas
- 44790 - Tell, Nino
- 48964 - Tolaba Agustin

### Repositorios

- [frontend app](http://hyperlinkToGihubOrGitlab)
- [backend app](http://hyperlinkToGihubOrGitlab)

## Tema

### Descripción de la empresa

La empresa objeto de nuestro trabajo brinda el servicio de alquiler de vehículos particulares a clientes en diversas ciudades de Argentina a través de sus sucursales.

### Modelo

![imagen del modelo](https://github.com/agustintolaba/tpalquilervehiculos/blob/6b26e571f43473752812ab28ab2e38d898c4a5dd/images/modelo_modificado.png)

_Nota_: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER.

Reglas de Negocio:

1. Los vehículos se identifican por su patente, también se conoce: tipo de transmisión, tipo de vehículo(2), capacidad máxima en pasajeros, su estado(8) y sucursal a la que pertenecen. <br>
2. Los vehículos pueden ser de los siguientes tipos: 1- automóvil. 2- camioneta 4x4 3- utilitario . Los tipos de vehículo se identifican con un código único. <br>
3. Las sucursales están codificadas. Se conoce su dirección y localidad a la que pertenecen. <br>
4. Una sucursal tiene un único gerente. <br>
5. Las localidades se encuentran codificadas y pertenecen a una provincia.<br>
6. Las provincias tienen un código único.<br>
7. Las tarifas que se cobran por el depósito dependen solo del tipo de vehículo. Es un monto fijo para cada tipo.<br>
8. La tarifa que se cobra por el alquiler depende de la cantidad de días y del tipo de vehículo. <br>
9. Las tarifas varían según la temporada de realización del alquiler. En caso de un alquiler que abarque dos tarifas diferentes, solo se cobra los precios correspondientes al día de inicio del alquiler. <br>
10. Un vehículo en una fecha determinada está disponible cuando no está reservado ni alquilado. <br>
11. La cancelación de la reserva de un vehículo implica que el vehículo vuelve a estar disponible. <br>
12. Los datos del cliente son: cuit, razón social, apellido, nombre, teléfono, provincia, localidad.<br>
13. Una reserva está identificada con un número único generado por el sistema. El periodo de la reserva se extiende desde la fecha de inicio del alquiler hasta la fecha de finalización del alquiler (no importa el horario). <br>
14. Para la confirmación de la reserva es necesario el pago de un depósito, que depende solo del tipo de vehículo.<br>
15. La cancelación se puede realizar hasta con 7 días de anticipación, para la devolución del 70% del depósito realizado por la misma. <br>
16. Si la cancelación se realiza hasta con un día de anticipación, la devolución es del 20% del depósito. <br>
17. Si no se realiza cancelación y no se efectúa el alquiler del vehículo, no se realiza devolución del depósito. <br>
18. El alquiler de un vehículo está identificado por un número generado por el sistema, y es llevado a cabo por un único empleado. Se conoce la hora de entrega y devolución del vehículo, el precio pagado por el alquiler y el estado.<br>
19. Un alquiler tiene los estados: en proceso y finalizada. <br>
20. Un vehículo tiene uno de los siguientes estados: disponible, reservado, alquilado.<br>
21. Una reserva tiene los estados: pendiente, activa, en proceso, finalizada, cancelada.<br>

## Alcance Funcional

| Req                     | Detalle                                                                                                                                                                                                                                                          |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CRUD simple             | 1. CRUD Tipo Vehiculo<br>2. CRUD Tipo Usuario<br>3. CRUD Localidad/Provincia                                                                                                                                                                                     |
| CRUD dependiente        | 1. CRUD Vehiculo {depende de} CRUD Tipo Vehiculo<br>2. CRUD Usuario {depende de} CRUD Tipo Usuario <br>3. CRUD Sucursal {depende de} CRUD Localidad <br>4. CRUD Reserva {depende de} CRUD Usuario y CRUD Vehiculo <br>5. CRUD Alquiler {depende de} CRUD Reserva |
| Listado<br>+<br>detalle | 1. Listado de vehículos disponibles para alquilar de una sucursal en particular, mostrando la patente y capacidad del mismo. <br> 2. Listado de reservas segun un estado y rango de fecha, mostrando datos del vehículo y del cliente.                           |
| CUU/Epic                | 1. Realizar reserva de un vehículo. <br> 2. Realizar el alquiler de un vehículo. <br>3. Realizar devolución de un vehículo. <br> 4. Realizar cancelación de la reserva. <br> 5.Realizar el alta/baja de un nuevo vehículo.                                       |
