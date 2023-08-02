# Propuesta TP DSW

## Grupo
### Integrantes
* 50204 - Duran, Facundo Nicolás
* 49853 - Gianotto, Leandro
* 49438 - Simbel, Santino

### Repositorios
* [frontend app](https://github.com/facuduran31/frontend-tpdsw.git)
* [backend app](https://github.com/facuduran31/backend-tpdsw.git)

## Tema
### Descripción
Se desarrollará un sistema de información utilizada por docentes para reservar un laboratorio un día específico o por cuatrimestre, además de materiales adicionales como notebooks, proyectores, etc. Por otro lado, los encargados de laboratorios gestionan las solicitudes de reservas, y las características de los laboratorios con sus respectivas computadoras y máquinas virtuales.

### Modelo
![imagen del modelo](https://imgur.com/soer9xz)



## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Requerimiento|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Computadora<br>3. CRUD Máquina Virtual<br>4. CRUD Recurso<br>5. CRUD Laboratorio<br>6. CRUD Notebook<br>7. CRUD Proyector<br>8. CRUD Encargado<br>9. CRUD Reserva<br>10. CRUD Computadora_maquina_virtual<br>11. CRUD Notebook_Maquina_Virtual|
|CRUD dependiente|1. CRUD reserva {depende de} CRUD docente+laboratorio+recurso<br>2. CRUD computadora  {depende de} CRUD lab|
|Listado<br>+<br>detalle| 1. Listado de laboratorios disponibles para una fecha y hora seleccionada. => detalle CRUD Laboratorio.<br> 2. Listado de reservas que tengan estado pendiente. => detalle CRUD Reserva.|
|CUU/Epic|1. Registrar reserva.<br>2. Confirmar reserva.|


### Alcance Adicional Voluntario

Adicionales para Aprobación
|Requerimiento|Detalle|
|:-|:-|
|Listado<br>+<br>detalle| 1. Listado de máquinas virtuales que tengan un software. => detalle CRUD Máquinas Virtuales.|
|CUU/Epic|1. Cancelar reserva.|
|Otros|1. Notificación de estado final de reserva vía mail.|
