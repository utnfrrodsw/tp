# Propuesta TP DSW

## Grupo
### Integrantes
* 43075 - Fascendini, Renzo

### Repositorios
* [frontend app - No Disponibles Actualmente]
* [backend app - No Disponibles Actualmente]

## Tema
### Descripción
Desarrollar un sistema de inscripción de alumnos para las carreras de grado y posgrado dictadas en la Universidad Tecnologica Nacional Regional Rosario y en los diferentes anexos institucionales, que permita realizar el registro e inscripción de un nuevo alumno en la institución de forma automatizada.

### Modelo
https://drive.google.com/file/d/1sN6lxknGDeUfjowhyQDId1MU-sqobIae/view?usp=drive_link

## Alcance Funcional 

Adicionales para Aprobación

### Tabla de Entidades

|ENTIDADES|NOMBRE TABLA|DESCRIPCIÓN
|:-|:-|:-|
|Carreras	|carreras	|Todas las carreras, especializaciones y posgrados dictados en la UTN FRRo como en sus anexos 
|Comisiones	|comisiones	|Las comisiones que poseen las diferentes Carreras
|Configuración	|configuracion_entorno	|Variables que definen la configuración del sistema
|Parámetros Configuración	|configuracion_parametros	|Variables que complementan la información de las solicitudes y los Cursos
|Correos	|correos	|Notificaciones enviadas a los ingresantes dependiendo las acciones ejecutadas por el administrador
|Discapacidad	|discapacidad	|Variables que complementan la información de la inscripción del ingresante
|Entidades Educativas	|entidadesEducativas	|Todas las entidades educativas registradas a nivel nacional
|Facultades	|facultades	|Todas las facultades de la UTN
|Facultades_Carreras	|facultades_carreras	|Carreras que se dictan en cada regional de UTN
|Inscripciones	|inscripciones	|Registros de las inscripciones realizadas por los alumnos
|Inscripciones Backups	|inscripcionesBackup	|Backup de las inscripciones que fueron exportadas al Sysacad y borradas de la tabla Inscripciones
|Materias_Comisión	|materias_comisiones	|Materias dictadas por comisión
|Requisitos Académicos	|requisitosAcademicos	|Documentación que debe presentar el ingresante
|Usuarios	|usuarios	|Usuarios del sistema
|Materias	|materias	|Materias de las Carreras
|Personas	|personas	|Inscriptos con solicitud aprobada


### Alcance del Sistema

|REQUISITOS|DETALLE
|:-|:-|
|CRUD|1. CRUD Carreras<br>2. CRUD Facultades<br>3. CRUD Materias|
|CRUD Dependiente|4. CRUD Comisiones {depende de} CRUD Carrera y Materias<br>5. CRUD Materias {depende de} CRUD Carrera<br>6. CRUD Inscripciones {depende de} CRUD Carrera<br>7. CRUD Discapacidad {depende de} CRUD Inscripción<br>8. CRUD Personas {depende de} CRUD Inscripción<br>9. CRUD Alumnos {depende de} CRUD Personas y de una aplicación externa.|
|Listado + Detalle |1. Listado de Carreras filtrado por nombre.<br>2. Listado de Facultades filtrado por nombre.<br>3. Listado de Comisiones filtrado por turno y carrera.<br>4. Listado de Materias filtrado por nombre.<br>5. Listado de Inscripciones filtrado por ingresante {apellido, nombre, dni}, fecha de alta, estado solicitud => detalle muestra datos completos de la inscripción e inscripto.|
|CUU/Epic |1. Registrar un nuevo ingresante<br>2. Registrar Solicitud de Inscripción<br>3. Validar Inscripción<br>4. Registrar un nuevo ingresante|

### Alcance Adicional Voluntario

|REQUISITOS|DETALLE|
|:-|:-|
|Listados |1. Listado de Personas filtrado por datos del inscripto {todos los datos}.<br>2. Listado de Alumnos filtrado por datos de la persona {todos los datos}.|
|CUU/Epic |1. Registrar Ingresante como Persona<br>2. Registrar Persona como Alumno|
|Otros    |1. Registro vía token y confirmación de correo.<br>2. Envío de notificación de validación de inscripción por email.|

## Análisis y Relevamiento

Adicionales para Aprobación

### Casos de Uso de Negocio

<b>CUN_001. Registrar un nuevo ingresante</b><br>
1. El usuario ingresa al sitio web donde se realiza el proceso de registro.<br>
2. El usuario inicia el proceso de registro.<br>
3. El usuario completa el formulario de registro con sus datos.<br>
4. El usuario válida la inscripción e ingresa al sistema.
<br>
<b>CUN_002. Registrar Solicitud de Inscripción</b><br>
1. El usuario ingresa al sistema con sus credenciales.<br>
2. El usuario completa el formulario de inscripción con sus datos y adjunta documentación.<br>
3. El usuario finaliza la inscripción y envía la solicitud.
<br>
<br>
<b>CUN_003. Validar Inscripción</b><br>
1. El PA chequea diariamente las solicitudes de inscripciones.<br>
2. Si existe una solicitud de inscripción pendiente, el PA comienza el proceso de validación de datos.<br>
3. Si todos los datos son correctos, el PA aprueba la inscripción.
<br>
<br>
<b>CUN_004. Registrar Nuevos Alumnos</b><br>
1. El PA realiza el proceso de "CUU_001 Iniciar Sesión".<br>
2. El PA ingresa al panel de inscripciones.<br>
3. El PA busca las inscripciones con estado “aprobado”.<br>
4. El PA realiza el proceso de alta de alumnos.

### Casos de Uso de Sistema

<b>CUS_001. Registrar un nuevo ingresante</b><br>
1. El usuario ingresa al sitio web donde se realiza el proceso de registro. El Sistema inicia el proceso de registro.<br>
2. El usuario inicia el proceso de registro. El Sistema registra la solicitud y muestra los campos a completar.<br>
3. El usuario completa los datos para validación de la solicitud. El Sistema los registra y envía el correo de validación.<br>
4. El usuario válida la inscripción e ingresa al sistema. El Sistema lo registra y actualiza el estado del Usuario a “Verificado” y crea un registro de inscripción con estado “Nueva”.
<br>
<b>CUS_002. Registrar solicitud de inscripción</b><br>
1. El usuario ingresa al sistema con sus credenciales. El Sistema lo valida.<br>
2. El usuario completa el formulario de inscripción y envía la solicitud. El Sistema lo registra y modifica el estado de la inscripción a “Pendiente”.<br>
<br>
<br>
<b>CUS_003. Validar Inscripción</b><br>
1. El PA realiza el proceso de "CUU_001 Iniciar Sesión".<br>
2. El PA chequea diariamente las solicitudes de inscripciones. El Sistema muestra las inscripciones “pendientes”.<br>
3. Si existe una solicitud de inscripción pendiente, el PA comienza el proceso de validación de datos. El Sistema muestra la información completa de dicha inscripción.<br>
4. Si todos los datos son correctos, el PA aprueba la inscripción. El Sistema registra la selección y modifica el estado de la inscripción a “aprobada”.
<br>
<br>
<b>CUS_004. Registrar Nuevos Alumnos</b><br>
1. El PA realiza el proceso de "CUU_001 Iniciar Sesión".<br>
2. El PA ingresa al panel de inscripciones. El Sistema las muestra.<br>
3. El PA busca las inscripciones con estado “aprobado”. El Sistema las filtra y las muestra.<br>
4. El PA realiza el proceso de alta de alumnos. El Sistema exporta las inscripciones con estado “aprobado” y crea los registros como nuevas personas en la base de datos con los datos del ingresante. A su vez, el Sistema repite el proceso pero con los registro de personas pero crea registros de alumnos con los datos de las personas.<br>
