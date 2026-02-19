<h1 align="center">🎟️ TicketApp: Sistema de Venta de Entradas</h1>

<p align="center">
  <strong>Propuesta de Trabajo Práctico - Desarrollo de Sistemas Web (DSW)</strong>
</p>

<p align="center">
  <a href="https://github.com/valenpeppi/FrontEnd-Venta-de-Entradas">
    <img src="https://img.shields.io/badge/Repositorio-Frontend-blue?style=for-the-badge&logo=react" alt="Frontend Repo" />
  </a>
  <a href="https://github.com/valenpeppi/BackEnd-Venta-de-Entradas">
    <img src="https://img.shields.io/badge/Repositorio-Backend-green?style=for-the-badge&logo=spring" alt="Backend Repo" />
  </a>
  <br>
  <a href="https://github.com/valenpeppi/tp/pulls">
    <img src="https://img.shields.io/badge/Estado-Pull%20Requests-orange?style=flat-square" alt="PRs" />
  </a>
</p>

<hr>

<div align="center">

## 👥 Equipo de Desarrollo

| Legajo | Integrante | Rol / Github |
| :---: | :--- | :--- |
| **52588** | **Peppino, Valentín** | [@valenpeppi](https://github.com/valenpeppi) |
| **52211** | **Santinelli, Agustín** | [@agussantinelli](https://github.com/agussantinelli) |
| **52425** | **Zabaleta, Gianlucas** | [@gianzaba](https://github.com/gianzaba) |
| **52398** | **Ratti, Martín** | [@martin-ratti](https://github.com/martin-ratti) |

</div>

---

## 📖 Descripción del Proyecto

La plataforma es un sistema integral para la gestión y venta de entradas a eventos. El flujo de negocio abarca desde la solicitud de un evento por parte de un organizador hasta la confirmación de la compra por parte del usuario final.

### 🔄 Flujo Principal

1.  📝 **Solicitud y Creación:** Los organizadores solicitan crear un evento eligiendo un estadio precargado. La solicitud inicia en estado `Pendiente`.
2.  🛡️ **Aprobación:** Un administrador revisa y aprueba el evento. Este pasa a estado `Pendiente de Publicación`.
3.  🚀 **Publicación:** El organizador decide cuándo hacer visible el evento para todos los usuarios.
4.  🔍 **Exploración:** Los eventos se organizan por tipo para facilitar la búsqueda, ofreciendo detalles completos.

### 🛒 Experiencia de Compra

Para comprar, el usuario debe estar registrado. El proceso se adapta a la infraestructura del estadio:

* **🏟️ Estadios Numerados:** Selección de sector + selección de asiento específico en mapa interactivo.
* **🎪 Estadios No Numerados:** Selección directa del sector deseado.

> ✅ Al confirmar el pago, se genera un resumen detallado de la transacción.

---

## 🏗️ Modelo de Dominio

<div align="center">
  <img width="880" alt="Modelo de Dominio" src="https://github.com/user-attachments/assets/53e7d7cd-24cb-44e9-a53b-869a42f4ebba" />
  <br><br>
  <a href="https://app.diagrams.net/#G1JQ4jZBuJwJ3PSq4Bxjy0-jp5qHoPxyZK#%7B%22pageId%22%3A%22C5RBs43oDa-KdzZeNtuy%22%7D">
    <b>🔗 Ver Diagrama Interactivo en Draw.io</b>
  </a>
</div>

---

## 🎯 Alcance Funcional

### 🔹 1. Alcance Mínimo (Regularidad)

| Requisito | Detalle Funcional |
| :--- | :--- |
| **CRUD Simple** | 1. Organizador<br>2. Usuario<br>3. Mensaje<br>4. Evento |
| **CRUD Dependiente** | 1. Precio *(depende de Sector y Evento)*<br>2. Evento *(depende de Lugar y TipoEvento)*<br>3. Sector *(depende de Lugar)* |
| **Listados y Detalle** | **Por Nombre:** Muestra nombre, descripción, precio "desde" y fecha.<br>↳ *Detalle:* Estado, tipo, lugar, sectores y si es numerado/no numerado.<br><br>**Por Tipo:** Muestra nombre e imagen.<br>↳ *Detalle:* Muestra datos completos igual al anterior. |
| **CUU / Epic** | 1. **Comprar Entradas:** Flujo numerado (mapa de asientos) y no numerado.<br>2. **Gestión de Eventos:** Crear (Organizador) → Aprobar (Admin) → Publicar. |

### 🔹 2. Aprobación Directa (Adicionales)

| Requisito | Detalle Funcional |
| :--- | :--- |
| **CRUDs Avanzados** | 1. Usuario <br>2. Entrada <br>3. Evento <br>4. Sector<br>5. Venta <br>6. Precio <br>7. Lugar <br>8. TipoEvento<br>9. Butaca <br>10. LineaVenta <br>11. Mensaje|
| **CUU / Epic** | 1. Crear evento completo.<br>2. Aprobar o rechazar eventos pendientes.<br>3. Destacar un evento en la home.<br>4. Ciclo completo de compra de entrada. |

### 🔹 3. Alcance Voluntario (Nice to have)

| Categoría | Funcionalidad |
| :--- | :--- |
| **Búsqueda** | Filtros combinados por descripción parcial y tipo de evento. |
| **Usuario** | 1. Asistente virtual de guiado.<br>2. Historial de compras con descarga de tickets (PDF/QR). |
| **Información** | 1. Centro de Ayuda / FAQ.<br>2. Sección "Sobre TicketApp".<br>3. Términos y condiciones. |

---

<div align="center">
  <sub>Desarrollado para la cátedra de Desarrollo de Sistemas Web - 2025</sub>
</div>
