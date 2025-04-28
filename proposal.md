# Propuesta TP DSW

## Grupo

### Integrantes

- 49676 Mercanzini Gian Marco
- 50337 Certo José Emilio
- 50422 Augusto Lescano

### Repositorios

- [frontend app](https://github.com/Augusto-Lescano/frontend-dsw)
- [backend app](https://github.com/Augusto-Lescano/backend-dsw)

## Tema

### Descripción

Sistema de gestion de torneos en diferentes plataformas y juegos. Donde usuarios y equipos puedan inscribirse.

### Modelo

![Image](https://github.com/user-attachments/assets/a5907095-e36f-4d32-a3ad-a059c7a0f4bd)

## Alcance Funcional

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD TipoDeJuego <br>3. CRUD TipoDeTorneo|
|CRUD dependiente|1. CRUD Juego {depende de} CRUD TipoDeJuego <br>2. CRUD Torneo {depende de} CRUD Usuario, CRUD Juego y CRUD TipoDeTorneo|
|Listado<br>+<br>detalle| 1. Listado de torneos filtrado por tipo de torneo, muestra nombre, fecha de inicio, fecha fin, tipo de torneo => detalle CRUD Torneo<br> 2. Listado de juegos filtrado por tipo de juego, muestra nombre, y descripcion => detalle CRUD Juego|
|CUU/Epic|1. Usuario se inscribe un torneo<br>2. Organizador crea torneo|

Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD TipoDeJuego <br>3. CRUD TipoDeTorneo<br> 5. CRUD Juego <br> 6. CRUD Plataforma <br> 7. CRUD Region <br> 8. CRUD EstadoDeTorneo <br> 9. CRUD Inscripcion <br> 10. CRUD Equipo|
|CUU/Epic|1. Usuario se inscribe un torneo<br>2. Organizador crea torneo <br> 3. Usuario crea un equipo|
