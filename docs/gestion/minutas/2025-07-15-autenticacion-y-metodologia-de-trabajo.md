> **[Gestión del Proyecto](../README.md)** / **[Índice de Minutas](./README.md)** / 📄 Autenticación, Servicios y Metodología

# Minuta de Reunión: Autenticación, Servicios y Metodología de Trabajo

**Fecha:** 2025-07-15
**Asistentes:**

- Carlos Gugliermino
- Nicolás Pedemonte
- Luca Trincavelli
- Franco Zariaga

**Etiquetas:** ![Gestión](https://img.shields.io/badge/GESTIÓN-fd7e14?style=for-the-badge) ![Técnico](https://img.shields.io/badge/TÉCNICO-007bff?style=for-the-badge) ![Decisión](https://img.shields.io/badge/DECISIÓN-28a745?style=for-the-badge) ![Arquitectura](https://img.shields.io/badge/ARQUITECTURA-6f42c1?style=for-the-badge) ![Seguridad](https://img.shields.io/badge/SEGURIDAD-dc3545?style=for-the-badge) ![Backend](https://img.shields.io/badge/BACKEND-343a40?style=for-the-badge)

---

## 📋 Agenda

1.  Diseño del flujo de autenticación (Login y Registro).
2.  Definición de la arquitectura de la capa de servicios.
3.  Definición de la metodología de trabajo y flujo de Git.
4.  Coordinación del contrato de la API con el equipo de Frontend.

---

## 💬 Puntos Discutidos

- Se abordó el requisito de implementar un sistema de autenticación, decidiendo por un flujo basado en JWT.
- Para mejorar la organización del código, se propuso crear una capa de servicios para encapsular la lógica de negocio.
- Se discutió la necesidad de estandarizar el proceso de desarrollo para mejorar la colaboración y se recomendó la adopción de **GitFlow**.

---

## ✅ Decisiones Clave

- Se implementará un flujo de autenticación basado en **JWT**.
- Se crea una **capa de servicios** para abstraer la lógica de negocio de los controladores.
- Se aprueba la adopción del modelo de branching **GitFlow**. Se utilizarán ramas `feature/`, `bugfix/`, `develop` y `main` hasta el momento.
- Se define el contrato de la API para `/login` y `/register`.

---

## 🚀 Acciones a Seguir

| Tarea                                                       | Responsable(s)  | Fecha Límite |    Estado     |
| :---------------------------------------------------------- | :-------------- | :----------: | :-----------: |
| Implementar el servicio y las rutas de autenticación        | Luca, Nicolás   |  2025-07-16  | ✅ Completado |
| Crear la capa de servicios para la entidad `Course`         | Carlos          |  2025-07-16  | ✅ Completado |
| Documentar y comenzar a aplicar el flujo de trabajo GitFlow | Franco, Nicolás |  2025-08-11  | ✅ Completado |
