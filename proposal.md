# Propuesta TP DSW

## Grupo

### Integrantes

- 47787 - PACHECO, Agustín
- 51185 - GIAMPANI, Ciro
- 51636 - VERA, Maximiliano

### Repositorios

- [frontend app](https://github.com/Maxive26/dsw-frontend)
- [backend app](https://github.com/Maxive26/dsw-backend)
  _Nota_: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema

### Descripción

Sistema para gestión de turnos de una peluqueria. Le permitira al peluquero poder administrar sus turnos de forma ordenada y eficaz. El usuario podrá reservar un turno de forma interactiva, muy rapidamente a travez de la web.

### Modelo

![Imagen de WhatsApp 2025-04-17 a las 11 03 33_aacc23dd](https://github.com/user-attachments/assets/ede23fc5-e4ee-4777-adbc-94f298767b5b)

## Alcance Funcional

### Alcance Mínimo

| Req                     | Detalle                                                                                                                                                                                                                                 |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| CRUD simple             | 1. CRUD Turno<br>2. CRUD Cliente<br>3. CRUD tipoServicio<br>4. CRUD Profesional<br>5. CRUD Sucursal                                                                                                                                     |
| CRUD dependiente        | 1. CRUD Turno {depende de} CRUD Tipo Cliente<br>2. CRUD Profesional {depende de} CRUD Sucursal                                                                                                                                          |
| Listado<br>+<br>detalle | 1. Listado de turnos disponibles a la semana => detalle CRUD Turnno<br> 2. Listado de turnos filtrado por rango de fecha, tipo de servicio, profesional y nombre del cliente => detalle muestra datos completos del turno y del cliente | 3. Listado de los profesionales => detalle CRUD Profesionales. |
| CUU/Epic                | 1. Reservar un turno para la peluqueria<br>2. Revisar historial de tipo de servicios.                                                                                                                                                   |
