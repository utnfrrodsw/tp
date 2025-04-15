# Propuesta TP DSW

## Grupo
### Integrantes
* legajo - Apellido(s), Nombre(s)
* 48177 - Vivas, Magali
* 47987 - Contreras Márquez, María Victoria

### Repositorios
* [frontend app](https://github.com/mariavictoriacontreras/frontend_app)
* [backend app](https://github.com/mariavictoriacontreras/backend_app)

## Tema
### Descripción
Plataforma web que permite a refugios registrarse, publicar mascotas disponibles para adopción y gestionar los formularios recibidos de potenciales adoptantes. Los usuarios pueden explorar animales según distintas características y completar un formulario para iniciar el proceso de adopción. El objetivo es facilitar la conexión entre refugios y adoptantes de manera simple y organizada.

### Modelo
https://drive.google.com/file/d/1e0kpQVyMyDDLtTpLmiXh51QIB1wtrdew/view?usp=drive_link

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Refugio <br>2. CRUD Especie<br>
|CRUD dependiente|1. CRUD Mascota {depende de} CRUD Especie<br>
|Listado<br>+<br>detalle| 1. Listado de mascotas filtrado por especie, tamaño, caracteristicas y ubicación del refugio => detalle muestra ficha completa de la mascota<br>
|CUU/Epic|1. Postularse para adoptar una mascota<br>


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Refugio <br>2. CRUD Especie<br>4. CRUD Mascota<br>5. CRUD Candidato<br>6. CRUD Caracteristica<br>7. CRUD solicitudAdopcion<br>
|CUU/Epic|1. Postularse para adoptar una mascota<br>2. Como refugio, revisar postulaciones recibidas<br>


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de mascotas adoptadas, con filtros por fecha o tipo <br>2. Listado de postulaciones realizadas por un usuario |
|Otros|1. Envío de notificaciones por mail: cuando cambia el estado de una postulación, cuando se recibe una nueva solicitud de adoptación|

