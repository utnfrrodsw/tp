> **[Gestión del Proyecto](../README.md)** / **[Índice de Minutas](./README.md)** / 📄Establecimiento de estandares

# Minuta de Reunión: Establecimiento-de-estandares

**Fecha:** 2025-08-29
**Asistentes:**

- Equipo de desarrollo

**Etiquetas:** ![Gestión](https://img.shields.io/badge/GESTIÓN-fd7e14?style=for-the-badge) ![Técnico](https://img.shields.io/badge/TÉCNICO-007bff?style=for-the-badge) ![Decisión](https://img.shields.io/badge/DECISIÓN-28a745?style=for-the-badge)

---

## 📋 Agenda (Opcional)

_Un resumen de los puntos a tratar._

1. Definir una convención estándar para la creación y estructura de componentes de UI en el Frontend.
2. Establecer un estándar de documentación para el código del Backend (clases, funciones, flujos) compatible con herramientas de automatización como TypeDoc.
3. Acordar los próximos pasos para la implementación y revisión de estos estándares.

---

## 💬 Puntos Discutidos

- Se discutió la necesidad de tener una estructura predecible para los componentes de la interfaz de usuario para facilitar su mantenimiento y reutilización.
- Se analizó la importancia de una documentación de código robusta en el backend para mejorar la colaboración y acelerar la incorporación de nuevos desarrolladores.
- Se destacó que el estándar de documentación del backend debe ser compatible con JSDoc/TSDoc para que herramientas como TypeDoc puedan generar automáticamente la documentación del proyecto.

---

## ✅ Decisiones Clave

- **Frontend:** Se adoptará una convención de escritura y parametrizacion de componentes 
    
- **Backend:** Se utilizará el estándar **TSDoc (para TypeScript) / JSDoc (para JavaScript)** para documentar todo el código. Esta decisión garantiza la compatibilidad con herramientas de generación automática de documentación como TypeDoc.
    
**Implementación:** 
- Se crearán archivos markdown en el FrontEnd describiendo el **standard para creacion de componentes**.
- Se crearan archivos markdown en el BackEnd describiendo el **standard para la documentacion y la descripcion de flujos del proyecto**.

---

## 💡 Discusiones Técnicas (Opcional)

### Convención para Componentes de UI (Frontend)

**Contexto:**  
Necesitamos una forma estandarizada de nombrar, estructurar y definir componentes en nuestro proyecto frontend para evitar inconsistencias y facilitar la escalabilidad.

**Decisión:**  
Se ha decidido seguir una estructura de archivos y una convención de nomenclatura específicas para cada componente, ver [Estandar para la documentacion del FrontEnd](docs/gestion/estandares/estandar-documentacion-FrontEnd.md).

**Justificación:**  
Esta estructura aísla las responsabilidades de cada componente, facilita las pruebas y la documentación visual con Storybook, y evita colisiones de estilos gracias al uso de módulos CSS. Es una práctica ampliamente adoptada en la industria que ha demostrado ser eficaz.


### Estándar de Documentación (Backend)

**Contexto:**  
El backend requiere una documentación clara para que cualquier desarrollador pueda entender rápidamente el propósito de una clase, la funcionalidad de un método y los flujos de datos. Esta documentación debe ser "leíble" por herramientas automáticas.

**Decisión:**  
Se implementará la sintaxis de TSDoc/JSDoc en todo el código del backend, ver [Estandar para la documentacion del BackEnd](docs/gestion/estandares/estandar-documentacion-BackEnd.md).

**Justificación:**  
TSDoc/JSDoc es el estándar de facto en el ecosistema de TypeScript/JavaScript. Herramientas como TypeDoc, e incluso los propios editores de código como VS Code, lo utilizan para proporcionar autocompletado y análisis estático, mejorando drásticamente la experiencia de desarrollo y la calidad del código.

---

## 🚀 Acciones a Seguir (Opcional)

_Tabla resumen con las tareas concretas, responsables y plazos._

| Tarea                                                   | Responsable(s)                     | Fecha Límite | Estado      |
| ------------------------------------------------------- | ---------------------------------- | ------------ | ----------- |
| Configurar TypeDoc en el pipeline de CI/CD              | [Nombre del responsable de DevOps] | 2025-09-12   | ⏳ Pendiente |
| Realizar sesión de revisión de estándares con el equipo | Todos                              | 2025-09-15   | ⏳ Pendiente |
