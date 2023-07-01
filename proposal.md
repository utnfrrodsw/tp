# Propuesta TP DSW

## Grupo

### Integrantes

- 47218 - Mendiburu, Francisco
- 43092 - Cardach, Simon 
- 42734 - Ramaccioti, Gina
- 41831 - Sanchez, Ramiro 

### Repositorios

- [frontend app](http://hyperlinktogihuborgitlab/)
- [backend app](https://github.com/MendiburuFrancisco/BolsaDeTrabajoAPI)

## Tema

### Descripción

La aplicación de bolsa de trabajo busca solucionar los problemas de diseño desactualizado, falta de funcionalidades y dificultad de navegación en la bolsa de trabajo actual de la facultad. La idea es rediseñar el frontend con enfoque en dispositivos móviles y accesibilidad, y ampliar las funciones existentes. Los usuarios podrán postularse a trabajos, subir sus propias ofertas, gestionar el estado de sus postulaciones y tener un historial detallado. Las empresas podrán publicar ofertas, ver candidatos y sus CVs, y los administradores tendrán control sobre los trabajos publicados.

### Modelo

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org/) en lugar de imágenes.

## Alcance Funcional

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El

Regularidad:

| Req | Detalle |
| --- | --- |
| CRUD simple | 1. CRUD Usuario <br> 2. CRUD <br>3. CRUD TipoEstadoPostulacion<br>4. CRUD TipoTrabajo |
| CRUD dependiente | 1. CRUD Postulación  {depende de} CRUD Trabajo y CRUD Usuario <br>2. CRUD Guardado {depende de} CRUD Trabajo y CRUD Usuario <br> 3. CRUD CV {depende de} CRUD Usuario <br>4. CRUD EstadoPosutlacion {depende de}  CRUD TipoEstadoPostulacion y CRUD Postulación <br> 5. CRUD TipoUsuario {depende de} CRUD Usuario  |
| Listado+detalle | 1. Listado de las postulaciones del usuario ⇒ detalle CRUD Postulacion  <br> 2. Listado de postulantes a un trabajo ⇒ detalle CRUD Postulacion <br>3. Listado de ofertas de trabajo filtrado por especialidad, titulo, estado y tipo ⇒ detalle CRUD Trabajo<br>4. Listado de ofertas de trabajo guardadas filtrado por especialidad, titulo, estado y tipo ⇒ detalle CRUD Trabajo <br> 5. Listado de empresas interesadas en postular trabajos ⇒ detalle CRUD Usuarios |
| CUU/Epic | 1. Postularse a una oferta de trabajo <br>2. Guardar una oferta de trabajo <br>3. Subir una oferta de trabajo<br>4. Cambiar el estado de postulación<br>5. Subir CV’s |

Adicionales para Aprobación

| Req | Detalle |
| --- | --- |
| CRUD | 1. CRUD Usuario <br>2. CRUD Trabajo <br>3. CRUD EstadoTrabajo<br>4. CRUD TipoTrabajo<br>5. CRUD Comentario<br>6. CRUD Estado_Trabajo |
| CUU/Epic | 1. Postularse a una oferta de trabajo <br> 2. Guardar una oferta de trabajo <br>3. Subir una oferta de trabajo<br>4. Cambiar el estado de postulación<br>5. Subir CV’s<br>6. Cancelar postulación<br>7. Agregar comentarios a una postulación |

### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

| Req | Detalle |
| --- | --- |
| Listados |  |
| CUU/Epic |  |
| Otros | 1. Envio por mail de ofertas de trabajo de interés al usuario, por especialidad.<br>2. Envio por mail automatics al postularse |
