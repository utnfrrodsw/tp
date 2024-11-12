# Propuesta TP DSW

## Grupo

### Integrantes

-   26467 - Jiménez, Verónica
-   37668 - Gonzalez, Alexis
-   44105 - Arancibia, Alexis Alejandro
-   45282 - Altamirano, Edgar Gastón

### Repositorios

-   [frontend app](https://github.com/alearanc/tp-dsw-frontend)
-   [backend app](https://github.com/alearanc/tp-dsw-backend)

## Tema: Plataforma de alquileres temporarios

### Descripción

[nombre_app] es una plataforma de alquiler de propiedades temporales que ofrece a los viajeros y/o turistas una amplia gama de opciones de alojamiento para estancias cortas.

### Modelo

[imagen del modelo](https://drive.google.com/file/d/1TExBj5nnbc0cjQYcC1L4PKS_Z_T8oNC8/view)

## Alcance Funcional

### Alcance Mínimo

| Req               | Detalle                                                                                                                                                                                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CRUD Simple       | 1. CRUD TIPO_INMUEBLE<br>2. CRUD LOCALIDAD <br>3. CRUD SERVICIO <br>                                                                                                                                                                                                     |
| CRUD Dependiente  | 1. CRUD INMUEBLE {depende de} CRUD TIPO_INMUEBLE <br>2. CRUD INMUEBLE {depende de} CRUD LOCALIDAD, CRUD PROPIETARIO <br>3. CRUD PERSONA {depende de} CRUD LOCALIDAD<br> 4. CRUD HUESPED {depende de} CRUD PERSONA <br> 5. CRUD PROPIETARIO {depende de} CRUD PERSONA <br> 6. CRUD servicio_inmueble {depende de} CRUD INMUEBLE, CRUD SERVICIO <br> 7. CRUD FOTO {depende de} CRUD INMUEBLE                                                                     |
| Listado + Detalle | 1. Listado de inmuebles filtrado por tipo de inmueble, muestra cod y tipo de inmueble => detalle CRUD Inmueble <br>2. Listado de reservas filtrado por rango de fecha, muestra cod de inmueble, fecha inicio y fin estadía, estado y nombre del cliente => detalle muestra datos completos de la reserva y del cliente |
| CUU / Epic        | 1. Reservar un inmueble para la estadía <br>2. Realizar el check-in de una reserva                                                                                                                                                                                                                                     |

### TODO: Alcance Adicional Voluntario

(A definir con el profesor)
