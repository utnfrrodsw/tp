# Propuesta TP DSW

## Grupo
### Integrantes
| Legajo | Nombre | Mail |
|--------|--------|------|
| 47791 | Gomez Manna, Joaquina Esperanza |  |
| 51095 | Carloni, Nahuel Iván |  |
| 50980 | Chacón, Agustina Celeste |  |
| 49938 | Mierez, Joaquín |  |

### Repositorios
- Monorepo (Backend + Frontend): https://github.com/JoaquinM999/TPDSW-COM304--Carloni-GomezManna-Chacon-Mierez-2025

*Nota*: el proyecto utiliza un monorepo con ambos Backend y Frontend en carpetas separadas.


## Tema
#### Descripción
El sistema permitirá a los usuarios ingresar a la página web y observar diferentes reseñas de libros junto con recomendaciones categorizadas por géneros. Los usuarios podrán agregar reseñas con calificación (1-5 estrellas) y comentario, marcar libros como favoritos y guardarlos en su lista personal.

#### Modelo
[Modelo de Dominio](https://drive.google.com/file/d/10CZM5P55DNUaeEiIdEiqubp5iLLYt8Ha/view?usp=sharing)

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD de Usuario<br>2. CRUD de Sagas<br>3. CRUD de Reseña<br>4. CRUD de Autor|
|CRUD dependiente|1. Libro depende del Autor<br>2. Las Sagas dependen de los Libros.|
|Listado + detalle|1. Listado por categoría muestra libros coincidentes<br>2. Filtrado por mayor cantidad de estrellas|
|CUU/Epic|1. Listas de "Leído", "Ver más tarde", "Pendientes".<br>2. Reseñas de los Libros.|

### Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD completo de todos los elementos|
|CRUD dependiente |1. Todas las relaciones establecidas|
|CUU/Epic |1. Moderación automática de reseñas<br>2. Reacciones/likes a reseñas<br>3. Recomendaciones personalizadas<br>4. Seguir a otros usuarios y ver su actividad|

## Entrega / Pull Requests
- Nota: el trabajo fue commiteado directamente en la rama `main`; no se crearon Pull Requests.
- Repositorio (root) - rama `main`: https://github.com/JoaquinM999/TPDSW-COM304--Carloni-GomezManna-Chacon-Mierez-2025/tree/main
- Backend (carpeta) - rama `main`: https://github.com/JoaquinM999/TPDSW-COM304--Carloni-GomezManna-Chacon-Mierez-2025/tree/main/Backend
- Frontend (carpeta) - rama `main`: https://github.com/JoaquinM999/TPDSW-COM304--Carloni-GomezManna-Chacon-Mierez-2025/tree/main/Frontend

- Nota sobre la rama `master`: el equipo dejó de trabajar en `master` y continuó el desarrollo directamente en `main`. No se crearon Pull Requests desde `main` hacia `master`, por lo que no existen enlaces a PRs históricos.


---

**Última actualización:** 26 de Febrero de 2026
