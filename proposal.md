# Propuesta TP DSW 2026 - COM 305 - GesThor

## Grupo
### Integrantes
* 43187 - Tisocco, Lucas Maximiliano
* 51315 - Pontelli, Juan Martin
* 42786 - Cuesta, Juan Ignacio
* 41421 - Romero, Emmanuel Nicolas

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)

## Tema
### Descripción
Sistema de gestión de recursos humanos orientado al control de horas laborales en entornos de consultoría y servicios profesionales. El sistema contempla dos perfiles de usuario: administrador (RRHH) y empleado, cada uno con credenciales de acceso propias y funcionalidades diferenciadas según su rol. Los empleados registran sus horas laborales diarias asociadas a proyectos de clientes, mientras que el administrador supervisa y valida dichas cargas horarias, monitorea el estado de avance de los proyectos y gestiona la asignación de personal. El sistema incluye además un contador de horas diarias disponibles por empleado, facilitando el seguimiento de la capacidad operativa del equipo.

### Modelo

<img width="743" height="691" alt="DER_TP_DSW_2026" src="https://github.com/user-attachments/assets/0b447dba-263e-4ff0-ac8b-315dd6ce34a0" />

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
| CRUD simple | 1. CRUD Cliente<br>  2. CRUD Tipo de Proyecto<br>  3. CRUD Categoría de Empleado<br> 4. CRUD Area |
| CRUD dependiente | 1. CRUD Empleado {depende de} CRUD Categoría de Empleado y CRUD Area<br>2. CRUD Proyecto {depende de} CRUD Cliente y CRUD Tipo de Proyecto |
| Listado<br>+<br>detalle | 1. Listado de proyectos filtrado por cliente, muestra nombre del proyecto, fechas y horas estimadas => detalle muestra datos completos del proyecto, cliente y empleados asignados<br>  2. Listado de registros de horas filtrado por empleado y rango de fecha, muestra nombre del empleado, proyecto, fecha y horas cargadas => detalle muestra descripción completa de la tarea |
| CUU/Epic | 1. Registrar horas trabajadas en un proyecto (Empleado)<br>  2. Asignar empleado a un proyecto (Admin RRHH) |


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
| CRUD | 1. CRUD Asignación {depende de} CRUD Empleado y CRUD Proyecto<br>2. CRUD Registro de Horas {depende de} CRUD Empleado y CRUD Proyecto |
| CUU/Epic | 1. Verificar y aprobar carga horaria de un empleado (Admin RRHH)<br>2. Consultar reporte de horas por proyecto: muestra el total de horas registradas por empleado, el porcentaje de avance respecto a las horas estimadas del proyecto y permite filtrar por rango de fechas (Admin RRHH)<br>3. Rechazar registro de horas con observación (Admin RRHH)<br>4. Cerrar proyecto y generar resumen final de horas (Admin RRHH) |


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
| Listados | 1. Historial de asignaciones de un empleado, muestra proyectos en los que participó con fechas y horas totales registradas |
| CUU/Epic | 1. Exportar reporte de horas de un proyecto en formato CSV<br>2. Dar de baja / desactivar un empleado (Admin RRHH)<br>3. Consultar historial de asignaciones de un empleado (Admin RRHH) |
| Otros | 1. Notificación por email al empleado cuando es asignado a un proyecto<br>2. Notificación por email al empleado confirmando aprobación de horas laborales<br>3. Notificación por correo para restablecer la contraseña<br>4. Contador de horas diarias disponibles por empleado con alerta visual al superar el límite |

