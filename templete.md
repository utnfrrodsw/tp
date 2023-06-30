# PROPUESTA TP DSW

## Integrantes

46122 - Sabbioni Santiago

47240 - Oviedo Bernardo

## Repositorios

[frontend-app](https://github.com/bernioviedo/frontend-app.git)

[backend-app](https://github.com/bernioviedo/backend-app.git)

## Tema

### **Descripcion**

Aplicación para gestión de reservas en un complejo de canchas de fútbol, donde hay diferentes tipos de canchas (fútbol 5, 6 y 7) y con posibilidad de reservar también una parrilla del predio. Empleados controlan reservas para llevar un histórico de las mismas, pudiendo obtener una lista con los clientes más frecuentes. Los usuarios pueden inscribir un equipo para disputar un torneo, si no hay equipos inscriptos el torneo no se realiza

### **Modelo**

[link del modelo](https://github.com/santisabb/propuesta-tp-dsw/blob/main/f5TPDSW.jpg)

<img src="https://github.com/santisabb/propuesta-tp-dsw/blob/main/f5TPDSW.jpg">

## Alcance Funcional

| CRUD Simple       | 1. CRUD Tipo cancha<br/> 2. CRUD Servicio<br/> 3. CRUD Cancha <br/> 4. CRUD Empleado <br/> 5. CRUD Cliente <br/> 6. CRUD Parrilla                                                                                                                                                                          |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CRUD Dependiente  | 1. CRUD Cancha {depende de} CRUD Tipo Cancha <br/> 2. CRUD Servicio {depende de} CRUD Cliente, CRUD Empleado y CRUD Cancha                                                                                                                                                                                 |
| Listado + detalle | 1. Listado de reservas filtrado por , muestra nro de cancha, hora inicio y hora fin, estado y nombre del cliente => detalle muestra datos completos de la reserva y el cliente <br/> 2. Listado de clientes filtrado por cantidad de reservas => detalle muestra datos del cliente e histórico de reservas |
| CUU/Epic          | 1. Reservar una cancha para juga <br/> 2. Realizar cobro de una reserva <br/> 3. Realizar facturación de servicios <br/> 4. Cancelación de reserva                                                                                                                                                                               |




