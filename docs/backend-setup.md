> **[Portal de Documentación](./README.md)** / Documentación del Backend

# Documentación del Backend

## Inicialización y Configuración

Para instrucciones detalladas sobre cómo instalar, configurar y ejecutar el servidor backend, consulta el README del repositorio:

**[📖 README del Backend - Guía de Instalación](https://github.com/upskill-team/Back-End-DSW/blob/main/README.md)**

El README incluye:
- Requisitos previos (Node.js, MongoDB, etc.)
- Instalación de dependencias
- Configuración de variables de entorno
- Comandos para desarrollo y producción

---

## Documentación de Código (TypeDoc)

La documentación completa de las clases, interfaces y funciones del backend está disponible en TypeDoc:

**[📚 TypeDoc - Documentación de Código](https://upskill-team.github.io/Back-End-DSW/)**

TypeDoc proporciona:
- Referencia completa de todas las entidades y servicios
- Documentación de interfaces y tipos TypeScript
- Estructura de módulos y dependencias
- Ejemplos de uso de métodos y clases

---

## Integración Continua (CI/CD)

El proyecto utiliza **GitHub Actions** para ejecutar automáticamente los tests antes de incorporar nuevos cambios:

**[⚙️ Ejecución de Tests (GitHub Actions)](https://github.com/upskill-team/Back-End-DSW/actions/workflows/ci.yml)**

Cada pull request y push a las ramas principales ejecuta:
- Suite completa de tests unitarios e integración
- Validación de tipado TypeScript
- Análisis de linting y formato de código

### Cobertura de Código (Codecov)

Se integró **Codecov** para monitorear la cobertura de código y garantizar que las nuevas funcionalidades estén adecuadamente probadas, manteniendo un estándar de calidad:

**[📊 Reporte de Cobertura (Codecov)](https://app.codecov.io/gh/upskill-team/Back-End-DSW)**

Codecov permite:
- Visualizar la cobertura de tests por archivo y línea
- Prevenir la reducción de cobertura en nuevos PRs
- Identificar áreas del código sin testear
- Generar reportes históricos de calidad

---

## Documentación de la API

Para información sobre los endpoints, autenticación y formato de respuestas:

**[🚀 Documentación de la API](./api/README.md)**
