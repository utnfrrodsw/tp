# 📘 Guía Completa del Backend - BookCode

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Base de Datos y Entidades](#base-de-datos-y-entidades)
6. [Sistema de Autenticación](#sistema-de-autenticación)
7. [APIs y Endpoints](#apis-y-endpoints)
8. [Servicios Especiales](#servicios-especiales)
9. [Sistema de Caché](#sistema-de-caché)
10. [Middlewares](#middlewares)
11. [Flujo de una Petición](#flujo-de-una-petición)
12. [Preguntas de Examen](#preguntas-de-examen)

---

## 📖 Descripción General

**BookCode** es una plataforma web de reseñas y recomendaciones de libros. El backend está construido con **Node.js**, **Express** y **TypeScript**, usando **MikroORM** como ORM para gestionar una base de datos **MySQL**.

### ¿Qué hace el backend?
- Gestiona usuarios (registro, login, perfiles)
- Almacena y administra libros, autores, editoriales, categorías y sagas
- Permite crear reseñas con sistema de moderación automática
- Gestiona listas personalizadas y favoritos
- Implementa un sistema de recomendaciones inteligente
- Integra APIs externas (Google Books, OpenLibrary) para enriquecer datos
- Sistema de caché con Redis para mejorar rendimiento

---

## 🏗️ Arquitectura del Sistema

El backend sigue una arquitectura **MVC modificada** (Modelo-Vista-Controlador):

```
┌─────────────┐
│   Cliente   │ (React Frontend - Puerto 5173)
└──────┬──────┘
       │ HTTP Request
       ↓
┌─────────────────────────────────────────┐
│          Express Server (Puerto 3000)    │
│  ┌───────────────────────────────────┐  │
│  │      Middlewares (CORS, JWT)      │  │
│  └───────────────┬───────────────────┘  │
│                  ↓                       │
│  ┌───────────────────────────────────┐  │
│  │      Rutas (Routes)               │  │
│  │  /api/auth, /api/libro, etc.      │  │
│  └───────────────┬───────────────────┘  │
│                  ↓                       │
│  ┌───────────────────────────────────┐  │
│  │   Controladores (Controllers)     │  │
│  │   Lógica de negocio               │  │
│  └───────────────┬───────────────────┘  │
│                  ↓                       │
│  ┌───────────────────────────────────┐  │
│  │      Servicios (Services)         │  │
│  │   Lógica compleja, APIs externas  │  │
│  └───────────────┬───────────────────┘  │
│                  ↓                       │
│  ┌───────────────────────────────────┐  │
│  │      MikroORM (ORM)               │  │
│  └───────────────┬───────────────────┘  │
└──────────────────┼───────────────────────┘
                   ↓
        ┌──────────────────┐
        │   MySQL Database │
        └──────────────────┘
        
        ┌──────────────────┐
        │   Redis Cache    │
        └──────────────────┘
```

---

## 🛠️ Tecnologías Utilizadas

### Core
- **Node.js** (v18+): Runtime de JavaScript
- **Express**: Framework web para crear APIs REST
- **TypeScript**: JavaScript con tipado estático

### Base de Datos
- **MySQL**: Base de datos relacional
- **MikroORM**: ORM (Object-Relational Mapping) para TypeScript
- **Redis**: Sistema de caché en memoria

### Autenticación y Seguridad
- **jsonwebtoken (JWT)**: Tokens de autenticación
- **bcrypt**: Hash de contraseñas
- **CORS**: Control de acceso entre orígenes

### Servicios Especiales
- **Sentiment**: Análisis de sentimiento en textos
- **bad-words**: Filtro de palabras ofensivas
- **axios**: Cliente HTTP para APIs externas
- **natural**: Procesamiento de lenguaje natural

### APIs Externas
- **Google Books API**: Búsqueda de libros y autores
- **OpenLibrary API**: Enriquecimiento de datos de autores

---

## 📁 Estructura de Carpetas

```
Backend/
├── src/
│   ├── app.ts              # Configuración de Express y rutas
│   ├── index.ts            # Punto de entrada, inicializa ORM y servidor
│   ├── mikro-orm.config.ts # Configuración de base de datos
│   ├── redis.ts            # Configuración de Redis (con modo mock)
│   │
│   ├── entities/           # Modelos de datos (Tablas de BD)
│   │   ├── usuario.entity.ts
│   │   ├── libro.entity.ts
│   │   ├── autor.entity.ts
│   │   ├── resena.entity.ts
│   │   ├── lista.entity.ts
│   │   ├── favorito.entity.ts
│   │   ├── categoria.entity.ts
│   │   ├── editorial.entity.ts
│   │   ├── saga.entity.ts
│   │   ├── contenidoLista.entity.ts
│   │   ├── reaccion.entity.ts
│   │   ├── seguimiento.entity.ts
│   │   ├── actividad.entity.ts
│   │   ├── permiso.entity.ts
│   │   └── ratingLibro.entity.ts
│   │
│   ├── controllers/        # Lógica de endpoints
│   │   ├── auth.controller.ts
│   │   ├── libro.controller.ts
│   │   ├── autor.controller.ts
│   │   ├── resena.controller.ts
│   │   ├── recomendacion.controller.ts
│   │   └── ... (23 controladores en total)
│   │
│   ├── services/          # Lógica compleja y servicios especializados
│   │   ├── auth.service.ts
│   │   ├── moderation.service.ts
│   │   ├── recomendacion.service.ts
│   │   ├── autor.service.ts
│   │   ├── googleBooks.service.ts
│   │   └── ... (9 servicios)
│   │
│   ├── middleware/        # Funciones intermedias
│   │   ├── auth.middleware.ts      # Verificación JWT
│   │   ├── admin.middleware.ts     # Verificación de rol admin
│   │   └── listaAuth.middleware.ts # Verificación de dueño de lista
│   │
│   ├── routes/            # Definición de rutas
│   │   ├── auth.routes.ts
│   │   ├── libro.routes.ts
│   │   └── ... (22 archivos de rutas)
│   │
│   ├── scripts/           # Scripts utilitarios
│   │   └── create-admin-user.ts
│   │
│   └── shared/            # Utilidades compartidas
│
├── migrations/            # Migraciones de base de datos
│   ├── Migration20251103000000_add_autor_indexes.ts
│   ├── Migration20251103194440_add_external_ids_to_autor.ts
│   └── ... (15 migraciones)
│
├── package.json           # Dependencias y scripts
├── tsconfig.json          # Configuración de TypeScript
└── .env                   # Variables de entorno
```

---

## 🗄️ Base de Datos y Entidades

### Entidades Principales

#### 1. **Usuario** (`usuario.entity.ts`)
Representa a los usuarios de la plataforma.

**Campos principales:**
- `id`: Identificador único
- `email`: Correo electrónico (único)
- `username`: Nombre de usuario (único)
- `password`: Contraseña hasheada con bcrypt
- `rol`: 'usuario' o 'admin'
- `nombre`, `biografia`, `ubicacion`, `genero`, `avatar`: Perfil adicional
- `refreshToken`: Token para refrescar sesión

**Funcionalidad especial:**
```typescript
// Hook que hashea la contraseña automáticamente antes de guardar
@BeforeCreate()
@BeforeUpdate()
async hashPasswordHook() {
  if (this.password && !this.password.startsWith('$2b$')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
```

#### 2. **Libro** (`libro.entity.ts`)
Almacena información de libros.

**Campos:**
- `id`, `externalId`: Identificadores
- `nombre`, `slug`: Nombre y URL-friendly
- `sinopsis`, `imagen`, `enlace`: Información del libro
- `source`: Origen (Google Books, OpenLibrary, etc.)

**Relaciones:**
- `autor`: ManyToOne (muchos libros → un autor)
- `categoria`: ManyToOne (muchos libros → una categoría)
- `editorial`: ManyToOne (muchos libros → una editorial)
- `saga`: ManyToOne (muchos libros → una saga)
- `resenas`: OneToMany (un libro → muchas reseñas)

#### 3. **Autor** (`autor.entity.ts`)
Almacena autores de libros.

**Campos únicos:**
- `nombre`, `apellido`: Con índices para búsqueda rápida
- `foto`, `biografia`: Información adicional
- `googleBooksId`, `openLibraryKey`: IDs externos (evitan duplicados)

**Constraint único:** No puede haber dos autores con el mismo nombre y apellido.

#### 4. **Resena** (`resena.entity.ts`)
Sistema de reseñas con moderación automática.

**Campos:**
- `comentario`: Texto de la reseña
- `estrellas`: Calificación (1-5)
- `estado`: PENDING, APPROVED, FLAGGED, REJECTED

**Moderación automática:**
- `moderationScore`: Puntuación (0-100)
- `moderationReasons`: Razones del análisis
- `autoModerated`: Si fue moderada automáticamente
- `autoRejected`: Si fue rechazada automáticamente
- `rejectionReason`: Motivo del rechazo

#### 5. **Lista** (`lista.entity.ts`)
Listas personalizadas de libros.

**Tipos:**
- `favoritos`: Lista de favoritos del usuario
- `leidos`: Libros ya leídos
- `leyendo`: Libros en progreso
- `quiero_leer`: Lista de deseos
- `custom`: Listas personalizadas

#### 6. **Favorito** (`favorito.entity.ts`)
Relación usuario-libro para marcar favoritos.

#### 7. **ContenidoLista** (`contenidoLista.entity.ts`)
Relaciona libros con listas.

**Campo especial:**
- `orden`: Para ordenamiento personalizado (drag & drop)

#### 8. **Actividad** (`actividad.entity.ts`)
Registro de acciones de usuarios (para feed de actividad).

**Tipos de actividad:**
- Crear reseña
- Agregar favorito
- Crear lista
- Seguir usuario

#### 9. **Seguimiento** (`seguimiento.entity.ts`)
Relación seguidor-seguido entre usuarios.

#### 10. **RatingLibro** (`ratingLibro.entity.ts`)
Calificaciones de libros (1-5 estrellas).

---

## 🔐 Sistema de Autenticación

### JWT (JSON Web Tokens)

El sistema usa **tokens JWT** para autenticar usuarios.

#### Flujo de Autenticación:

```
1. Usuario se registra o inicia sesión
   ↓
2. Backend verifica credenciales
   ↓
3. Si es válido, genera dos tokens:
   - accessToken (corta duración: 15min)
   - refreshToken (larga duración: 7 días)
   ↓
4. Frontend guarda tokens en localStorage
   ↓
5. En cada petición, envía accessToken en header:
   Authorization: Bearer <token>
   ↓
6. Middleware verifica token antes de procesar petición
```

#### Código del Middleware JWT:

```typescript
// src/middleware/auth.middleware.ts
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Extraer token
  
  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret); // Verificar token
    req.user = decoded; // Guardar usuario en request
    next(); // Continuar
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

#### Roles de Usuario:

**USUARIO:** Permisos básicos
- Crear reseñas
- Crear listas
- Marcar favoritos

**ADMIN:** Permisos completos
- Todo lo de usuario
- Moderar reseñas
- Gestionar usuarios
- Crear/editar libros, autores, categorías

---

## 🌐 APIs y Endpoints

### Estructura de una Ruta:

```
/api/{recurso}/{acción}
```

### Endpoints Principales:

#### **Autenticación** (`/api/auth`)
- `POST /register` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión
- `POST /refresh` - Refrescar token
- `POST /logout` - Cerrar sesión

#### **Usuarios** (`/api/usuarios`)
- `GET /` - Listar usuarios
- `GET /:id` - Obtener usuario por ID
- `PUT /:id` - Actualizar perfil
- `DELETE /:id` - Eliminar usuario (admin)

#### **Libros** (`/api/libro`)
- `GET /` - Listar libros (con paginación)
- `GET /:id` - Detalle de libro
- `POST /` - Crear libro (admin)
- `PUT /:id` - Actualizar libro (admin)
- `DELETE /:id` - Eliminar libro (admin)
- `GET /nuevos` - Libros nuevos
- `GET /populares` - Libros más populares

#### **Autores** (`/api/autor`)
- `GET /` - Listar autores
- `GET /search` - Búsqueda híbrida (BD + APIs externas)
- `POST /` - Crear autor
- `GET /:id` - Detalle de autor

#### **Reseñas** (`/api/resena`)
- `GET /libro/:libroId` - Reseñas de un libro
- `POST /` - Crear reseña (con moderación automática)
- `PUT /:id` - Editar reseña
- `DELETE /:id` - Eliminar reseña
- `PUT /:id/approve` - Aprobar reseña (admin)
- `PUT /:id/reject` - Rechazar reseña (admin)

#### **Listas** (`/api/lista`)
- `GET /usuario/:usuarioId` - Listas de un usuario
- `POST /` - Crear lista
- `PUT /:id` - Actualizar lista
- `DELETE /:id` - Eliminar lista

#### **Favoritos** (`/api/favoritos`)
- `GET /usuario/:usuarioId` - Favoritos de un usuario
- `POST /` - Agregar favorito
- `DELETE /:id` - Quitar favorito

#### **Recomendaciones** (`/api/recomendaciones`)
- `GET /personalizadas/:usuarioId` - Recomendaciones basadas en gustos

#### **Feed** (`/api/feed`)
- `GET /:usuarioId` - Feed de actividad personalizado

#### **Estadísticas** (`/api/stats`)
- `GET /` - Estadísticas generales (para HeroSection)

---

## 🧠 Servicios Especiales

### 1. **ModerationService** (`moderation.service.ts`)

Modera automáticamente reseñas usando análisis de sentimiento y detección de lenguaje ofensivo.

**¿Qué hace?**
```typescript
analyzeReview(text: string, stars: number): ModerationResult
```

**Análisis que realiza:**
1. **Sentimiento del texto**: Positivo/Negativo usando librería `sentiment`
2. **Detección de palabras ofensivas**: Compara con lista de +50 palabras prohibidas
3. **Detección de spam**: Texto muy corto, repetitivo o sin sentido
4. **Inconsistencia**: Texto negativo con 5 estrellas (sospechoso)

**Resultado:**
```typescript
{
  isApproved: true/false,    // ¿Se aprueba automáticamente?
  score: 85,                 // Puntuación 0-100
  reasons: ["Sentimiento positivo", "Sin profanidad"],
  shouldAutoReject: false,   // ¿Rechazar automáticamente?
  flags: {
    toxicity: false,
    spam: false,
    negativeSentiment: false,
    profanity: false
  }
}
```

**Umbrales de decisión:**
- Score ≥ 70 → APPROVED
- Score < 40 → REJECTED (auto-rechazo)
- 40-70 → PENDING (revisión manual)

### 2. **RecomendacionService** (`recomendacion.service.ts`)

Sistema de recomendaciones personalizadas basado en filtrado colaborativo.

**¿Cómo funciona?**

1. **Analiza actividad del usuario:**
   - Libros favoritos
   - Reseñas con buena calificación (≥4 estrellas)

2. **Extrae preferencias:**
   - Categorías favoritas
   - Autores preferidos
   - Editoriales recurrentes

3. **Busca libros candidatos:**
   - Misma categoría
   - Mismo autor
   - Misma editorial
   - Excluye libros ya conocidos

4. **Calcula puntuación:**
   ```
   Score = (matchCategoria * 3) + (matchAutor * 2) + (matchEditorial * 1)
   ```

5. **Ordena y retorna** los mejores N libros

**Caché:** Las recomendaciones se cachean por 1 hora para mejorar rendimiento.

### 3. **AutorService** (`autor.service.ts`)

Gestiona autores con búsqueda híbrida y enriquecimiento de datos.

**Funciones clave:**

#### `reconcileGoogleBooksAuthor()`
Evita duplicados al agregar autores desde Google Books.

**Lógica:**
1. Busca por `googleBooksId`
2. Si no existe, busca por nombre + apellido
3. Si existe, actualiza con googleBooksId
4. Si no existe, crea nuevo autor

#### `reconcileOpenLibraryAuthor()`
Igual pero para autores de OpenLibrary.

**Búsqueda híbrida:**
- Primero busca en base de datos local
- Si no hay resultados, busca en Google Books API
- También busca en OpenLibrary API
- Retorna DTOs (objetos temporales) sin guardar en BD

### 4. **GoogleBooksService** (`googleBooks.service.ts`)

Integración con Google Books API.

**Funciones:**
- Buscar libros por título/autor
- Obtener detalles de libro por ID
- Buscar autores

### 5. **FeedService** (`feed.service.ts`)

Genera feed de actividad personalizado para cada usuario.

**¿Qué incluye?**
- Actividades de usuarios seguidos
- Reseñas recientes
- Nuevos favoritos
- Nuevas listas creadas

---

## 💾 Sistema de Caché

### Redis

**Ubicación:** `src/redis.ts`

**¿Qué es Redis?**
Sistema de almacenamiento en memoria (RAM) ultra-rápido para datos temporales.

**¿Para qué se usa?**
- Cachear recomendaciones (1 hora)
- Cachear búsquedas de autores (5 minutos)
- Reducir consultas a la base de datos

**Modo Mock:**
Si Redis no está configurado, el sistema usa un "mock" (simulación) que no hace nada pero permite que la app funcione.

```typescript
// Ejemplo de uso
const cacheKey = `recomendaciones:usuario:${usuarioId}`;

// Intentar leer del caché
const cached = await redis.get(cacheKey);
if (cached) {
  return JSON.parse(cached); // Retornar datos cacheados
}

// Si no hay caché, calcular y guardar
const datos = await calcularDatos();
await redis.set(cacheKey, JSON.stringify(datos), { EX: 3600 }); // TTL: 1 hora
return datos;
```

---

## 🛡️ Middlewares

### 1. **authenticateJWT**
Verifica que el usuario esté autenticado.

**Uso:**
```typescript
router.get('/ruta-protegida', authenticateJWT, controller);
```

### 2. **isAdmin**
Verifica que el usuario sea administrador.

**Uso:**
```typescript
router.delete('/libro/:id', authenticateJWT, isAdmin, controller);
```

### 3. **isListaOwner**
Verifica que el usuario sea dueño de la lista que intenta modificar.

### 4. **CORS**
Permite peticiones desde el frontend (localhost:5173/5174).

---

## 🔄 Flujo de una Petición

### Ejemplo: Crear una reseña

```
1. Frontend envía POST a /api/resena
   Body: { libroId: 5, comentario: "Excelente libro", estrellas: 5 }
   Headers: { Authorization: "Bearer <token>" }
   ↓
2. Express recibe petición
   ↓
3. Middleware CORS verifica origen
   ↓
4. Middleware authenticateJWT verifica token
   - Extrae usuario del token
   - Lo agrega a req.user
   ↓
5. Ruta /api/resena dirige a resena.controller.ts
   ↓
6. Controller obtiene datos del body
   ↓
7. Controller llama a ModerationService
   - Analiza sentimiento del comentario
   - Detecta palabras ofensivas
   - Calcula score de moderación
   ↓
8. Controller crea entidad Resena con MikroORM
   - Asigna estado según moderación
   - Guarda en base de datos
   ↓
9. Controller crea Actividad (feed)
   ↓
10. Controller retorna respuesta al frontend
    Response: { id: 123, estado: "approved", ... }
```

---

## ❓ Preguntas de Examen (Nivel Universitario)

### **Categoría: Arquitectura y Diseño**

#### P1: ¿Qué patrón arquitectónico implementa este backend y por qué?
**Respuesta:**
Implementa una **arquitectura MVC modificada** (Modelo-Vista-Controlador):
- **Modelo:** Entidades de MikroORM (`entities/`) que representan la base de datos
- **Vista:** El frontend React (separado del backend)
- **Controlador:** Controllers (`controllers/`) que manejan la lógica de negocio

**Modificación:** Se agregan **Servicios** (`services/`) para lógica compleja que no pertenece directamente a los controllers, siguiendo el principio de **Separación de Responsabilidades**.

**Ventajas:**
- Código más organizado y mantenible
- Fácil testing de componentes aislados
- Reutilización de lógica en servicios
- Escalabilidad del proyecto

---

#### P2: ¿Qué es MikroORM y qué ventajas ofrece sobre SQL puro?
**Respuesta:**
**MikroORM** es un ORM (Object-Relational Mapping) para TypeScript que mapea objetos de código a tablas de base de datos.

**Ventajas:**
1. **Type Safety:** TypeScript detecta errores en tiempo de compilación
2. **Abstracción:** No escribes SQL directamente, usas objetos
3. **Migraciones automáticas:** Genera migraciones al cambiar entidades
4. **Relaciones simplificadas:** Manejo automático de joins
5. **Prevención de SQL Injection:** Sanitización automática

**Ejemplo:**
```typescript
// SQL puro (vulnerable a SQL injection)
db.query(`SELECT * FROM usuario WHERE email = '${email}'`);

// MikroORM (seguro y tipado)
await em.findOne(Usuario, { email });
```

---

#### P3: ¿Por qué se usa Redis y qué sucede si no está disponible?
**Respuesta:**
**Redis** es una base de datos en memoria (RAM) usada como **sistema de caché**.

**Razones de uso:**
1. **Velocidad:** 100x más rápido que consultas a MySQL
2. **Reduce carga:** Menos consultas a la base de datos principal
3. **TTL automático:** Los datos expiran automáticamente

**Casos de uso en BookCode:**
- Recomendaciones personalizadas (1 hora de caché)
- Búsquedas de autores (5 minutos de caché)

**Modo fallback:**
Si Redis no está configurado, el sistema usa un **"mock"** que:
- No rompe la aplicación
- Simplemente no cachea nada
- Todas las consultas van directo a MySQL

```typescript
if (!redisUrl) {
  console.warn('Redis no disponible, usando modo mock');
  redis = { 
    get: async () => null, 
    set: async () => 'OK' 
  };
}
```

---

### **Categoría: Autenticación y Seguridad**

#### P4: ¿Cómo funciona el sistema de autenticación JWT en este proyecto?
**Respuesta:**
Se usa **JWT (JSON Web Token)** para autenticación **stateless** (sin sesiones en servidor).

**Flujo completo:**

1. **Login:**
   ```typescript
   POST /api/auth/login
   Body: { email, password }
   ```

2. **Verificación:**
   ```typescript
   const usuario = await em.findOne(Usuario, { email });
   const valid = await usuario.validatePassword(password);
   ```

3. **Generación de tokens:**
   ```typescript
   const accessToken = jwt.sign(
     { id: usuario.id, rol: usuario.rol },
     JWT_SECRET,
     { expiresIn: '15m' }
   );
   
   const refreshToken = jwt.sign(
     { id: usuario.id },
     REFRESH_SECRET,
     { expiresIn: '7d' }
   );
   ```

4. **Uso del token:**
   ```typescript
   // Frontend envía en cada petición:
   Headers: { Authorization: "Bearer <accessToken>" }
   ```

5. **Verificación en middleware:**
   ```typescript
   const token = req.headers.authorization.split(' ')[1];
   const decoded = jwt.verify(token, JWT_SECRET);
   req.user = decoded; // { id: 5, rol: 'usuario' }
   ```

**Ventajas sobre sesiones:**
- No requiere almacenamiento en servidor
- Escalable (múltiples servidores)
- Funciona con móviles y SPAs

---

#### P5: ¿Cómo se protegen las contraseñas en la base de datos?
**Respuesta:**
Se usa **bcrypt** para hacer **hashing** de contraseñas con **sal (salt)**.

**Proceso:**

1. **Al registrar usuario:**
   ```typescript
   @BeforeCreate()
   async hashPasswordHook() {
     const saltRounds = 10; // Factor de costo
     this.password = await bcrypt.hash(this.password, saltRounds);
   }
   ```

2. **En BD se guarda:**
   ```
   $2b$10$N9qo8uLOickgx2ZMRZoMye... (hash de 60 caracteres)
   ```

3. **Al verificar login:**
   ```typescript
   async validatePassword(plainPassword: string) {
     return bcrypt.compare(plainPassword, this.password);
   }
   ```

**¿Por qué es seguro?**
- **Irreversible:** No se puede obtener la contraseña original
- **Sal única:** Cada contraseña tiene una sal diferente
- **Lento intencionalmente:** Dificulta ataques de fuerza bruta
- **Resistente a rainbow tables:** Sal previene tablas precalculadas

**Nunca se debe:**
- Guardar contraseñas en texto plano
- Usar MD5 o SHA1 (ya no son seguros)
- Compartir claves de encriptación

---

#### P6: ¿Qué diferencia hay entre middleware `authenticateJWT` y `isAdmin`?
**Respuesta:**

**authenticateJWT:**
- Verifica que el usuario **esté logueado**
- Valida el token JWT
- Extrae información del usuario (`req.user`)
- Uso: Rutas que requieren login

**isAdmin:**
- Verifica que el usuario **tenga rol de administrador**
- Asume que `authenticateJWT` ya se ejecutó
- Verifica `req.user.rol === 'admin'`
- Uso: Rutas administrativas

**Orden correcto:**
```typescript
router.delete(
  '/libro/:id', 
  authenticateJWT,  // 1º Verifica login
  isAdmin,          // 2º Verifica rol admin
  controller        // 3º Ejecuta lógica
);
```

---

### **Categoría: Base de Datos y Relaciones**

#### P7: Explica la relación entre Libro, Autor y Categoria. ¿Qué tipo de relación es?
**Respuesta:**

**Libro → Autor: ManyToOne**
- Muchos libros pueden tener el mismo autor
- Un libro solo tiene un autor
- Libro tiene FK (foreign key) `autorId`

```typescript
@ManyToOne(() => Autor)
autor?: Autor;
```

**Libro → Categoria: ManyToOne**
- Muchos libros pueden estar en la misma categoría
- Un libro solo tiene una categoría
- Libro tiene FK `categoriaId`

```typescript
@ManyToOne(() => Categoria)
categoria?: Categoria;
```

**Diagrama:**
```
┌─────────┐       ┌─────────┐
│  Autor  │◄──────┤  Libro  │
└─────────┘  N:1  └─────────┘
                       │
                       │ N:1
                       ▼
                  ┌───────────┐
                  │ Categoria │
                  └───────────┘
```

**En SQL:**
```sql
CREATE TABLE libro (
  id INT PRIMARY KEY,
  nombre VARCHAR(255),
  autor_id INT, -- FK
  categoria_id INT, -- FK
  FOREIGN KEY (autor_id) REFERENCES autor(id),
  FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);
```

---

#### P8: ¿Qué es una migración y para qué sirve?
**Respuesta:**
Una **migración** es un archivo que define cambios en la estructura de la base de datos de forma versionada.

**¿Para qué sirve?**
1. **Control de versiones:** Historial de cambios en la BD
2. **Replicabilidad:** Aplicar mismos cambios en dev, test, prod
3. **Reversibilidad:** Hacer rollback si algo falla
4. **Colaboración:** Todo el equipo tiene la misma estructura

**Ejemplo de migración:**
```typescript
// Migration20251103000000_add_autor_indexes.ts
export class Migration extends Migration {
  async up(): Promise<void> {
    // Crear índice
    this.addSql('CREATE INDEX idx_autor_nombre ON autor (nombre);');
  }

  async down(): Promise<void> {
    // Revertir cambio
    this.addSql('DROP INDEX idx_autor_nombre ON autor;');
  }
}
```

**Comandos:**
```bash
npm run migration:create  # Crear migración
npm run migration:up      # Aplicar migraciones
npm run migration:down    # Revertir última migración
```

---

#### P9: ¿Qué es un índice en base de datos y cuándo usarlo?
**Respuesta:**
Un **índice** es una estructura de datos que mejora la velocidad de búsquedas en una tabla.

**Analogía:** Como el índice de un libro te permite encontrar temas sin leer todo.

**¿Cuándo crear índices?**
✅ **Sí crear en:**
- Columnas usadas en `WHERE`
- Columnas usadas en `JOIN`
- Columnas usadas en `ORDER BY`
- Foreign Keys
- Campos únicos (email, username)

❌ **No crear en:**
- Tablas muy pequeñas
- Columnas que cambian constantemente
- Columnas con pocos valores distintos (ej: género)

**En BookCode:**
```typescript
@Entity()
export class Autor {
  @Property()
  @Index() // ✅ Índice porque se busca por nombre
  nombre!: string;
  
  @Property()
  @Index()
  apellido!: string;
}
```

**Ventaja:**
```sql
-- Sin índice: Escanea toda la tabla (lento)
SELECT * FROM autor WHERE nombre = 'J.K.';

-- Con índice: Búsqueda directa (rápido)
-- Búsqueda O(log n) en lugar de O(n)
```

---

### **Categoría: Servicios y Lógica de Negocio**

#### P10: ¿Cómo funciona el sistema de moderación automática de reseñas?
**Respuesta:**
El **ModerationService** analiza reseñas usando múltiples criterios:

**1. Análisis de Sentimiento:**
```typescript
const sentiment = new Sentiment();
const analysis = sentiment.analyze(text);
// Retorna: { score: -3, comparative: -0.5 }
// Positivo: score > 0
// Negativo: score < 0
```

**2. Detección de Profanidad:**
```typescript
private profanityWords = new Set([
  'idiota', 'estúpido', 'mierda', 'puta', ...
]);

private containsProfanity(text: string): boolean {
  // Normaliza texto (acentos, símbolos)
  // Busca palabras completas
  return this.profanityWords.has(word);
}
```

**3. Detección de Spam:**
```typescript
// Es spam si:
if (text.length < 10) // Muy corto
if (/(.)\1{4,}/.test(text)) // Caracteres repetidos: "aaaaaaa"
if (allCaps && text.length > 20) // TODO EN MAYÚSCULAS
```

**4. Detección de Inconsistencia:**
```typescript
// Texto negativo con 5 estrellas = Sospechoso
if (sentimentScore < -2 && stars >= 4)
```

**5. Cálculo de Score:**
```typescript
let score = 100;
if (negativeSentiment) score -= 30;
if (profanity) score -= 40;
if (spam) score -= 50;
if (toxicity) score -= 20;
```

**6. Decisión:**
```typescript
if (score >= 70) return { estado: 'APPROVED' };
if (score < 40) return { estado: 'REJECTED', autoRejected: true };
return { estado: 'PENDING' }; // Revisión manual
```

---

#### P11: Explica el algoritmo de recomendaciones personalizadas.
**Respuesta:**
Usa **filtrado basado en contenido** (content-based filtering).

**Pasos del algoritmo:**

**1. Recopilar actividad del usuario:**
```typescript
const favoritos = await em.find(Favorito, { usuario: usuarioId });
const resenas = await em.find(Resena, { 
  usuario: usuarioId, 
  estrellas: { $gte: 4 } 
});
```

**2. Extraer preferencias:**
```typescript
const preferencias = {
  categorias: { 'Fantasía': 5, 'Ciencia Ficción': 3 },
  autores: { 'J.K. Rowling': 4, 'Tolkien': 3 },
  editoriales: { 'Penguin': 2 }
};
```

**3. Buscar candidatos:**
```typescript
// Libros de categorías favoritas
// Libros de autores favoritos
// Libros de editoriales frecuentes
// EXCLUYENDO libros ya conocidos
```

**4. Calcular puntuación:**
```typescript
function calcularScore(libro, preferencias) {
  let score = 0;
  
  // Categoría coincide: +3 puntos
  if (preferencias.categorias[libro.categoria]) {
    score += 3 * preferencias.categorias[libro.categoria];
  }
  
  // Autor coincide: +2 puntos
  if (preferencias.autores[libro.autor]) {
    score += 2 * preferencias.autores[libro.autor];
  }
  
  // Editorial coincide: +1 punto
  if (preferencias.editoriales[libro.editorial]) {
    score += 1 * preferencias.editoriales[libro.editorial];
  }
  
  return score;
}
```

**5. Ordenar y retornar:**
```typescript
return libros
  .sort((a, b) => b.score - a.score)
  .slice(0, 10); // Top 10
```

**Mejoras posibles:**
- Filtrado colaborativo (usuarios similares)
- Machine Learning con TensorFlow.js
- Considerar popularidad general

---

#### P12: ¿Qué son las "external IDs" en autores y por qué existen?
**Respuesta:**
Son identificadores únicos de autores en APIs externas para **evitar duplicados**.

**Problema sin external IDs:**
```typescript
// Usuario busca "J.K. Rowling" en Google Books
// Se crea: { nombre: "J.K.", apellido: "Rowling" }

// Otro usuario busca la misma autora
// Se crearía DUPLICADO: { nombre: "J.K.", apellido: "Rowling" }
```

**Solución con external IDs:**
```typescript
@Entity()
export class Autor {
  @Property({ unique: true })
  googleBooksId?: string; // "google_jk_rowling"
  
  @Property({ unique: true })
  openLibraryKey?: string; // "/authors/OL23919A"
}
```

**Flujo de reconciliación:**
```typescript
async reconcileGoogleBooksAuthor(nombre: string) {
  const googleId = `google_${nombre.toLowerCase()}`;
  
  // 1. Buscar por ID externo
  let autor = await em.findOne(Autor, { googleBooksId: googleId });
  
  if (!autor) {
    // 2. Buscar por nombre
    autor = await em.findOne(Autor, { nombre, apellido });
    
    if (autor) {
      // 3. Actualizar con ID externo
      autor.googleBooksId = googleId;
    } else {
      // 4. Crear nuevo
      autor = new Autor();
      autor.googleBooksId = googleId;
    }
  }
  
  return autor; // ✅ Sin duplicados
}
```

---

### **Categoría: Integración y APIs**

#### P13: ¿Cómo se integra Google Books API y qué datos se obtienen?
**Respuesta:**
La integración se hace con **axios** (cliente HTTP) en `googleBooks.service.ts`.

**Endpoint principal:**
```
GET https://www.googleapis.com/books/v1/volumes?q={query}&key={API_KEY}
```

**Ejemplo de petición:**
```typescript
async searchBooks(query: string) {
  const url = `https://www.googleapis.com/books/v1/volumes`;
  const params = {
    q: query,
    key: process.env.GOOGLE_BOOKS_API_KEY,
    maxResults: 20
  };
  
  const response = await axios.get(url, { params });
  return response.data.items; // Array de libros
}
```

**Estructura de respuesta:**
```json
{
  "items": [
    {
      "id": "wrOQLV6xB-wC",
      "volumeInfo": {
        "title": "Harry Potter y la piedra filosofal",
        "authors": ["J.K. Rowling"],
        "description": "Un niño descubre que es mago...",
        "imageLinks": {
          "thumbnail": "http://..."
        },
        "categories": ["Ficción juvenil"],
        "pageCount": 223,
        "publishedDate": "1997-06-26"
      }
    }
  ]
}
```

**Datos que se guardan:**
- Título → `libro.nombre`
- Autores → Se crea/actualiza en tabla `autor`
- Descripción → `libro.sinopsis`
- Portada → `libro.imagen`
- Categoría → Se crea/actualiza en tabla `categoria`

**Rate limiting:**
Google Books tiene límite de 1000 requests/día en tier gratuito.

---

#### P14: ¿Qué es CORS y por qué es necesario configurarlo?
**Respuesta:**
**CORS** (Cross-Origin Resource Sharing) es un mecanismo de seguridad que controla qué dominios pueden acceder a tu API.

**Problema sin CORS:**
```
Frontend: http://localhost:5173
Backend:  http://localhost:3000

❌ Browser bloquea peticiones entre diferentes orígenes (seguridad)
```

**Solución:**
```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
```

**¿Qué hace?**
- Agrega headers HTTP que permiten peticiones cross-origin
- `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Credentials: true`

**Sin CORS configurado:**
```
Browser console:
❌ CORS policy: No 'Access-Control-Allow-Origin' header
```

**Con CORS configurado:**
```
✅ Peticiones funcionan normalmente
```

**En producción:**
```typescript
cors({
  origin: 'https://bookcode.com', // Solo tu dominio
  credentials: true
});
```

---

### **Categoría: Performance y Optimización**

#### P15: ¿Qué estrategias de optimización implementa el backend?
**Respuesta:**

**1. Caché con Redis:**
```typescript
// Evita consultas repetidas a MySQL
const cached = await redis.get('recomendaciones:usuario:5');
if (cached) return JSON.parse(cached); // ⚡ Instantáneo
```

**2. Índices en Base de Datos:**
```typescript
@Index() // Búsquedas 100x más rápidas
nombre!: string;
```

**3. Paginación:**
```typescript
// En lugar de retornar 10,000 libros:
const [libros, total] = await em.findAndCount(Libro, 
  { /* filtros */ }, 
  { limit: 20, offset: 0 } // Solo 20 por página
);
```

**4. Populate Selectivo:**
```typescript
// Solo cargar relaciones necesarias
await em.find(Libro, {}, { 
  populate: ['autor', 'categoria'] // No carga todo
});
```

**5. Lazy Loading de Imágenes:**
```typescript
// URLs en lugar de archivos base64
libro.imagen = 'https://example.com/cover.jpg';
```

**6. Rate Limiting (futuro):**
```typescript
// Limitar peticiones por IP
rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // Max 100 requests
});
```

---

## 📊 Resumen Final

### El Backend en 10 Puntos:

1. **Stack:** Node.js + Express + TypeScript + MySQL + MikroORM + Redis
2. **Arquitectura:** MVC con capa de servicios
3. **Autenticación:** JWT con roles (usuario/admin)
4. **Entidades:** 15 tablas relacionadas
5. **Moderación:** Automática con análisis de sentimiento
6. **Recomendaciones:** Algoritmo de filtrado basado en contenido
7. **APIs Externas:** Google Books + OpenLibrary
8. **Caché:** Redis con TTL configurable
9. **Seguridad:** Bcrypt, JWT, validaciones, CORS
10. **Optimización:** Índices, paginación, caché

---

## 📚 Recursos Adicionales

**Documentación oficial:**
- [Express.js](https://expressjs.com/)
- [MikroORM](https://mikro-orm.io/)
- [JWT](https://jwt.io/)
- [Redis](https://redis.io/)

**Arquitectura:**
- [Patrón MVC](https://www.freecodecamp.org/news/the-model-view-controller-pattern-mvc-architecture-and-frameworks-explained/)
- [RESTful API Design](https://restfulapi.net/)

---

**Última actualización:** 6 de noviembre de 2025  
**Versión:** 1.0  
**Mantenedor:** Equipo BookCode
