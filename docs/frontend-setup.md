> **[Portal de Documentación](./README.md)** / Documentación del Frontend

# Documentación del Frontend

## Inicialización y Configuración

Para instrucciones detalladas sobre cómo instalar, configurar y ejecutar la aplicación frontend, consulta el README del repositorio:

**[📖 README del Frontend - Guía de Instalación](https://github.com/upskill-team/Front-End-DSW/blob/main/README.md)**

El README incluye:
- Requisitos previos (Node.js, pnpm)
- Instalación de dependencias
- Configuración de variables de entorno
- Comandos para desarrollo y producción

---

## Storybook - Documentación de Componentes

La documentación interactiva de todos los componentes de la interfaz está disponible en Storybook:

**[📦 Storybook - Catálogo de Componentes](https://upskill-team.github.io/Front-End-DSW/?path=/docs/configure-your-project--docs)**

Storybook proporciona:
- Catálogo visual de todos los componentes UI
- Ejemplos interactivos de uso
- Documentación de props y variantes
- Casos de uso y estados de componentes
- Playground para probar componentes en tiempo real

---

## Integración Continua (CI/CD)

El proyecto utiliza **GitHub Actions** para ejecutar automáticamente los tests antes de incorporar nuevos cambios:

**[⚙️ Ejecución de Tests (GitHub Actions)](https://github.com/upskill-team/Front-End-DSW/actions/workflows/ci.yml)**

Cada pull request y push a las ramas principales ejecuta:
- Suite completa de tests unitarios y E2E.
- Validación de tipado TypeScript
- Análisis de linting y formato de código
- Build de producción para detectar errores de compilación