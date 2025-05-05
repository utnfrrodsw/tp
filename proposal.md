# Propuesta TP DSW

## Grupo

### Integrantes

- 51955 - Coria, Grecia Nicol
- 50468 - Ravera, Camila Denisse
- 51013 - Rodriguez, Maria Julieta

### Repositorios

- [frontend app](http://hyperlinkToGihubOrGitlab)
- [backend app](http://hyperlinkToGihubOrGitlab)
  _Nota_: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema

### Descripción

Nuestro software se basa en una página de adopción de mascotas que utiliza etiquetas (tags) para identificar tanto a las mascotas como a los usuarios registrados, con el objetivo de relacionarlos entre sí. En la plataforma, los usuarios podrán cargar mascotas en adopción y también completar un perfil con información relevante que permitirá encontrar coincidencias automáticas con mascotas compatibles.

### Modelo

(https://drive.google.com/file/d/17QlhmLbA_85BeA9a9HWqCJ0liveBjBF4/view?usp=sharing)

## Alcance Funcional

### Alcance Mínimo

_Nota_: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Especie<br>3. CRUD Veterinario|

|CRUD dependiente|1. CRUD SolicitudAdopción {depende de} CRUD Usuario y Mascota<br>2. CRUD Especie {depende de} CRUD Mascota<br>|

|Listado<br>+<br>detalle| 1. Listado de mascotas filtrado por mascotas elegibles para un usuario => id, , edad, compatibleNiños, compatibleMascotas, vacunas, castrado, CRUD Mascota<br> 2. Listado de Patologías de una Mascota => observación, CRUD Patología<br>|

|CUU/Epic|1. Subir una nueva mascota elegible para ser adoptada<br>2. Adoptar una mascota|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Usuario<br>2. CRUD Mascota<br>3. CRUD Especie<br>4. CRUD Patología<br>5. CRUD solicitudAdopción<br>6. CRUD Veterinario<br>7. CRUD consultaVeterinaria|
|CUU/Epic|1. CRUD SolicitudAdopción => CRUD Usuario y CRUD Mascota<br>2. CRUD Patología => CRUD Mascota y CRUD Especie<br>3. CRUD ConsultaVeterinaria => CRUD Veterinario y CRUD Mascota|

### Alcance Adicional Voluntario

_Nota_: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

| Req      | Detalle                                                                                                                                                                                                                |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listados | 1. Listado de ConsultasVeterinarias de una Mascota, mostrando ID, fecha, observación y del Veterinario id, nombre, apellido y matricula => detalle muestra datos completos de la ConsultaVeterinaria y del Veterinario |
| CUU/Epic | 1. --------------                                                                                                                                                                                                      |
| Otros    | 3. CRUD Consulta {depende de} CRUD Veterinario y CRUD Mascota                                                                                                                                                          |
