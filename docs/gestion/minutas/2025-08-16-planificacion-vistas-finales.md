> **[Gestión del Proyecto](../README.md)** / **[Índice de Minutas](./README.md)** / 📄 Planificación de Vistas Finales y Organización

# Minuta de Reunión: Planificación de Vistas Finales y Organización

**Fecha:** 2025-08-16
**Asistentes:**

- Carlos Gugliermino
- Nicolás Pedemonte
- Luca Trincavelli
- Franco Zariaga

**Etiquetas:** ![Gestión](https://img.shields.io/badge/GESTIÓN-fd7e14?style=for-the-badge) ![Técnico](https://img.shields.io/badge/TÉCNICO-007bff?style=for-the-badge) ![Decisión](https://img.shields.io/badge/DECISIÓN-28a745?style=for-the-badge) ![Planificación](https://img.shields.io/badge/PLANIFICACIÓN-17a2b8?style=for-the-badge) ![UI/UX](https://img.shields.io/badge/UI/UX-e83e8c?style=for-the-badge) ![Frontend](https://img.shields.io/badge/FRONTEND-563d7c?style=for-the-badge)

---

## 📋 Agenda

1.  Definición del estilo visual para las secciones pendientes de la plataforma.
2.  Revisión y ajuste de permisos en la Organización de GitHub.
3.  Integración de herramientas visuales para la gestión de Git (GitKraken).
4.  Identificación y listado de las vistas restantes por desarrollar.

---

## 💬 Puntos Discutidos

- Para mantener la coherencia visual a medida que el proyecto crece, se realizó una reunión para acordar el estilo y la composición de los componentes para las próximas vistas a implementar (ej. Detalle del curso, Perfil de usuario, etc.).
- Se discutió la necesidad de agilizar la gestión de la organización en GitHub. Para evitar cuellos de botella y que cualquier miembro pueda configurar webhooks o gestionar el repositorio, se propuso dar permisos de Propietario a todos los integrantes.
- Se propuso autorizar el uso de clientes visuales como GitKraken para simplificar la gestión de ramas, commits y pull requests.
- Se hizo un relevamiento completo de la aplicación para crear un checklist definitivo de todas las vistas que faltan por maquetar y desarrollar, para tener una visión clara del trabajo restante hasta la entrega final.

---

## ✅ Decisiones Clave

- Se aprueba una línea de diseño y un conjunto de componentes base para las vistas de "Detalle de Curso", "Mis Cursos" y "Perfil de Usuario".
- Todos los miembros del equipo han sido ascendidos al rol de **Propietario** en la organización de GitHub `upskill-team` para garantizar la autonomía.
- Se aprueba y permite el uso de **GitKraken** como cliente visual de Git para facilitar el flujo de trabajo.
- Se ha definido y documentado la lista final de vistas pendientes, que servirá como base para la creación de las próximas tareas.

---

## 💡 Discusiones Técnicas: Mejora de Productividad y Flujo de Trabajo

**Contexto:**
Algunos miembros del equipo encuentran la línea de comandos de Git compleja para operaciones avanzadas (como rebase interactivo, cherry-picking, etc.), lo que puede ralentizar el desarrollo o generar errores.

**Decisión:**
Se autoriza y se da acceso a toda la organización a herramientas visuales de Git, con **GitKraken** como la principal recomendación.

**Justificación**

- **Visualización Clara:** Permite entender la estructura de ramas de un solo vistazo, facilitando la comprensión de merges y rebases.
- **Reducción de Errores:** Las interfaces gráficas minimizan el riesgo de cometer errores tipográficos en comandos complejos que puedan afectar el repositorio.
- **Agilidad:** Simplifica acciones como el stage selectivo de líneas de código (hunks) y la resolución de conflictos, haciendo el proceso más rápido e intuitivo.

---

## 🚀 Acciones a Seguir

| Tarea                                                                    | Responsable(s) | Fecha Límite |    Estado     |
| :----------------------------------------------------------------------- | :------------- | :----------: | :-----------: |
| Crear las issues en el tablero para las vistas siguientes                | Todos          |  2025-08-19  | ✅ Completado |
| Aplicar el nuevo estilo visual en el desarrollo de las próximas features | Todos          |  Inmediato   | ✅ Completado |
