> **[Portal de Documentación](../README.md)** / **[Gestión del Proyecto](./README.md)** / 📜 Reglas y Convenciones

# 📜 Reglas y Convenciones de Trabajo

Este documento establece las reglas, flujos de trabajo y estándares que todo el equipo "UpSkill" debe seguir. Su propósito es garantizar la coherencia, legibilidad y calidad de nuestro código y documentación.

---

### 🌐 Política de Idiomas

| Artefacto                          | Idioma      |
| :--------------------------------- | :---------- |
| **Código y Comentarios de Código** | **Inglés**  |
| **Commits y Nombres de Ramas**     | **Inglés**  |
| **Issues, PRs y Documentación**    | **Español** |

---

### 🌿 Control de Versiones (Git)

#### Flujo de Ramas

Utilizamos un flujo de trabajo simplificado para asegurar que la rama principal siempre contenga una versión estable.

> **Nota:** El Git Flow simplificado descrito a continuación se aplica a los repositorios de **Frontend** y **Backend**. Este repositorio de documentación, al tener un ciclo de vida más directo, no sigue estrictamente este flujo.

| Rama          | Propósito Principal                                                                             |
| :------------ | :---------------------------------------------------------------------------------------------- |
| **`main`**    | Refleja el código en producción. El código solo llega aquí a través de PRs desde `develop`.     |
| **`develop`** | Es nuestra rama de integración y trabajo principal. **Es la rama por defecto del repositorio.** |

#### Nomenclatura de Ramas

- **Formato:** `tipo/descripcion-corta-en-ingles`

| Prefijo     | Propósito                                          | Ejemplo                       |
| :---------- | :------------------------------------------------- | :---------------------------- |
| `feature/`  | Para nuevas funcionalidades.                       | `feature/user-profile-page`   |
| `bugfix/`   | Para corrección de errores.                        | `bugfix/fix-login-validation` |
| `refactor/` | Para mejoras de código sin cambio funcional.       | `refactor/optimize-api-calls` |
| `docs/`     | Para cambios exclusivos en la documentación.       | `docs/update-readme`          |
| `chore/`    | Para tareas de mantenimiento (deps, config, etc.). | `chore/update-dependencies`   |

#### Formato de Commits

- **Estándar:** Seguimos estrictamente la especificación de **[Conventional Commits](https://www.conventionalcommits.org/)**.
- **Estructura:**
  ```
  <tipo>(alcance): <descripción concisa en imperativo>
  ```
- **Ejemplos:**
  ```
  feat: add user authentication endpoint
  fix(ui): correct button alignment on login form
  docs: update API endpoint documentation
  ```

---

### 📝 Gestión de Tareas (Issues)

Para estandarizar la creación de tareas, utilizamos **plantillas de issues automatizadas** por GitHub. Al hacer clic en "New Issue", se presentarán las opciones disponibles.

> Para una referencia visual y detallada de cada plantilla, puedes consultar nuestro **[Portal de Plantillas](./plantillas/README.md)**.

---

### ✨ Calidad del Código

#### Comentarios

- **Principio:** Comenta el **"porqué"** del código, no el "qué". El código debe ser lo más auto-explicativo posible.
- **Tags Estándar:** `// TODO:` para tareas pendientes, `// FIXME:` para indicar problemas conocidos.
