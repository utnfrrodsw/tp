> **[Gestión del Proyecto](../README.md)** / **[Índice de Minutas](./README.md)** / 📄 Mejora de Procesos: PRs y Documentación

# Minuta de Reunión: Mejora de Procesos: PRs y Documentación

**Fecha:** 2025-08-19
**Asistentes:**

- Equipo de Desarrollo

**Etiquetas:** ![Gestión](https://img.shields.io/badge/GESTIÓN-fd7e14?style=for-the-badge) ![Técnico](https://img.shields.io/badge/TÉCNICO-007bff?style=for-the-badge) ![Decisión](https://img.shields.io/badge/DECISIÓN-28a745?style=for-the-badge)

---

## 📋 Agenda

1.  Revisión de la efectividad del workflow de Pull Requests automáticas (`auto-pr.yml`).
2.  Discusión sobre las desventajas del proceso automático vs. las ventajas de un proceso manual.
3.  Propuesta y definición de una plantilla estándar para las Pull Requests.
4.  Ampliación y estandarización del sistema de etiquetas para la documentación.
5.  Reestructuración visual del registro cronológico de etiquetas para mejorar la legibilidad.
6.  Decisiones finales sobre la mejora de procesos de documentación y flujo de trabajo.

---

## 💬 Puntos Discutidos

- Se inició la reunión analizando el workflow `auto-pr.yml`, concluyendo que resultaba rígido y poco descriptivo.
- Se discutió que las PRs automáticas carecen del contexto que un desarrollador puede aportar manualmente, lo cual es crucial para un buen proceso de Code Review.
- Se planteó que un proceso manual, aunque requiere un paso extra, mejora drásticamente la comunicación y la calidad del historial del proyecto.
- Para asegurar la consistencia, se propuso la creación de una plantilla de PR (`pull_request_template.md`).
- Adicionalmente, se revisó el sistema de etiquetas de las minutas. Se propuso crear una etiqueta **`Full Stack`** y formalizar una leyenda completa para estandarizar su uso.
- Finalmente, se señaló que la gran cantidad de etiquetas en el índice de minutas dificultaba la lectura rápida. Para solucionar esto, se propuso reorganizar la visualización de las etiquetas, agrupándolas por las categorías ya definidas en la leyenda (`Gestión y Proceso`, `Ámbito Técnico`, etc.) directamente en la tabla del registro cronológico.

---

## ✅ Decisiones Clave

- Se aprueba por unanimidad la **eliminación del workflow de GitHub Actions `auto-pr.yml`**.
- Se aprueba e implementa una **plantilla oficial para Pull Requests**.
- A partir de esta fecha, todas las Pull Requests deben ser creadas **manualmente** utilizando la nueva plantilla.
- Se aprueba la creación de la etiqueta **`Full Stack`** y se define una **leyenda de etiquetas completa y estandarizada**.
- Se aprueba la **reestructuración del índice de minutas (`README.md`)** para que las etiquetas se muestren agrupadas por categoría, mejorando así su claridad y legibilidad.

---

## 💡 Discusiones Técnicas: Análisis del Flujo de Pull Requests: Automatización vs. Proceso Manual

**Contexto:**
El workflow actual creaba PRs de forma automática, pero el equipo sentía que este proceso era impersonal y limitaba la calidad de la documentación y la revisión de código.

**Decisión:**
Se ha decidido eliminar esta automatización en favor de un proceso 100% manual, guiado por una plantilla estandarizada.

**Justificación y Comparativa:**

> | Característica          | 👎 **Flujo Automático (Eliminado)**                                  | 👍 **Flujo Manual con Plantilla (Adoptado)**                                                                 |
> | :---------------------- | :------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
> | **Contexto y Detalle**  | Genérico y sin contexto. Difícil entender el "porqué" del cambio.    | **Permite descripciones detalladas, vincular issues y explicar el propósito de cada cambio.**                |
> | **Calidad del Proceso** | Fomenta malos hábitos (commits poco descriptivos, falta de resumen). | **Incentiva la reflexión sobre los cambios realizados y mejora drásticamente la comunicación en el equipo.** |

---

## 🚀 Acciones a Seguir

| Tarea                                                                                     | Responsable(s) | Fecha Límite |    Estado     |
| :---------------------------------------------------------------------------------------- | :------------- | :----------: | :-----------: |
| Eliminar el archivo `.github/workflows/auto-pr.yml` del repositorio de Frontend           | Nicolás        |  2025-08-20  | ✅ Completado |
| Eliminar el archivo `.github/workflows/auto-pr.yml` del repositorio de Backend            | Carlos, Luca   |  2025-08-20  | ⏳ Pendiente  |
| Crear y añadir el archivo `pull_request_template.md` en la carpeta `.github` del Frontend | Nicolás        |  2025-08-20  | ✅ Completado |
| Crear y añadir el archivo `pull_request_template.md` en la carpeta `.github` del Backend  | Carlos, Luca   |  2025-08-20  | ⏳ Pendiente  |
| Actualizar el índice de minutas con la leyenda de etiquetas completa                      | Franco         |  Inmediato   | ✅ Completado |
| Aplicar el nuevo formato de etiquetas agrupadas en el índice de minutas                   | Franco         |  Inmediato   | ✅ Completado |
| El equipo debe comenzar a utilizar el nuevo proceso manual de PRs                         | Todos          |  Inmediato   | ⏳ Pendiente  |
