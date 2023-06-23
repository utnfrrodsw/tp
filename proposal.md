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
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Sistema de voto estudiantil electrónico que cuenta con autenticación segura de los votantes, protección de la privacidad y confidencialidad de los votos, así como generación precisa de resultados. Además, este sistema ofrece la gestión de listas de candidatos y la generación de informes y análisis detallados.

### Modelo

<div align="center">
  
  ![der](https://github.com/sebafermanelli/tp-dsw-utn/blob/main/der.png)

</div>

### Alcance Funcional

| Req                   | Detalle                                                                                                          |
|:----------------------|:-----------------------------------------------------------------------------------------------------------------|
| **CRUD Simple**       | CRUD Alumno<br/>CRUD Voto<br/>CRUD Lista<br/>CRUD Mesa<br/>CRUD Comite                                           |
| **CRUD Dependiente**  | CRUD Voto {depende de} CRUD Alumno<br/>CRUD Voto {depende de} CRUD Lista<br/>CRUD Lista {depende de} CRUD Alumno |
| **Listado + detalle** | 1. <br/> 2.                                                                                                      |
| **CUU/Epic**          | 1. <br/> 2.                                                                                                      |

### Reglas de Negocio

| Id    | Detalle |
|:------|:--------|
| **1** |         |
