> **[Gestión del Proyecto](../README.md)** / **[Índice de Minutas](./README.md)** / 📄 Unificación de Proyecto y Docs

# Minuta de Reunión: Unificación de Proyecto y Documentación

**Fecha:** 2025-08-15
**Asistentes:**

- Carlos Gugliermino
- Nicolás Pedemonte
- Luca Trincavelli
- Franco Zariaga

**Etiquetas:** ![Gestión](https://img.shields.io/badge/GESTIÓN-fd7e14?style=for-the-badge) ![Técnico](https://img.shields.io/badge/TÉCNICO-007bff?style=for-the-badge) ![Decisión](https://img.shields.io/badge/DECISIÓN-28a745?style=for-the-badge) ![Planificación](https://img.shields.io/badge/PLANIFICACIÓN-17a2b8?style=for-the-badge) ![UI/UX](https://img.shields.io/badge/UI/UX-e83e8c?style=for-the-badge) ![Frontend](https://img.shields.io/badge/FRONTEND-563d7c?style=for-the-badge)

## 📋 Agenda

1.  Centralización de los repositorios del proyecto.
2.  Unificación del seguimiento de tareas (issues).
3.  Reestructuración y estandarización de la documentación.
4.  Definición de las reglas y convenciones de trabajo del equipo.

---

## 💬 Puntos Discutidos

- Se discutió la necesidad de migrar los repositorios individuales a una entidad central para mejorar la colaboración y la gestión de permisos.
- Se analizó el proceso para transferir los repositorios a una nueva Organización de GitHub, asegurando la preservación del historial.
- Se evaluó la ineficiencia de tener múltiples tableros y se propuso un único tablero Kanban centralizado.
- Se abordó la limitación del plan gratuito de GitHub para la automatización y se decidió implementar una solución con GitHub Actions.
- Se revisó y propuso una nueva estructura de directorios para la documentación.
- Se acordaron y formalizaron las convenciones para el nombrado de ramas, formato de commits y plantillas de issues.

---

## ✅ Decisiones Clave

- Se crea la Organización de GitHub **`upskill-team`** como el hogar central del proyecto.
- Los repositorios han sido transferidos exitosamente a la nueva organización.
- Se establece el proyecto **`UpSkill - General`** como el único tablero Kanban oficial.
- Se aprueba e implementa la nueva estructura de la carpeta **`docs/`**.
- Se adoptan oficialmente las reglas de trabajo documentadas (**Conventional Commits**, plantillas, etc.).
- El equipo debe familiarizarse y aplicar la nueva estructura y reglas de trabajo.

---

## 💡 Discusiones Técnicas: Automatización con GitHub Actions

**Contexto:** La funcionalidad `Auto-add` nativa de GitHub Projects en el plan gratuito está limitada, impidiendo la configuración de reglas para múltiples repositorios.

**Decisión:** Se implementará un workflow personalizado de **GitHub Actions** para superar esta limitación y asegurar una automatización robusta.

**Justificación:**

- **Flexibilidad:** Permite definir exactamente qué eventos en qué repositorios deben activar la acción.
- **Escalabilidad y Control:** Es la práctica estándar en la industria y nos da control total sobre el proceso.

**Conclusión:** Se ha implementado un archivo `.github/workflows/add-to-project.yml` en los repositorios de `Frontend` y `Backend` para garantizar la sincronización automática de nuevas issues con el tablero central.

---

## 🚀 Acciones a Seguir

| Tarea                                                  | Responsable(s) | Fecha Límite |    Estado     |
| :----------------------------------------------------- | :------------- | :----------: | :-----------: |
| Archivar los proyectos Kanban personales antiguos      | Franco, Carlos |  2025-08-16  | ✅ Completado |
| Comenzar a utilizar las nuevas plantillas de issues    | Todos          |  Inmediato   | ✅ Completado |
| Actualizar el índice de minutas con esta nueva entrada | Nicolás        |  2025-08-15  | ✅ Completado |
