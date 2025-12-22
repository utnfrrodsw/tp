> **[Gestión del Proyecto](../README.md)** / **[Índice de Minutas](./README.md)** / 📄 Sincronización General: UI, Backend y Automatización

# Minuta de Reunión: Sincronización General: UI, Backend y Automatización

**Fecha:** 2025-08-10
**Asistentes:**

- Carlos Gugliermino
- Nicolás Pedemonte
- Luca Trincavelli
- Franco Zariaga

**Etiquetas:** ![Gestión](https://img.shields.io/badge/GESTIÓN-fd7e14?style=for-the-badge) ![Técnico](https://img.shields.io/badge/TÉCNICO-007bff?style=for-the-badge) ![Decisión](https://img.shields.io/badge/DECISIÓN-28a745?style=for-the-badge) ![Próximos Pasos](https://img.shields.io/badge/PRÓXIMOS_PASOS-6f42c1?style=for-the-badge) ![UI/UX](https://img.shields.io/badge/UI/UX-e83e8c?style=for-the-badge) ![Full Stack](https://img.shields.io/badge/FULL_STACK-7c4dff?style=for-the-badge)

---

## 📋 Agenda

1.  Decisión sobre el nombre comercial del proyecto.
2.  Selección de librerías y frameworks clave para el Frontend (UI y HTTP).
3.  Planificación para el robustecimiento del Backend (Validación y CI/CD).
4.  Priorización de tareas de desarrollo para ambos equipos.

---

## 💬 Puntos Discutidos

- Con el inicio del desarrollo de la interfaz visual, se discutió la necesidad de un nombre formal para el proyecto. Se eligió **UpSkill**.
- Se debatió sobre la estrategia de estilizado y la elección de un cliente HTTP para el Frontend.
- Se discutió la mejora de la seguridad y calidad del Backend, identificando la validación de datos de entrada como un punto crítico.
- Se abordó la necesidad de automatizar tareas repetitivas como la ejecución de tests, proponiendo el uso de **GitHub Actions** para ambos repositorios.

---

## ✅ Decisiones Clave

- Se formaliza el nombre del proyecto como **UpSkill**.
- **Frontend:** Se adopta **Tailwind CSS** para los estilos y **Axios** como cliente HTTP.
- **Backend:** Se utilizará la librería **Valibot** para la validación de esquemas en los endpoints.
- **General:** Se crearán workflows de **GitHub Actions** para la Integración Continua (CI), gestión de issues y PRs automáticas.
- Se prioriza el desarrollo de la Landing Page, Login/Registro, Formulario de "Appeal" y Listado de Cursos.

---

## 💡 Discusiones Técnicas: Selección de Stack y Herramientas

**Contexto:**
Se necesitaba tomar decisiones técnicas clave tanto en el Frontend como en el Backend para asegurar la calidad, seguridad y eficiencia del desarrollo.

**Decisión:**
Se optó por un conjunto de herramientas específicas: **Tailwind CSS** y **Axios** para el Frontend, y **Valibot** para la validación en el Backend.

**Justificación y Comparativa**

> **Librerías Frontend**
>
> **Estilos**
> | Criterio | **![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) (✅ Elección)** | ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white) |
> | :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
> | **Personalización** | Máxima. Control total sobre el diseño. | Limitada. Requiere sobreescribir estilos. |
> | **Razón de la elección** | **Permite construir una interfaz de usuario completamente personalizada sin estar atado a componentes predefinidos.** |
>
> **Comunicacion con Backend**
> | Criterio | **![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) (✅ Elección)** | ![Fetch API (Nativa)](https://img.shields.io/badge/Fetch_API-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |
> | :----------------------- | :-------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
> | **Interceptores** | Soportados. Ideal para inyectar tokens JWT. | No soportados nativamente. |
> | **Razón de la elección** | **Sus interceptores son perfectos para adjuntar automáticamente el token a las peticiones, simplificando la lógica.** |

> **Librería de Validación (Backend)**
> | Criterio | **![Valibot](https://img.shields.io/badge/Valibot-2a9d8f?style=for-the-badge) (✅ Elección)** | ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge) |
> | :----------------------- | :----------------------------------------------------------------------------------------------------------------------- | :------------------------------------ |
> | **Tamaño del Paquete** | Muy pequeño. Optimizado para "tree-shaking". | Pequeño, pero más grande que Valibot. |
> | **Razón de la elección** | **Ofrece una API moderna y casi idéntica a Zod, pero con un impacto significativamente menor en el tamaño del paquete.** |

---

## 🚀 Acciones a Seguir

| Tarea                                                           | Responsable(s) | Fecha Límite |    Estado     |
| :-------------------------------------------------------------- | :------------- | :----------: | :-----------: |
| Integrar Tailwind CSS y Axios en el proyecto Frontend           | Franco         |  2025-08-11  | ✅ Completado |
| Crear los workflows de CI/CD en GitHub Actions para Backend     | Nicolas        |  2025-08-12  | ✅ Completado |
| Refactorizar la lógica de autenticación en el cliente           | Todos          |  2025-08-13  | ✅ Completado |
| Implementar el flujo completo de autenticación (middleware)     | Todos          |  2025-08-14  | ✅ Completado |
| Desarrollar página de "Solicitud de Profesor" y lista de cursos | Carlos, Luca   |  2025-08-14  | ✅ Completado |
| Implementar endpoint de creación de `Appeal` con validación     | Nicolas        |  2025-08-15  | ✅ Completado |
