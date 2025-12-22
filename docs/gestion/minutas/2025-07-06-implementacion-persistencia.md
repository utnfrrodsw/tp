> **[Gestión del Proyecto](../README.md)** / **[Índice de Minutas](./README.md)** / 📄 Implementación de Persistencia y Refactorización

# Minuta de Reunión: Implementación de Persistencia y Refactorización

**Fecha:** 2025-07-06
**Asistentes:**

- Carlos Gugliermino
- Nicolás Pedemonte
- Luca Trincavelli
- Franco Zariaga

**Etiquetas:** ![Técnico](https://img.shields.io/badge/TÉCNICO-007bff?style=for-the-badge) ![Decisión](https://img.shields.io/badge/DECISIÓN-28a745?style=for-the-badge) ![Arquitectura](https://img.shields.io/badge/ARQUITECTURA-6f42c1?style=for-the-badge) ![Refactorización](https://img.shields.io/badge/REFACTORIZACIÓN-ffc107?style=for-the-badge) ![Backend](https://img.shields.io/badge/BACKEND-343a40?style=for-the-badge)

---

## 📋 Agenda

1.  Selección de ORM y base de datos persistente.
2.  Plan de refactorización de los CRUDs existentes.
3.  Unificación de nomenclatura de entidades entre el modelo y el código.

---

## 💬 Puntos Discutidos

- Se discutió la necesidad de implementar la persistencia de datos para cumplir con los requisitos técnicos.
- Se evaluaron diferentes ORMs y servicios de base de datos en la nube.
- Se destacó que la entidad `Solicitud` se había implementado en el código como "Applications". Se propuso estandarizar el nombre en inglés a **"Appeal"** para mayor claridad.

---

## ✅ Decisiones Clave

- Se adopta **MikroORM** como ORM y **MongoDB Atlas** como servicio de base de datos.
- Se aprueba la refactorización de todos los CRUDs para utilizar la nueva capa de persistencia.
- La entidad "Applications" en el código se renombra oficialmente a **"Appeal"**.

---

## 💡 Discusiones Técnicas: Selección del Stack de Persistencia

**Contexto:**
La consigna exige el uso de una base de datos persistente externa y un ORM/ODM. Se debían evaluar las opciones más compatibles con TypeScript.

**Decisión:**
Se implementará **MikroORM** conectado a una instancia de **MongoDB Atlas**.

**Justificación y Comparativa**

> **ORM / ODM**
> | Criterio | **![MikroORM](https://img.shields.io/badge/MikroORM-6F42C1?style=for-the-badge) (✅ Elección)** | ![TypeORM](https://img.shields.io/badge/TypeORM-E8373D?style=for-the-badge) | ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white) |
> | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :--------------------------- | :-------------------------------------- |
> | **Enfoque** | Data Mapper. Fomenta el desacoplamiento. | Active Record / Data Mapper. | Generador de clientes de base de datos. |
> | **Razón de la elección** | **Su enfoque en el patrón Data Mapper se alinea perfectamente con una arquitectura en capas, promoviendo un código más limpio.** |

> **Bases de Datos**
> | Criterio | **![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) (✅ Elección)** | ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white) |
> | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------- |
> | **Modelo de Datos** | Orientado a Documentos (BSON/JSON). | Relacional (Tablas con filas y columnas). |
> | **Esquema** | Flexible y dinámico. No requiere una estructura fija. | Rígido. Requiere definir tablas y relaciones de antemano. |
> | **Sinergia con JS/TS** | Muy alta. Los documentos se mapean nativamente a objetos. | Buena, a través de ORMs que realizan la traducción. |
> | **Razón de la elección** | **Su modelo de datos es extremadamente intuitivo para un backend en Node.js. La flexibilidad del esquema es ideal para un proyecto en desarrollo donde los requisitos pueden evolucionar, permitiendo un desarrollo más ágil.** |

---

## 🚀 Acciones a Seguir

| Tarea                                                          | Responsable(s)        | Fecha Límite |    Estado     |
| :------------------------------------------------------------- | :-------------------- | :----------: | :-----------: |
| Integrar MikroORM y conectar con MongoDB Atlas                 | Franco, Luca, Nicolás |  2025-07-07  | ✅ Completado |
| Refactorizar todos los CRUDs existentes para usar persistencia | Todos                 |  2025-07-07  | ✅ Completado |
| Renombrar "Applications" a "Appeal" y solucionar bugs          | Luca, Nicolás         |  2025-08-08  | ✅ Completado |
