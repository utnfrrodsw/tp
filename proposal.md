# Propuesta TP DSW

## Grupo
### Integrantes
| Legajo | Apellido(s), Nombre(s)  |
|:-------|:------------------------|
| 45787  | Andrada, Gastón         |
| 48262  | Cinel, Santiago         |
| 47983  | Fermanelli, Sebastián   |
| 48033  | Fernandez, Martina      |
| 48178  | Karlen Aguirre, Esteban |
| 48146  | Miño, Sofía             |

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)


## Tema
### Descripción
Sistema de voto estudiantil electrónico que cuenta con autenticación segura de los votantes, protección de la privacidad y confidencialidad de los votos, así como generación precisa de resultados. Además, este sistema ofrece la gestión de listas de candidatos y la generación de informes y análisis detallados.

### Modelo

<div align="center">
  
  ![der](https://github.com/sebafermanelli/tp-dsw-utn/blob/main/der.png)

</div>

### Alcance Funcional

| Req                   | Detalle                                                                                                                   |
|:----------------------|:--------------------------------------------------------------------------------------------------------------------------|
| **CRUD Simple**       | CRUD Alumno<br/>CRUD Voto<br/>CRUD Lista<br/>CRUD Mesa<br/>CRUD Comite                                                    |
| **CRUD Dependiente**  | CRUD Voto {depende de} CRUD Alumno<br/>CRUD Voto {depende de} CRUD Lista<br/>CRUD Lista {depende de} CRUD Alumno          | 
| **Listado + detalle** | 1. Listado de alumnos filtrado por curso => detalle CRUD Alumno<br/> 2.Listado de listas filtrado por id de lista => detalle CRUD Listas<br/> 3. Listado de recuento generales de votos, de cada lista + votos en blanco => detalle CRUD voto                                                                |
| **CUU/Epic**          | 1.Realizar un voto, contando con integridad y seguridad <br/> 2. Actualizar el comite al finalizar recuento               |

### Reglas de Negocio

| Id    | Detalle |
|:------|:------------------------------------------------------------------------------------------------------------------------------------------|
| **1** | Un alumno puede votar unicamente una vez por elección                                                                                     |
| **2** | El alumno puede votar a una única lista o puede votar en blanco si así lo desea                                                           |
| **3** | Un comite va a estar formado por el que sea seleccionado presidente y los secretarios elegidos, que pueden ser de distintas listas        |
| **4** | Un alumno puede pertenecer a una única lista dada una elección, puede postularse de presidente o secretario                               |
| **5** | Cada mesa corresponde a un único curso. Ejemplo: existe la mesa 3 de 1ª "A" y la mesa 5 de 3ª "Sociales"                                  |
| **6** | Las elecciones son realizadas todos los años, por lo que todos los años hay que rehacer el proceso                                        |
| **7** | Un alumno se registra por número de legajo, posee sus datos personales también                                                            | 
| **8** | Las listas las componen alumnos de cualquier año y hay muchas listas, pero el presidente solamente puede ser de los ultimos años          |
| **9** | El recuento de votos se realiza una vez finalizada la jornada electoral, es automatica y el sistema la da cuando el administrador lo desee|
| **10** | Las mesas son identificadas por el curso                                                                                                 |
| **11** | Cada voto posee un número de voto único                                                                                                  |
