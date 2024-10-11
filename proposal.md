# Propuesta TP DSW

## Grupo
### Integrantes
* 51380 - Escobar, Nicolás Roberto
* 50743 - Maragliano, Vittorio
* 51408 - Sanchez Machado, Tomas
* 51378 - Sosa Bianciotto, Facundo

### Repositorios
* frontend: https://github.com/facundososab/itinerarIA-Frontend.git
* backend: https://github.com/TomasSanchezMachado/itinerarIA-Backend


## Sistema para armar itinerario de viaje
### Descripción
El sistema resuelve el problema de no saber qué actividades realizar en un destino turístico, proporcionando recomendaciones personalizadas de actividades turísticas y generando itinerarios adaptados a las preferencias del usuario.

### Modelo
![imagen del modelo]()


## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. Usuario<br>2. lugar <br> 3. itinerario|
|CRUD dependiente|1. CRUD actividad {depende de} CRUD lugar <br>2. CRUD servicioExterno {depende de} CRUD lugar <br>3. CRUD participante {depende de} CRUD itinerario |
|Listado<br>+<br>detalle| 1. => <br> 2.  => 
|CUU/Epic|1. Crear itinerario<br>2. Registrar opinión del usuario|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD lugar<br>2. CRUD actividad<br>3. CRUD itinerario<br>4. CRUD servicioExterno<br>5. CRUD participante<br>6. CRUD usuario<br>7. CRUD preferencia|
|CUU/Epic|1.<br>2.  <br> 3. |


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1.  <br> 2. |
|CUU/Epic|1. <br>2.|
|Otros|1. |

