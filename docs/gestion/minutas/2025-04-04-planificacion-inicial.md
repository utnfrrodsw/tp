> **[Gestión del Proyecto](../README.md)** / **[Índice de Minutas](./README.md)** / 📄 Kick-off y Planificación Inicial

# Minuta de Reunión: Kick-off y Planificación Inicial

**Fecha:** 2025-04-04
**Asistentes:**

- Carlos Gugliermino
- Nicolás Pedemonte
- Luca Trincavelli
- Franco Zariaga

**Etiquetas:** ![Gestión](https://img.shields.io/badge/GESTIÓN-fd7e14?style=for-the-badge) ![Técnico](https://img.shields.io/badge/TÉCNICO-007bff?style=for-the-badge) ![Decisión](https://img.shields.io/badge/DECISIÓN-28a745?style=for-the-badge) ![Planificación](https://img.shields.io/badge/PLANIFICACIÓN-17a2b8?style=for-the-badge)

---

## 📋 Agenda

1.  Discusión inicial y alineación de la idea del proyecto.
2.  Análisis de la propuesta formal y el modelo de dominio.
3.  Definición del stack tecnológico preliminar para Backend y Frontend.
4.  Planificación de la creación de repositorios y estructura inicial.

---

## 💬 Puntos Discutidos

- Se realizó la reunión de lanzamiento del proyecto para consolidar la idea central: una plataforma de aprendizaje virtual.
- Se revisó en detalle la **Propuesta de TP** y el **modelo de dominio** para comprender las entidades (`Curso`, `Instructor`, `Alumno`, etc.) y sus relaciones.
- Se evaluaron diferentes tecnologías para el stack, priorizando JavaScript como lo exige la consigna.
- Se debatió la importancia de mantener los proyectos de Frontend y Backend desacoplados, lo que llevó a la decisión de utilizar repositorios separados.

---

## ✅ Decisiones Clave

- Se aprueba la idea y el alcance descritos en la Propuesta de TP. En esta etapa, el proyecto aún no tiene un nombre formal.
- Se adopta un stack tecnológico basado en **Node.js con TypeScript + Express** para el Backend y **React** para el Frontend.
- Se decide crear dos repositorios de GitHub separados para mantener el desacoplamiento.

---

## 💡 Discusiones Técnicas: Selección de Frameworks

**Contexto:**
Se necesitaba elegir los frameworks base que cumplieran con los requisitos de la cátedra y se ajustaran a los objetivos del equipo.

**Decisión:**
Se optó por un stack de **Node.js + Express.js con TypeScript** para el Backend, y **React** para el Frontend.

**Justificación y Comparativa**

> **Frameworks Backend**
> | Criterio | **![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) (✅ Elección)** | ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) |
> | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
> | **Curva de Aprendizaje** | Baja. Es minimalista y flexible. | Media-Alta. Requiere aprender su arquitectura inspirada en Angular. |
> | **Flexibilidad** | Muy alta. No impone una estructura estricta. | Baja. Es muy opinado, lo que guía hacia un patrón específico. |
> | **Razón de la elección** | **Su flexibilidad permite construir la arquitectura en capas manualmente, comprendiendo mejor cada parte del proceso.** |

> **Frameworks Frontend**
> | Criterio | **![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) (✅ Elección)** | ![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white) | ![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D) |
> | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------- | :-------------------------- |
> | **Ecosistema** | Enorme. Gran cantidad de librerías y soporte. | Grande. Soportado por Google. | Creciente y muy activa. |
> | **Flexibilidad** | Muy alta. Es una librería, no un framework completo. | Baja. Es un framework opinado y completo. | Alta. Permite flexibilidad. |
> | **Razón de la elección** | **Su vasto ecosistema, flexibilidad y alta demanda en el mercado lo convierten en la opción más estratégica para el proyecto.** |

---

## 🚀 Acciones a Seguir

| Tarea                                                     | Responsable(s) | Fecha Límite |    Estado     |
| :-------------------------------------------------------- | :------------- | :----------: | :-----------: |
| Crear los repositorios de Backend y Frontend en GitHub    | Carlos         |  2025-04-11  | ✅ Completado |
| Inicializar el proyecto Backend con la configuración base | Todos          |  2025-04-26  | ✅ Completado |
