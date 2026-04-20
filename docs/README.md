# TPDSW-COM304 - Sistema de Gestión de Libros y Reseñas

**Trabajo Práctico de Desarrollo de Software - COM304**  
**Universidad Tecnologica Nacional**

---

## 🚀 Setup Inicial (Para desarrollo local)

### ⚡ Instalación rápida de dependencias

Después de clonar el repositorio, ejecuta este comando en la raíz del proyecto para instalar todas las dependencias:

```bash
npm run dev:setup
```

### 👨‍💻 Iniciar Backend y Frontend

**Opción más simple (recomendado):**
```bash
# Terminal 1 - Backend (instala deps automáticamente)
npm run dev:backend

# Terminal 2 - Frontend (instala deps automáticamente)
npm run dev:frontend
```

**Opción manual:**
```bash
# Backend
cd Backend
npm install
npm run dev

# Frontend (en otra terminal)
cd Frontend
npm install
npm run dev
```

---

## 🎥 Video Demo

https://youtu.be/OV2I2X6kp80

---

## 🔗 Links de Deploy

https://tpdsww.vercel.app/

Infraestructura:

Frontend con Vercel, Backend con Render y bdd con Clever Cloud.

---

## 📄 Propuesta TP DSW

### 👥 Grupo

#### Integrantes
| Legajo | Nombre | Mail |
|--------|--------|------|
| 47791 | Gomez Manna, Joaquina Esperanza |  |
| 51095 | Carloni, Nahuel Iván |  |
| 50980 | Chacón, Agustina Celeste |  |
| 49938 | Mierez, Joaquín |  |

### 📚 Tema

#### Descripción
El sistema permitirá a los usuarios ingresar a la página web y observar diferentes reseñas de libros junto con recomendaciones categorizadas por géneros. Los usuarios podrán agregar reseñas con calificación (1-5 estrellas) y comentario, marcar libros como favoritos y guardarlos en su lista personal.

#### Modelo
[Modelo de Dominio](https://drive.google.com/file/d/10CZM5P55DNUaeEiIdEiqubp5iLLYt8Ha/view?usp=sharing)

### 🎯 Alcance Funcional

#### Alcance Mínimo

Regularidad:

| Req | Detalle |
|:-|:-|
| CRUD simple | 1. CRUD de Usuario<br>2. CRUD de Editorial - Se cambio a CRUD de Sagas<br>3. CRUD de Categoría - Se cambio a CRUD de Reseña<br>4. CRUD de Autor |
| CRUD dependiente | 1. Libro depende del Autor<br>2. Las Sagas dependen de los Libros. |
| Listado + Detalle | 1. Ingresando una categoría, se muestra un listado de libros coincidentes<br>2. Filtrado de libros por mayor cantidad de estrellas |
| CUU/Epic | 1. Listas de "Leído", "Ver más tarde", "Pendientes".<br>2. Reseñas de los Libros. |

#### Adicionales para Aprobación

| Req | Detalle |
|:-|:-|
| CRUD | 1. CRUD completo de todos los elementos |
| CRUD dependiente | 1. Todas las relaciones establecidas |
| CUU/Epic | 1. Implementar un sistema automático para revisar y moderar reseñas de usuarios usando alguna librería especifica.<br>2. Permitir a los usuarios reaccionar a reseñas (ej. likes)<br>3. Mostrar recomendaciones personalizadas<br>4. Implementar la funcionalidad de "seguir" para que los usuarios puedan seguir a otros y ver sus actividades o reseñas. |


## 📚 Documentación API

- Documentación API Backend: [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js 18+
- MySQL 14+ (o servicio gestionado)
- Redis (opcional, para sesiones)

Este proyecto tiene dos servicios principales en carpetas separadas: `Backend/` y `Frontend/`.
Cada uno expone scripts estándar en su `package.json` para instalar, ejecutar y testear.

Siguientes pasos (Windows / macOS / Linux):

1) Instalar dependencias en ambos subproyectos

```bash
cd Backend
npm install
cd ../Frontend
npm install
```

2) Configurar variables de entorno en la raiz del proyecto

3) Ejecutar migraciones y levantar el Backend

```bash
cd Backend
# Ejecutar migraciones (si aplica)
npm run migrate

#(seeds tambien si es necesario para la creación de sagas, categorías y los tres usuarios default)

# Levantar backend en modo desarrollo
npm run dev
```

4) Levantar el Frontend

```bash
cd ../Frontend
# Levantar frontend en modo desarrollo
npm run dev
```

5) Comandos útiles (tests y e2e)

```bash
# Backend unit tests
cd Backend
npm test

# Frontend unit tests
cd ../Frontend
npm test

# Frontend E2E (Playwright) - requiere Backend + Frontend corriendo
npx playwright install    # solo la primera vez
npx playwright test
```

Notas:
- Los scripts expuestos en `Backend/package.json` y `Frontend/package.json` siguen las convenciones de npm. Revisa esos archivos si necesitas comandos adicionales.
- En Windows usa PowerShell o la terminal recomendada; los ejemplos incluyen alternativas cuando difieren.

---

## 🧪 Testing

### Estructura de Tests

```
Backend/
└── src/__tests__/unit/
	├── moderation.service.test.ts    # Servicio de moderación de reseñas
	└── auth.middleware.test.ts       # Middleware de autenticación JWT

Frontend/
├── src/
│   ├── utils/
│   │   └── apiParser.test.ts         # Parsing de respuestas de API
│   └── componentes/
│       └── SearchBar.test.tsx        # Componente de barra de búsqueda
└── e2e/
	└── resena-flow.spec.ts           # Test E2E: Login → Crear Reseña → Verificar
```

| Suite | Tests | Estado |
|-------|-------|--------|
| Backend Unit Tests | 49 | ✅ Pasando |
| Frontend Unit Tests | 57 | ✅ Pasando |
| Frontend E2E Tests | 3 (Escenarios) | ✅ Pasando |
| **Total** | **109** | **✅ 100% Pasando** |

### Backend (Unit Tests)

```bash
cd Backend
npm install
npx vitest run src/__tests__/unit/ --reporter verbose
```

### Frontend (Unit Tests)

```bash
cd Frontend
npm install
npx vitest run --reporter verbose
```

### E2E (Playwright)

> **Requisitos previos:** el Backend y el Frontend deben estar corriendo.

```bash
# 1. Levantar el Backend (en una terminal aparte)
cd Backend
npm run start  # o npm run dev

# 2. Ejecutar los tests E2E desde Frontend
cd Frontend
npx playwright install          # solo la primera vez (descarga navegadores)
npx playwright test             # ejecuta los tests
npx playwright test --ui        # modo interactivo con UI
npx playwright show-report      # ver reporte HTML tras la ejecución

# Alternativa desde la raiz del repo (sin cambiar de carpeta)
npm run test:e2e:install        # solo la primera vez
npm run test:e2e                # ejecuta los tests
npm run test:e2e:ui             # modo interactivo con UI
```

> **Importante:** evitar `npx playwright test` en la raiz del repositorio, porque puede instalar/usar otra version de Playwright y mezclar runners.

> **Nota:** Los tests E2E tienen un timeout extendido de **120 segundos** para permitir la ejecución en entornos con carga alta o servidores de desarrollo más lentos.

Nota sobre `resena-flow.spec.ts`:
- Usa la cuenta demo fija `demo@biblioteca.com` / `Demo123!`.
- Antes del flujo principal, verifica si esa cuenta puede iniciar sesión.
- Si no existe, intenta crearla automáticamente y luego reintenta el login.


La config de Playwright (`Frontend/playwright.config.ts`) levanta automáticamente el dev server del Frontend en `http://localhost:5173` si no está corriendo.

### Con cobertura

```bash
# Backend
cd Backend
npx vitest run --coverage

# Frontend
cd Frontend
npx vitest run --coverage
```

> Los reportes de cobertura se generan en `coverage/` (ignorados por `.gitignore`).

### Convenciones de Tests

- **Patrón AAA**: Arrange → Act → Assert en cada test.
- **Mocks**: `vi.mock()` para dependencias externas (JWT, Sentiment, localStorage, APIs).
- **Limpieza**: `afterEach` con `vi.restoreAllMocks()` o `localStorage.clear()`.
- **Nomenclatura**: `describe('función()')` → `it('debe + comportamiento esperado')`.
- **Frameworks**: Vitest para unit tests, Playwright para E2E.

### Qué cubre cada test

| Área | Archivo | Tests | Cobertura |
|------|---------|-------|-----------|
| **Moderación** | `moderation.service.test.ts` | 34 | Profanidad, spam, toxicidad, scoring, cleanText |
| **Auth Middleware** | `auth.middleware.test.ts` | 15 | JWT válido/inválido, token expirado, payload |
| **API Parser** | `apiParser.test.ts` | 49 | Parsing de respuestas (libros, reseñas, autores, sagas, paginación) |
| **SearchBar** | `SearchBar.test.tsx` | 8 | Render, props, input, sugerencias, accesibilidad |
| **E2E** | `resena-flow.spec.ts` | 3 | Login → Navegar a libro del seed → Crear Reseña → Login inválido → Protección de rutas |

---

## 🏗️ Arquitectura

```
Backend/
├── src/
│   ├── entities/          # Modelos de datos (MikroORM)
│   ├── repositories/      # Acceso a datos
│   ├── services/          # Lógica de negocio
│   ├── controllers/       # Endpoints REST
│   ├── middleware/        # Auth, validación, errores
│   ├── routes/            # Definición de rutas
│   └── __tests__/         # Tests automatizados

Frontend/
├── src/
│   ├── componentes/       # Componentes UI reutilizables
│   ├── paginas/           # Vistas/pages
│   ├── services/          # Llamadas a API
│   ├── hooks/             # Custom hooks
│   ├── contexts/          # Estado global
│   └── __tests__/         # Tests unitarios
└── e2e/                   # Tests end-to-end (Playwright)
```

---

**Última actualización:** 26 de Febrero de 2026

