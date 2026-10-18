# Proceso de desarrollo

## 1. Asignación de tareas

Las tareas del proyecto son registradas y gestionadas mediante **Trello**. Una vez definida una tarea, esta es asignada a uno de los integrantes del equipo para su desarrollo.

## 2. Creación de la rama

El integrante asignado crea una rama específica para trabajar sobre la tarea correspondiente. De esta manera, los cambios realizados quedan aislados del código principal hasta finalizar su desarrollo.

Las ramas se identifican mediante una convención que permite relacionarlas con la tarea correspondiente.

## 3. Desarrollo y pruebas

La funcionalidad es desarrollada dentro de la rama correspondiente. Durante este proceso se realizan las pruebas necesarias para verificar su correcto funcionamiento y detectar posibles errores.

## 4. Integración en `dev`

Una vez finalizado el desarrollo y superadas las pruebas correspondientes, la rama de la tarea es integrada mediante un **merge** a la rama principal de desarrollo `dev`.

La rama `dev` funciona como entorno de integración, donde se incorporan y verifican los cambios realizados por los distintos integrantes antes de ser incorporados a la versión estable.

## 5. Integración en `main`

Luego de realizar las verificaciones correspondientes sobre `dev`, los cambios son integrados a la rama `main`.

El objetivo de esta separación es mantener una versión estable del proyecto y evitar que cambios que todavía se encuentran en desarrollo sean incorporados directamente a la versión principal.

## 6. Flujo general

El proceso completo puede resumirse de la siguiente manera:

```text
Tarea en Trello
      ↓
Asignación
      ↓
Creación de rama
      ↓
Desarrollo
      ↓
Testing
      ↓
Merge → dev
      ↓
Testing / Integración
      ↓
Merge → main
```

Actualmente, el proceso contempla las pruebas y verificaciones necesarias durante el desarrollo e integración. Como parte de la evolución del proyecto, se prevé complementar este flujo mediante la implementación de **Integración Continua (CI)**, automatizando progresivamente las verificaciones asociadas a los cambios incorporados al repositorio.