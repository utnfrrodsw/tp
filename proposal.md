# TP-DSW-2024
# Propuesta TP DSW

## Grupo
### Integrantes
* 50979 - María Clara Genovese
* 50977 - Pennice Lucas Agustin
* 50235 - Bruno Pacienzia

### Repositorios
* [frontend app](https://github.com/LucasPennice/TP-DSW-FRONT.git)
* [backend app](https://github.com/LucasPennice/TP-DSW-BACK.git)

## Tema
### Descripción
Servicio para calificar la experiencia con el docente en distintas asignaturas de la carrera de sistemas de la UTN Rosario. Ademas se permite la lectura de estas calificaciones a cualquier alumno inclusive sin estar registrado, para ayudarlo a tomar una mejor decision a la hora de inscribirse a las asignaturas de la carrera

### Modelo
```mermaid
classDiagram

    Catedra "1..*" -- "1..*" Profesor
    Profesor "1..*" -- "1..*" Comision
    Profesor "1" -- "1..*" Review
    Usuario "1" -- "1..*" Review
    Comision "1..*" -- "1" Turno
    Comision "1..*" -- "1..*" Usuario

    class Usuario{
        nombre : String
        legajo : Int
    }

    class Review{
        puntuacion: Int
        descripcion: String
    }

    class Profesor{
        nombre: String
    }

    class Comision{
        codigo: Int
    }

    class Turno{
        nombre: String
    }

    class Catedra {
        nombre: String
        id: String      
    }
```

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Catedra<br>2. CRUD Usuario Administrador<br>3. CRUD Usuario|
|CRUD dependiente|1. CRUD Review {depende de} CRUD Catedra <br>2. CRUD Profesor {depende de} CRUD Catedra y CRUD Turno|
|Listado<br>+<br>detalle| 1. Listado de reviews filtrado por profesor, muestra calificacion y comentario => detalle de la review<br> 2. Listado de catedras filtrado por nombre de catedra y turno, muestra nombre profesor, profesor mejor calificado, calificacion promedio de profesor de la catedra  => detalle de la catedra|
|CUU/Epic|1. Escribir una review<br>2. Dar de alta un profesor|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Catedra<br>2. CRUD Usuario Administrador<br>3. CRUD Usuario<br>4. CRUD Turno<br>5. CRUD Review<br>6. CRUD Profesor<br>7. CRUD Comision|
|CUU/Epic|1. Escribir una review<br>2. Dar de alta un profesor<br>3. Dar de alta una catedra<br> 4. Consultar reviews de un profesor/catedra|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de todas las reviews ordenas/filtradas basandose en la calificacion (positivas - negativas)|
|CUU/Epic|1. Eliminar reviews que contengan malas palabras <br>2. Solicitar aprobacion de una review por un moderador <br>3. Registrarse como nuevo usuario|
|Otros|1. Verificar reviews automaticamente antes de enviarlas a un moderador <br> 2. Comprobar que el alumno pertenezca a la institucion <br> 3. Comprobar que el alumno haya cursado la materia de la que escribe la review |


