# Propuesta TP DSW

## Grupo
### Integrantes
* 46876 - Zinni, Gonzalo
* 44963 - Decaroli, Alejandro

### Repositorios
* [fullstack app](https://github.com/alejandro-decaroli/TimeFlow)

## Tema
### Descripción
Aplicación integral para gestión de tiempo, proyectos y metas personales. Enfocada en la simplicidad y un estilo zen para evitar distracciones. 

### Modelo
![Screenshot 2025-04-02 at 18-07-10 20250402_18h06m28s_grim png (Imagen PNG 1920 × 1080 pixels) - Escala (84%)](https://github.com/user-attachments/assets/4e3abd05-0d19-4e3a-a869-71019837c019)

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Tarea<br>3. CRUD Proyecto|
|CRUD dependiente|1. CRUD Meta {depende de} CRUD Proyecto<br>2. CRUD Nota {depende de} CRUD Proyecto|
|Listado<br>+<br>detalle| 1. Listado de tareas filtradas por tag, id o fecha => mostrar detalle de la tarea y CRUD de la misma<br> 2. istado de proyectos filtrados por nombre, fecha o id  => Mostrar detalle del proyecto|
|CUU/Epic|1. Crear un proyecto nuevo<br>2. Crear una nota<br>3. Crear una meta<br>4. Modificar una tarea


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD|1. CRUD Usuario<br>2. CRUD Tarea<br>3. CRUD Proyecto<br>4. CRUD Meta<br>5. CRUD Nota
|CUU/Epic|1. Crear un proyecto nuevo<br>2. Crear una nota<br>3. Crear una meta<br>4. Modificar una tarea

