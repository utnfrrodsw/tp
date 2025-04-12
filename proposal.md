# Propuesta TP DSW

## Grupo
### Integrantes
* 46876 Zinni, Gonzalo
* 44963 Decaroli, Alejandro


### Repositorios
* [fullstack app](https://github.com/alejandro-decaroli/TimeFlow)


## Tema
### Descripción
Aplicación colaborativa e integral para gestión de tiempo, proyectos y tareas. Enfocada en la simplicidad y un estilo zen para evitar distracciones. 

### Modelo
![imagen](https://github.com/user-attachments/assets/0d508cc2-1586-41ce-9392-de6b89049ffe)



## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tarea<br>2. CRUD Proyecto<br>3. CRUD Usuario|
|CRUD dependiente|1. CRUD Meta {depende de} CRUD Proyecto<br>2. CRUD Nota {depende de} CRUD Proyecto<br>3. CRUD Cronograma {depende de} CRUD Proyecto y CRUD Meta|
|Listado<br>+<br>detalle| 1. Listado de tareas filtradas por prioridad, o id => detalle descripcion de Tareas<br> 2. Listado de notas filtrado por proyecto => detalle muestra descripcion de Notas|
|CUU/Epic|1. Añadir metas a un proyecto<br>2. Añadir notas a un proyecto|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tarea<br>2. CRUD Proyecto<br>3. CRUD Usuario<br>4. CRUD Meta<br>5. CRUD Nota<br>6. CRUD Cronograma|
|CUU/Epic|1. Añadir metas a un proyecto<br>2. Añadir notas a un proyecto<br>3. Añadir un colaborador a un proyecto<br>4. Añadir una iteracion a un cronograma|




