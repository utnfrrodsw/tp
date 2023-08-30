# Propuesta TP DSW

## Grupo

### Integrantes

| Legajo | Apellido(s), Nombre(s)  |
|:-------|:------------------------|
| 45787  | Andrada, Gastón         |
| 48262  | Cinel, Santiago         |
| 47983  | Fermanelli, Sebastián   |
| 48178  | Karlen Aguirre, Esteban |

### Repositorios

+ [frontend app](https://github.com/sebafermanelli/vote-app-frontend)
+ [backend app](https://github.com/sebafermanelli/vote-app-backend)

## Tema

### Descripción

Sistema de voto estudiantil electrónico que cuenta con autenticación segura, protección de la privacidad y confidencialidad de los votos, así como generación precisa de resultados. Además, este sistema ofrece la gestión de listas de candidatos y la generación de informes y análisis detallados.

### Modelo

<div align="center">

![diagrama-entidad-relacion](https://github.com/sebafermanelli/tp-dsw-utn/blob/main/vote-app-der.png)

</div>

### Alcance Funcional


#### **CRUD Simple**

+ CRUD Admins
+ CRUD Elections
+ CRUD Students
+ CRUD Candidates

#### **CRUD Dependiente**

+ CRUD Vote {depende de} CRUD ElectoralTable, {depende de} CRUD Lists
+ CRUD Delegation {depende de} CRUD Elections
+ CRUD ElectoralTables {depende de} CRUD Elections
+ CRUD Lists {depende de} CRUD Elections, {depende de} CRUD Students

#### **Listado + detalle**

1. Listado de alumnos filtrado por mesa electoral => detalle CRUD Students
2. Listado de listas filtrado por id de lista => detalle CRUD Lists
3. Listado de recuento generales de votos, de cada lista más los votos en blanco => detalle CRUD Vote

#### **CUU/Epic**

1. Registrar el padrón electoral.
2. Registrar la eleccion con sus listas y mesas electorales.
3. Emitir un voto, contando con integridad y seguridad del mismo.
4. Registrar resultados finales de la votación.
5. Actualizar el comité con los nuevos miembros que lo conforman.

### Reglas de Negocio

1. Un alumno puede votar solamente una vez por elección.
2. El alumno puede votar por una única lista o puede votar en blanco si así lo desea.
3. Un comité estará conformado por el presidente, el secretario general y los delegados (8), los cuales son designados por el sistema mediante el método D'Hondt.
4. Un alumno puede pertenecer a una única lista y postularse para un único rol por elección. Roles: Presidente, secretario general o delegado.
5. Cada mesa corresponde a un único curso.
6. Las elecciones se llevan a cabo todos los años, por lo que es necesario actualizar el padrón y realizar una nueva votación con nuevas listas cada año.
7. Un alumno se registra con su número de DNI y también proporciona sus datos personales.
8. Las listas están compuestas por alumnos de cualquier año.
9. El recuento de votos se realiza una vez finalizada la jornada electoral, es automático y el administrador puede obtenerlo cuando lo desee.
10. Cada voto posee un número de voto único.