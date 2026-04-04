# Propuesta TP DSW

## Grupo
### Integrantes
* 52133 - Alfieri, Agustín
* 51871 - Toloza, Laureano Yoel
* 52726 - Garrido, Alejo
* 51086 - Santos, Juan Pablo

### Repositorios
* [Frontend app](https://github.com/AgustinAlfieri/Frontend_Clinica)
* [Backend app](https://github.com/AgustinAlfieri/Backend_Clinica)
  
## Tema
Sistema de gestión de turnos de un consultorio médico.
### Descripción
La solución web permitirá la gestión de turnos de un consultorio medico, con profesionales de diversas especialidades. Incluyendo la gestión de los profesionales, las especialidades, los horarios de consulta, prácticas médicas y cobertura por parte de las obras sociales. Contará con distintos perfiles de usuario para los pacientes, médicos, administrativos y cargos gerenciales, con los permisos correspondientes.


### Modelo
* [Modelo de dominio](https://drive.google.com/file/d/1nqZl5GwQ2lXWgGXlvLleDH2HjLkMAd4C/view?usp=sharing)

* [Diagrama Entidad Relación (DER)](https://drive.google.com/file/d/1akrs0uNtQeMN1Mb4DokaErI3F0sG7fDa/view?usp=sharing)

### Minutas de reuniónes
* [Minutas](https://docs.google.com/document/d/10LV8cRHih50YrJ8PQAy4Ex6P9a8HaeJ6_hm_ABMd-j0/edit?usp=sharing)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Especialidad médica<br>2. CRUD Obra social<br>3. CRUD Tipo Estado turno<br>4. CRUD Administrativo|
|CRUD dependiente|1. CRUD Práctica {depende de} CRUD Especialidad médica<br>2. CRUD Turno {depende de}  CRUD Profesional/CRUD Paciente/CRUD Práctica.<br>3. CRUD Profesional{depende de} CRUD Especialidad médica<br>4. CRUD Paciente {depende de} CRUD Obra social<br>5. CRUD Estado turno{depende de} CRUD Tipo Estado Turno|
|Listado<br>+<br>detalle| 1. Listado de turnos filtrado por dni del paciente, muestra fecha_hora_consulta del turno, nombre y fecha_hora del estado actual del turno, nombre_apellido del profesional y nombre y descripción de la/s práctica/s.<br> 2. Listado de turnos filtrados por matricula del profesional y codigo de estado del turno, muestra dni y nombre_apellido del paciente y nombre, fecha_hora y observaciones del estado actual del turno. |
|CUU/Epic|1. Solicitar Turno<br>2. Modificar Turno|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Especialidad médica<br>2. CRUD Obra social<br>3. CRUD Profesional<br>4. CRUD Paciente<br>5. CRUD Administrativo<br>6. CRUD Práctica<br>7. CRUD Turno <br>8. CRUD Estado turno {depende de} CRUD turno|
|CUU/Epic|1. Admitir paciente en sala<br>2. Envío de solicitud de confirmación de turno por email<br>3. Cancelar turno |

### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. nombre_apellido Profesional filtrado por codigo_especialidad de Especialidad Medica|
|CUU/Epic|1. Dar de baja usuario<br>2. Cancelar turno <br>2. Cancelar turno|
|Otros|1. Envío de solicitud de confirmación de turno por email <br> 2. Envío de recordatorio de turno 24hs antes por email|

