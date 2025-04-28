# Propuesta TP DSW

## Grupo
### Integrantes
* 51380 - Escobar, Nicolás Roberto
* 50743 - Maragliano, Vittorio
* 51378 - Sosa Bianciotto, Facundo

### Repositorios
* frontend: https://github.com/facundososab/itinerarIA-Frontend.git
* backend: https://github.com/TomasSanchezMachado/itinerarIA-Backend

### Deploy
* https://itinerar-ia-frontend.vercel.app/


## Sistema para armar itinerario de viaje
### Descripción
El sistema resuelve el problema de no saber qué actividades realizar en un destino turístico, proporcionando recomendaciones personalizadas de actividades turísticas y generando itinerarios adaptados a las preferencias del usuario.

### Modelo

![Modelo de dominio]([MD_ItinerarIA.drawio.png](https://github.com/TomasSanchezMachado/TP-Desarrollo-de-Software/blob/main/modelo_del_dominio.md))

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. Usuario<br>2. Lugar <br> 3. Preferencia <br> 4. Itinerario <br>|
|CRUD dependiente|1. CRUD actividad {depende de} CRUD lugar<br>2. CRUD servicioExterno {depende de} CRUD lugar<br>3. CRUD participante {depende de} CRUD itinerario y/o de CRUD de usuario <br>4.CRUD de opinión {depende de} CRUD usuario|
|Listado<br>+<br>detalle| 1. Listado de itinerarios filtrado por lugares: Muestra lugar, duracion y usuario creador => Detalle: Muestra servicios externos del lugar y sus participantes<br>2. Listado de actividades filtrado por lugar, tipo de actividad y transporte => Detalle: CRUD de actividad |
|CUU/Epic|1. Crear itinerario<br>2. Registrar opinión del usuario|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. Servicio Externo<br>2. Participante<br>3. Preferencia|
|CUU/Epic|1. Publicitar un servicio externo<br>2. Generar un itinerario con IA (usando API de Gemini)|


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de opiniones por actividad => Detalle: CRUD opiniones<br>2. Listado de lugares filtrados por atributos<br>3. Listado de servicios externos filtrados por atributos<br>4. Listado de preferencias filtradas por atributos<br>5. Listado de participantes filtrados por atributos|
|CUU/Epic|1. <br>2.|
|Otros|1. |

