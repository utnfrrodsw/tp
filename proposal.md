# Propuesta TPI
## Grupo

### Integrantes

   * 47806 - Fani, Rocío Belén
   * 47818 - Grilli, María Lourdes
   * 48155 - Rodriguez, Agustina Lujan

### Repositorios
  
# Tema 
### Descripción
El modelo de negocio de un crucero se basa en vender viajes en crucero que incluyen alojamiento, comida y entretenimiento a bordo de un barco. La página principal de la web presenta imágenes atractivas y capturas de pantalla que muestran el interior del crucero y sus instalaciones.
Además, la página web proporciona información detallada sobre los destinos que se visitarán durante el crucero, ofreciendo descripciones de cada lugar y destacando las atracciones turísticas y las actividades disponibles.
Se presentan los diferentes tipos de alojamiento disponibles, desde camarotes estándar hasta suites de lujo.
La página web permite a los visitantes explorar itinerarios y fechas de salida, ver disponibilidad y realizar reservas en línea. 


### Modelo
![MDCrucero](https://github.com/AgustinaRodriguez01/TPI-DSW/assets/101483416/ead46bab-8c1c-4fa9-9027-04d6585ecdae)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Camarote <br>2. CRUD Viaje<br>3. CRUD Pasajero|
|CRUD dependiente|1. CRUD Camarote {depende de} CRUD Tipo Camarote<br>2. CRUD Reserva {depende de} CRUD Viaje y CRUD Pasajero|
|Listado<br>+<br>detalle| 1. Listado de camarotes filtrado por tipo de camarote, muestra nro y tipo de camarote => detalle CRUD Camarote<br> 2. Listado de reservas filtrado por rango de fecha, muestra nro de camarote, fecha inicio y fin viaje, estado y nombre del pasajero titular => detalle muestra datos completos de la reserva y del pasajero|
|CUU/Epic|1. Reservar un camarote para un crucero<br>2. Realizar el check-in de una reserva|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Camarote<br>2. CRUD Camarote<br>3. CRUD Pasajero<br>4. CRUD Destino<br>5. CRUD Viaje<br>6. CRUD Barco<br>7. CRUD Reserva<br>8. CRUD Viaje_Barco|
|CUU/Epic|1. Reservar un camarote para un viaje<br>2. Realizar el check-in de una reserva<br>3. Realizar el check-out|



