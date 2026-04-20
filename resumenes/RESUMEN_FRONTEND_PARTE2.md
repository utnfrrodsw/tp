# 📘 Resumen del Frontend - BookCode (PARTE 2)

## PARTE 2: Funcionalidades Principales y Componentes

### 2.1 Sistema de Búsqueda Inteligente

**SearchBar Component** (`componentes/SearchBar.tsx`)

El componente de búsqueda integra múltiples fuentes de datos:

**¿Cómo funciona?**
- **Debouncing**: Espera 300ms después de que el usuario deja de escribir para realizar la búsqueda
- **Integración con Google Books API**: Busca libros en tiempo real desde Google Books
- **Sugerencias en vivo**: Muestra hasta 8 resultados mientras escribes
- **Búsquedas trending**: Muestra búsquedas populares cuando no hay texto
- **Navegación por teclado**: Puedes usar flechas arriba/abajo para navegar los resultados

**Tecnologías clave:**
- Hook `useDebounce`: Evita hacer demasiadas peticiones a la API
- Framer Motion: Animaciones suaves al mostrar/ocultar sugerencias
- Icons de Lucide: Iconos visuales para libros, autores, etc.

---

### 2.2 Sistema de Listas Personales

**¿Qué son las listas?**

Las listas son colecciones de libros organizadas por el usuario. Hay 4 tipos:

1. **`read`** (Leídos): Libros que ya leíste
2. **`to_read`** (Por leer): Libros que planeas leer
3. **`pending`** (Pendientes): Libros en progreso
4. **`custom`** (Personalizadas): Listas creadas por el usuario (ej: "Mis favoritos de terror")

**Servicio: `listaService.ts`**

Funciones principales:
- `getUserListas()`: Obtiene todas las listas del usuario
- `createLista(nombre, tipo)`: Crea una nueva lista
- `getOrCreateLista(nombre, tipo)`: Obtiene una lista o la crea si no existe (evita duplicados)
- `addLibroALista(listaId, libroId)`: Agrega un libro a una lista
- `removeLibroDeLista(listaId, libroId)`: Elimina un libro de una lista
- `getListaDetallada(listaId, filtros)`: Obtiene una lista con todos sus libros y permite filtrar/ordenar

**DetalleLista Page**

Página que muestra el contenido completo de una lista:

**Características:**
- **Vista Grid/Lista**: Alterna entre vista de grilla o lista
- **Ordenamiento**: Por alfabético, fecha de agregado, rating, o personalizado (drag & drop)
- **Filtros**: Por autor, categoría, rating mínimo
- **Búsqueda**: Búsqueda rápida dentro de la lista
- **Eliminación**: Permite quitar libros de la lista
- **Drag & Drop**: Reordena libros arrastrándolos (solo en orden personalizado)

**Toasts interactivos:**
```typescript
// Confirmación antes de eliminar
toast((t) => (
  <div>
    <p>¿Eliminar este libro?</p>
    <button onClick={() => confirmar()}>Eliminar</button>
    <button onClick={() => toast.dismiss(t.id)}>Cancelar</button>
  </div>
))
```

---

### 2.3 Sistema de Reseñas y Moderación

**¿Qué son las reseñas?**

Las reseñas son comentarios y calificaciones (1-5 estrellas) que los usuarios hacen sobre libros.

**Servicio: `resenaService.ts`**

**Funciones principales:**
- `obtenerReseñas(idLibro)`: Obtiene todas las reseñas aprobadas de un libro
- `agregarReseña(libroId, comentario, estrellas, libro)`: Crea una nueva reseña
- `obtenerResenasPendientes(token)`: Obtiene reseñas pendientes de moderación (solo admin)
- `aprobarResena(id, token)`: Aprueba una reseña (solo admin)
- `rechazarResena(id, token)`: Rechaza una reseña (solo admin)

**Estados de una reseña:**
1. **PENDING**: Recién creada, esperando moderación
2. **APPROVED**: Aprobada por un admin, visible para todos
3. **REJECTED**: Rechazada por un admin, no visible
4. **FLAGGED**: Marcada por contenido inapropiado automáticamente

**Sistema de Auto-moderación:**

El backend analiza automáticamente las reseñas con IA:
- Detecta lenguaje ofensivo, spam, contenido inapropiado
- Asigna un `moderationScore` (0-100)
- Si el score es alto, marca la reseña como FLAGGED automáticamente
- Un admin debe revisar y aprobar/rechazar manualmente

**NuevaResenaForm Component:**

Formulario simple para crear reseñas:
- Campo de texto para el comentario
- Selector de estrellas (1-5)
- Al enviar, la reseña queda PENDING hasta que un admin la apruebe

---

### 2.4 Sistema de Perfiles y Estadísticas

**PerfilPage** (`paginas/PerfilPage.tsx`)

Página que muestra el perfil completo del usuario con sus estadísticas.

**Datos que muestra:**
- **Información personal**: Username, email, nombre, ubicación, biografía
- **Avatar**: Imagen de perfil personalizable
- **Estadísticas sociales:**
  - Seguidores: Usuarios que te siguen
  - Siguiendo: Usuarios que sigues
- **Estadísticas de lectura:**
  - Reseñas escritas
  - Listas creadas
  - Libros favoritos
  - Libros leídos

**¿Cómo obtiene las estadísticas?**

```typescript
// Llamadas en paralelo para mejor performance
const [statsRes, reseñasRes, listasRes, todasLasListas, favoritosRes] = 
  await Promise.all([
    usuarioService.getUserStats(userId),
    getResenasByUsuario(userId),
    listaService.getListasByUsuario(userId),
    listaService.getUserListas(),
    obtenerFavoritos()
  ]);
```

**ConfiguracionUsuario Page:**

Permite al usuario editar su perfil:
- Cambiar nombre, apellido, username
- Actualizar email
- Modificar biografía, ubicación, género
- Cambiar avatar (selección de múltiples avatares predefinidos)
- Cambiar contraseña

---

### 2.5 Sistema de Seguimiento Social

**¿Cómo funciona el seguimiento?**

Los usuarios pueden seguirse entre sí para ver sus actividades.

**Servicio: `seguimientoService.ts`**

**Funciones:**
- `followUser(seguidoId)`: Seguir a un usuario
- `unfollowUser(seguidoId)`: Dejar de seguir
- `getSeguidores(usuarioId)`: Obtener lista de seguidores
- `getSeguidos()`: Obtener usuarios que sigues
- `isFollowing(seguidoId)`: Verificar si sigues a un usuario

**SeguirUsuarioButton Component:**

Botón inteligente que:
- Muestra "Seguir" si no sigues al usuario
- Muestra "Siguiendo" si ya lo sigues
- Cambia de estado al hacer clic
- Se actualiza automáticamente

**SiguiendoPage:**

Página que lista todos los usuarios que sigues con:
- Avatar y nombre
- Botón para dejar de seguir
- Link al perfil del usuario

---

### 2.6 Feed de Actividades

**FeedActividadPage** (`paginas/FeedActividadPage.tsx`)

Muestra un timeline con las actividades recientes de los usuarios que sigues.

**Tipos de actividades:**
1. **RESENA**: Usuario publicó una reseña
2. **SEGUIMIENTO**: Usuario siguió a alguien
3. **LISTA_CREADA**: Usuario creó una lista
4. **LISTA_ACTUALIZADA**: Usuario agregó libros a una lista
5. **FAVORITO**: Usuario marcó un libro como favorito

**Características:**
- **Filtrado por tipo**: Puedes filtrar para ver solo un tipo de actividad
- **Paginación infinita**: Carga más actividades al hacer scroll
- **Limit/Offset**: Carga 20 actividades por vez
- **Tiempo real**: Muestra cuándo ocurrió cada actividad

**Estructura de una actividad:**
```typescript
interface Actividad {
  id: number;
  usuario: { username, nombre, apellido, fotoPerfil };
  tipo: 'RESENA' | 'SEGUIMIENTO' | ...;
  libro?: { id, nombre, imagen, autor };
  resena?: { calificacion, comentario };
  fechaCreacion: string;
}
```

---

### 2.7 Sistema de Favoritos

**¿Qué son los favoritos?**

Los favoritos son libros que el usuario marca como especiales (diferente a las listas).

**Servicio: `favoritosService.ts`**

**Funciones:**
- `agregarFavorito(libroId, libro)`: Marca un libro como favorito
- `eliminarFavorito(libroId)`: Quita un libro de favoritos
- `obtenerFavoritos()`: Obtiene todos los favoritos del usuario
- `esFavorito(libroId)`: Verifica si un libro es favorito

**FavoritosPage:**

Muestra todos los libros favoritos del usuario:
- Vista de grilla con tarjetas de libros
- Imagen, título, autor, rating
- Botón para eliminar de favoritos
- Click para ver detalle del libro

---

### 2.8 Panel de Administración

**Funcionalidad exclusiva para usuarios con rol "admin".**

#### AdminModerationPage

Panel para moderar reseñas:

**¿Qué hace?**
- Muestra reseñas con estado PENDING o FLAGGED
- Muestra el `moderationScore` (riesgo de 0-100)
- Permite aprobar o rechazar reseñas
- Muestra por qué fue marcada (lenguaje ofensivo, spam, etc.)

**Flujo de moderación:**
1. Usuario crea reseña → Estado PENDING
2. IA analiza el contenido → Asigna score
3. Si score > umbral → Estado FLAGGED
4. Admin revisa en panel
5. Admin aprueba → Estado APPROVED (visible)
6. Admin rechaza → Estado REJECTED (oculta)

#### AdminPermisoPage

Panel para gestionar permisos de usuarios:
- Ver lista de usuarios
- Cambiar roles (user → admin, admin → user)
- Ver fecha de registro
- Buscar usuarios

#### AdminRatingLibroPage

Panel para ver estadísticas de ratings:
- Rating promedio por libro
- Cantidad de calificaciones
- Distribución de estrellas

---

### 2.9 Hooks Personalizados

#### useDebounce

**¿Para qué sirve?**

Retrasa la ejecución de una función hasta que el usuario deja de escribir.

**Ejemplo de uso:**
```typescript
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 300);

// Solo busca cuando el usuario deja de escribir por 300ms
useEffect(() => {
  if (debouncedQuery) {
    buscarLibros(debouncedQuery);
  }
}, [debouncedQuery]);
```

**Beneficios:**
- Reduce llamadas a la API (menos tráfico)
- Mejor performance
- Mejor experiencia de usuario

---

### 2.10 Context API: ThemeContext

**¿Qué es ThemeContext?**

Maneja el tema global de la aplicación (modo claro/oscuro).

**ThemeProvider Component:**

Envuelve toda la app y proporciona:
- Estado del tema actual (`light` o `dark`)
- Función `toggleTheme()`: Cambia entre claro/oscuro
- Función `setTheme(theme)`: Establece un tema específico

**¿Cómo funciona?**

1. Al cargar, verifica `localStorage` para el tema guardado
2. Si no hay tema guardado, usa la preferencia del sistema
3. Al cambiar tema:
   - Actualiza la clase en `<html>` (light/dark)
   - Guarda en `localStorage`
   - TailwindCSS aplica estilos correspondientes

**ThemeToggle Component:**

Botón que permite cambiar el tema:
- Muestra icono de sol (modo claro)
- Muestra icono de luna (modo oscuro)
- Animación suave al cambiar

**Uso en componentes:**
```typescript
const { theme, toggleTheme } = useTheme();

<button onClick={toggleTheme}>
  {theme === 'dark' ? '☀️' : '🌙'}
</button>
```

---

### 2.11 Utilidades (Utils)

#### fetchWithRefresh

**Función crítica para autenticación.**

Envuelve todas las llamadas HTTP y maneja:
1. Agrega automáticamente el token a las peticiones
2. Si recibe error 401 (token expirado):
   - Intenta renovar el token con `refreshToken`
   - Reintenta la petición original
3. Si el refresh falla:
   - Cierra sesión del usuario
   - Muestra modal de login
   - Lanza evento `sessionExpired`

**Uso:**
```typescript
// En lugar de fetch normal
const response = await fetchWithRefresh('/api/libros', {
  method: 'GET'
});
```

**Ventajas:**
- Renovación transparente de tokens
- No molesta al usuario si el token expiró hace poco
- Solo pide login cuando realmente es necesario

---

### 2.12 Integraciones Externas

#### Google Books API

**Servicio: `googleBooksService.ts`**

Integra la API de Google Books para:
- Buscar libros por título, autor, ISBN
- Obtener información detallada (descripción, imagen, editorial)
- Autocompletar en búsquedas
- Importar libros que no están en la base de datos

**Funciones principales:**
- `searchBooksAutocomplete(query, maxResults)`: Búsqueda rápida para autocompletar
- `searchBooks(query, startIndex, maxResults)`: Búsqueda completa con paginación
- `getBookById(googleId)`: Obtiene detalles de un libro específico

**Ventaja:** Amplía el catálogo sin necesidad de tener todos los libros en la base de datos.

#### Wikipedia API

**Servicio: `wikipediaService.ts`**

Obtiene información de autores desde Wikipedia:
- Biografía del autor
- Fecha de nacimiento/muerte
- Foto
- Enlaces externos

**Uso:** Enriquece la página de detalle del autor con información confiable.

---

### 2.13 Componentes de UI Reutilizables

#### LoadingSkeleton

Muestra placeholders animados mientras carga el contenido:
- **BookCardSkeleton**: Tarjeta de libro
- **ListHeaderSkeleton**: Cabecera de lista
- **ToolbarSkeleton**: Barra de herramientas
- **ProfileSkeleton**: Perfil de usuario

**Beneficio:** Mejora la percepción de velocidad y evita pantallas en blanco.

#### LibroCard

Tarjeta reutilizable para mostrar libros:
- Imagen del libro
- Título y autor
- Rating con estrellas
- Hover con efectos (Framer Motion)
- Click para ir al detalle

#### AutorCard

Tarjeta para mostrar autores:
- Foto del autor
- Nombre completo
- Cantidad de obras
- Nacionalidad
- Link al detalle del autor

#### AnimatedCounter

Contador animado para estadísticas:
- Anima desde 0 hasta el número final
- Usado en perfil para seguidores, reseñas, etc.

#### VistaToggle

Botón para alternar entre vista grid/lista:
- Iconos de grid (🔲) y lista (☰)
- Estado activo visual
- Transiciones suaves

---

### 2.14 Páginas de Descubrimiento

#### LibrosPopulares

Muestra los libros más populares basados en:
- Cantidad de reseñas
- Rating promedio
- Favoritos

#### LibrosRecomendados

Sistema de recomendaciones personalizado:
- Analiza tus libros favoritos
- Analiza tus reseñas
- Sugiere libros similares
- Filtros por categoría, autor

**RecomendacionesFiltros Component:**
- Filtro por categoría
- Filtro por autor conocido
- Ordenar por rating/popularidad

#### NuevosLanzamientos

Libros agregados recientemente al catálogo:
- Ordenados por fecha de creación
- Filtro por categoría
- Vista con imágenes destacadas

#### LibrosPorCategoria

Vista de libros filtrados por una categoría específica:
- URL: `/libros/categoria/:nombreCategoria`
- Paginación
- Ordenamiento

---

### 2.15 Páginas de Sagas

**¿Qué es una saga?**

Colección de libros relacionados (trilogías, series, universos compartidos).

**SagasPage:**
- Lista todas las sagas disponibles
- Cada saga muestra: nombre, descripción, cantidad de libros
- Filtro y búsqueda

**SagaDetallePage:**
- Muestra todos los libros de una saga
- Ordenados por número de libro en la saga
- Descripción completa de la saga
- Autor(es) de la saga

**CrearSaga (Admin):**
- Formulario para crear nuevas sagas
- Agregar libros a la saga
- Establecer orden de lectura

---

### 2.16 Autores Mejorados

**AutoresPageMejorada:**

Vista mejorada de autores con:
- **Búsqueda híbrida**: Busca en base de datos local Y en Google Books
- **Integración Wikipedia**: Muestra biografías completas
- **Caché inteligente**: Guarda búsquedas para no repetirlas
- **Vista enriquecida**: Fotos, biografías, obras famosas

**AutorDetallePageMejorada:**

Detalle completo del autor:
- **Biografía completa** desde Wikipedia
- **Timeline de obras**: Línea de tiempo con sus libros
- **Estadísticas**: Total de libros, promedio de ratings
- **Libros del autor**: Grid con todos sus libros
- **Información externa**: Links a Wikipedia, sitio oficial

**ObrasTimeline Component:**

Línea de tiempo visual de las obras:
- Organizada por año de publicación
- Iconos de libro
- Hover con información adicional
- Animaciones con Framer Motion

---

### 2.17 Sistema de Notificaciones

**React Hot Toast**

Librería para mostrar notificaciones temporales:

**Tipos de toast:**
- `toast.success('Mensaje')`: Verde, éxito
- `toast.error('Mensaje')`: Rojo, error
- `toast.loading('Mensaje')`: Azul, cargando
- `toast.promise(promise, {loading, success, error})`: Automático según resultado

**Ejemplo avanzado:**
```typescript
// Toast con confirmación
toast((t) => (
  <div>
    <p>¿Estás seguro?</p>
    <button onClick={() => {
      confirmar();
      toast.dismiss(t.id);
    }}>Sí</button>
    <button onClick={() => toast.dismiss(t.id)}>No</button>
  </div>
), { duration: Infinity });
```

**Configuración:**
- Posición: top-right
- Duración: 3000ms (3 segundos)
- Animaciones de entrada/salida
- Soporte tema claro/oscuro

---

### 2.18 Animaciones con Framer Motion

**¿Qué es Framer Motion?**

Librería para animaciones declarativas en React.

**Usos en BookCode:**

1. **Fade In**: Elementos que aparecen suavemente
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Contenido
</motion.div>
```

2. **Slide In**: Elementos que entran desde un lado
```typescript
<motion.div
  initial={{ x: -50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
>
  Contenido
</motion.div>
```

3. **Hover Effects**: Efectos al pasar el mouse
```typescript
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Tarjeta
</motion.div>
```

4. **AnimatePresence**: Anima elementos que salen del DOM
```typescript
<AnimatePresence>
  {mostrar && (
    <motion.div
      exit={{ opacity: 0, scale: 0.8 }}
    >
      Contenido
    </motion.div>
  )}
</AnimatePresence>
```

---

### 2.19 Validación y Manejo de Errores

**Validación en Formularios:**

Todos los formularios validan:
- Campos requeridos
- Formato de email
- Longitud de contraseñas
- Caracteres especiales

**Mensajes de error claros:**
- "El email ya está registrado"
- "La contraseña debe tener al menos 8 caracteres"
- "El username no puede contener espacios"

**Error Boundaries:**

Capturan errores de React y muestran UI amigable:
- SplineErrorBoundary: Para errores en animaciones 3D
- Fallback genérico con botón de "Recargar"

**Manejo de errores HTTP:**
```typescript
try {
  const response = await fetchWithRefresh('/api/...');
  // ...
} catch (error) {
  if (error.status === 404) {
    toast.error('No encontrado');
  } else if (error.status === 500) {
    toast.error('Error del servidor');
  } else {
    toast.error('Algo salió mal');
  }
}
```

---

### 2.20 Optimizaciones de Performance

**1. Code Splitting:**
- React Router hace lazy loading de páginas
- Solo carga el código necesario para la ruta actual

**2. Imágenes Optimizadas:**
- `LibroImagen` component con lazy loading
- Fallback si imagen no carga
- Usa WebP cuando está disponible

**3. Memoización:**
- Uso de `useMemo` para cálculos costosos
- Uso de `useCallback` para funciones en dependencias

**4. Debouncing:**
- En búsquedas (300ms)
- En filtros (500ms)
- Reduce llamadas a API en 90%

**5. Paginación:**
- Carga progresiva (infinite scroll)
- Limit/Offset para no cargar todo
- Placeholders mientras carga

**6. Caché:**
- LocalStorage para tema, tokens
- React Query (si se implementa) para datos
- Service Worker (PWA ready)

---

## 🎓 SECCIÓN DE PREGUNTAS Y RESPUESTAS PARA EXAMEN

### Preguntas de Conceptos Generales

**P1: ¿Qué es un Hook en React y cuáles se utilizan en este proyecto?**

**R:** Un Hook es una función especial de React que permite usar estado y otras características de React en componentes funcionales. En BookCode se utilizan:
- `useState`: Para manejar estado local (ej: formularios, toggles)
- `useEffect`: Para efectos secundarios (ej: llamadas a API al montar)
- `useContext`: Para acceder al contexto global (ej: ThemeContext)
- `useNavigate`: Para navegación programática entre rutas
- `useParams`: Para obtener parámetros de la URL
- **Hook personalizado `useDebounce`**: Para retrasar la actualización de valores y optimizar búsquedas

**P2: ¿Qué es el debouncing y por qué es importante en el SearchBar?**

**R:** El debouncing es una técnica que retrasa la ejecución de una función hasta que ha pasado cierto tiempo desde el último evento. En el SearchBar:
- Espera 300ms después de que el usuario deja de escribir
- Evita hacer una petición HTTP por cada tecla presionada
- Reduce carga en el servidor (100 teclas → 1 petición en lugar de 100)
- Mejora la experiencia del usuario (no hay lag)
- Implementado con el hook `useDebounce(query, 300)`

**P3: ¿Cómo funciona el sistema de autenticación y renovación de tokens?**

**R:** BookCode usa JWT (JSON Web Tokens) con un sistema de doble token:
1. **accessToken**: Expira en 15 minutos, se envía en cada petición
2. **refreshToken**: Expira en 7 días, usado para renovar el accessToken

**Flujo:**
- Usuario hace login → Recibe ambos tokens → Se guardan en localStorage
- Cada petición incluye accessToken en header `Authorization: Bearer <token>`
- Si accessToken expira (401) → `fetchWithRefresh` usa refreshToken para obtener nuevo accessToken
- Si refreshToken expira → Cierra sesión y muestra modal de login
- Todo es automático y transparente para el usuario

**P4: ¿Qué es el Context API y cómo se usa en ThemeContext?**

**R:** Context API es una forma de compartir datos entre componentes sin pasar props manualmente en cada nivel.

**ThemeContext:**
- `createContext()`: Crea el contexto con tipo `ThemeContextType`
- `ThemeProvider`: Componente que envuelve la app y proporciona el estado del tema
- `useTheme()`: Hook personalizado para acceder al contexto desde cualquier componente
- Proporciona: `theme` (estado actual), `toggleTheme()` (función para cambiar)
- Ventaja: Cualquier componente puede cambiar el tema sin pasar props

**P5: ¿Qué ventajas tiene usar TypeScript en lugar de JavaScript?**

**R:** TypeScript añade tipado estático a JavaScript:
1. **Detección temprana de errores**: Antes de ejecutar el código
2. **Autocompletado mejorado**: El IDE sugiere propiedades y métodos
3. **Refactoring seguro**: Puedes renombrar variables con confianza
4. **Documentación viva**: Los tipos documentan lo que espera cada función
5. **Interfaces claras**: Define contratos entre componentes

**Ejemplo:**
```typescript
interface Usuario {
  id: number;
  username: string;
  email: string;
}

// Si intentas hacer usuario.nombre, TypeScript error porque no existe
```

---

### Preguntas de Arquitectura

**P6: ¿Qué patrón de arquitectura sigue el frontend y por qué?**

**R:** Sigue una **arquitectura de capas** inspirada en Clean Architecture:

1. **Capa de Presentación** (`componentes/`, `paginas/`): UI y lógica de presentación
2. **Capa de Servicios** (`services/`): Lógica de negocio y comunicación con API
3. **Capa de Utilidades** (`utils/`, `hooks/`): Funciones auxiliares reutilizables
4. **Capa de Estado** (`contexts/`): Gestión de estado global

**Ventajas:**
- Separación de responsabilidades clara
- Fácil de testear (cada capa independiente)
- Reutilización de código
- Mantenimiento simplificado

**P7: ¿Cómo se organiza el enrutamiento y qué es una SPA?**

**R:** **SPA (Single Page Application)**: La aplicación carga una sola página HTML y actualiza dinámicamente el contenido sin recargar.

**React Router DOM v7** maneja el enrutamiento:
- `<BrowserRouter>`: Habilita enrutamiento basado en URL
- `<Routes>`: Contiene todas las rutas
- `<Route path="/libros" element={<LibrosPage />} />`: Define una ruta

**Ventajas:**
- Navegación instantánea (no recarga página)
- Experiencia similar a app nativa
- Mejor UX con transiciones suaves
- Menor carga del servidor

**P8: ¿Qué es fetchWithRefresh y por qué es crítico?**

**R:** `fetchWithRefresh` es una función wrapper que envuelve `fetch` nativo para manejar automáticamente la renovación de tokens.

**Funcionamiento:**
1. Añade token de autorización a cada petición
2. Si recibe 401 (no autorizado):
   - Intenta renovar token con refreshToken
   - Reintenta la petición original
3. Si falla la renovación:
   - Cierra sesión
   - Dispara evento `sessionExpired`
   - Muestra modal de login

**Importancia:**
- Sin esto, cada servicio debería manejar renovación manualmente (código duplicado)
- Usuario no ve interrupciones si token expira mientras navega
- Centraliza la lógica de autenticación

---

### Preguntas de Funcionalidades

**P9: ¿Cómo funciona el sistema de listas y qué tipos hay?**

**R:** Las listas son colecciones personales de libros del usuario.

**Tipos:**
1. **read**: Libros leídos (automática)
2. **to_read**: Libros por leer (automática)
3. **pending**: Libros en progreso (automática)
4. **custom**: Listas personalizadas creadas por el usuario

**Funcionalidades:**
- Crear, editar, eliminar listas
- Agregar/quitar libros
- Reordenar libros (drag & drop en custom)
- Filtrar y buscar dentro de la lista
- Cambiar vista (grid/lista)
- Ordenar por fecha, alfabético, rating, personalizado

**Implementación:**
- `getOrCreateLista()`: Evita duplicados (idempotente)
- Relación muchos a muchos: Libro ↔ ContenidoLista ↔ Lista
- Campo `orden` para ordenamiento personalizado

**P10: ¿Qué es el sistema de moderación de reseñas y cómo funciona?**

**R:** Sistema de control de calidad para reseñas con IA + moderación humana.

**Flujo:**
1. Usuario crea reseña → Estado **PENDING**
2. Backend analiza con IA:
   - Detecta lenguaje ofensivo
   - Detecta spam
   - Detecta contenido inapropiado
3. Asigna **moderationScore** (0-100, mayor = más riesgoso)
4. Si score > umbral → Estado **FLAGGED**
5. Admin revisa en panel de moderación
6. Admin decide:
   - Aprobar → **APPROVED** (visible para todos)
   - Rechazar → **REJECTED** (oculta)

**Ventajas:**
- Detecta automáticamente problemas graves
- Reduce trabajo manual del admin
- Mantiene calidad del contenido
- Protege la comunidad

**P11: ¿Cómo funciona el Feed de Actividades?**

**R:** Timeline social que muestra actividades de usuarios que sigues.

**Tipos de actividades:**
- RESENA: Publicó una reseña
- SEGUIMIENTO: Siguió a alguien
- LISTA_CREADA: Creó una lista
- LISTA_ACTUALIZADA: Agregó libro a lista
- FAVORITO: Marcó libro favorito

**Características:**
- **Paginación**: Carga 20 actividades por vez (limit/offset)
- **Infinite scroll**: Carga más al llegar al final
- **Filtros**: Por tipo de actividad
- **Orden**: Más recientes primero
- **Real-time ready**: Puede integrar WebSockets para updates en vivo

**Implementación:**
```typescript
GET /api/feed?limit=20&offset=0&tipos=RESENA
```

**P12: ¿Cómo se integra Google Books API y qué beneficios trae?**

**R:** Integración para ampliar el catálogo sin mantener base de datos enorme.

**Funciones:**
- Búsqueda de libros por título, autor, ISBN
- Autocompletar en SearchBar
- Importar libros que no están en BD local
- Obtener metadatos (descripción, imagen, editorial, fecha)

**Flujo:**
1. Usuario busca libro
2. Frontend busca en Google Books API
3. Muestra resultados
4. Si usuario interactúa (agrega a lista, reseña):
   - Backend crea el libro en BD local
   - Guarda referencia `externalId` (Google Books ID)
5. Futuras búsquedas usan BD local (más rápido)

**Beneficios:**
- Catálogo de millones de libros
- No hay que mantener datos actualizados
- Información confiable de Google

---

### Preguntas de Performance y Optimización

**P13: ¿Qué optimizaciones de performance se implementan?**

**R:**

1. **Debouncing**: Reduce llamadas API en búsquedas (300ms delay)
2. **Code Splitting**: Lazy loading de rutas con React Router
3. **Memoización**: `useMemo` y `useCallback` para evitar re-renders
4. **Imágenes lazy**: Solo cargan cuando están visibles
5. **Paginación**: Carga incremental (limit/offset)
6. **Caché en localStorage**: Tema, tokens, preferencias
7. **Llamadas en paralelo**: `Promise.all()` para múltiples requests
8. **Skeletons**: Mejora percepción de velocidad

**Ejemplo debouncing:**
```typescript
// Sin debounce: 10 caracteres = 10 llamadas API
// Con debounce: 10 caracteres = 1 llamada API (después de 300ms)
const debouncedQuery = useDebounce(query, 300);
```

**P14: ¿Qué son los Skeleton Loaders y por qué se usan?**

**R:** Placeholders animados que muestran la estructura del contenido mientras carga.

**Ventajas:**
1. **Percepción de velocidad**: Usuario ve actividad inmediata
2. **Reduce ansiedad**: Sabe que está cargando
3. **No hay pantalla en blanco**: Más profesional
4. **Indica estructura**: Muestra qué tipo de contenido vendrá

**Tipos en BookCode:**
- `BookCardSkeleton`: Para tarjetas de libros
- `ListHeaderSkeleton`: Para headers de listas
- `ProfileSkeleton`: Para perfiles

**Implementación:**
```typescript
{loading ? (
  <BookCardSkeleton count={6} />
) : (
  libros.map(libro => <LibroCard {...libro} />)
)}
```

**P15: ¿Cómo se maneja el caché y por qué es importante?**

**R:** Caché almacena datos temporalmente para acceso rápido.

**Estrategias en BookCode:**

1. **localStorage**:
   - Tokens de autenticación (no vuelve a pedir login)
   - Tema seleccionado (persiste entre sesiones)
   - Preferencias de usuario

2. **Estado de React**:
   - Datos de la sesión actual
   - No persiste al recargar página

3. **Backend caché (Redis)**:
   - Reseñas populares
   - Libros trending
   - Reduce carga en base de datos

**Importancia:**
- Reduce latencia (datos locales son instantáneos)
- Reduce carga del servidor
- Funciona offline (PWA)
- Mejor experiencia de usuario

---

### Preguntas de Seguridad

**P16: ¿Qué medidas de seguridad implementa el frontend?**

**R:**

1. **Tokens JWT en lugar de cookies**: Previene CSRF
2. **localStorage en lugar de sessionStorage**: Balance seguridad/UX
3. **HTTPS only**: Tokens encriptados en tránsito
4. **Validación de entrada**: Sanitiza inputs del usuario
5. **Renovación automática de tokens**: Minimiza ventana de exposición
6. **Logout en múltiples escenarios**: Token inválido, error 401, manual
7. **No almacena contraseñas**: Solo tokens temporales
8. **Roles y permisos**: Admin endpoints requieren verificación

**P17: ¿Por qué usar refreshToken además de accessToken?**

**R:**

**Problema sin refreshToken:**
- accessToken dura 7 días → Si se roba, atacante tiene acceso por 7 días
- accessToken dura 15 min → Usuario debe hacer login cada 15 minutos (mala UX)

**Solución con refreshToken:**
- **accessToken**: Corta duración (15 min), se envía en cada petición
- **refreshToken**: Larga duración (7 días), solo se usa para renovar

**Ventajas:**
- Si roban accessToken → Expira en 15 min (daño limitado)
- Si roban refreshToken pero no accessToken → No sirve para peticiones directas
- Usuario hace login 1 vez cada 7 días (buena UX)
- Backend puede invalidar refreshTokens en lista negra

---

### Preguntas de UX/UI

**P18: ¿Qué es Framer Motion y cómo mejora la UX?**

**R:** Librería para animaciones declarativas en React.

**Mejoras de UX:**
1. **Feedback visual**: Usuario ve que algo pasó
2. **Guía atención**: Animaciones dirigen la mirada
3. **Transiciones suaves**: Menos jarring que cambios bruscos
4. **Percepción de calidad**: Detalles hacen diferencia
5. **Deleite**: Pequeñas sorpresas mejoran experiencia

**Ejemplos en BookCode:**
- Cards que crecen al hover
- Fade in al cargar contenido
- Slide in de modales
- Exit animations al cerrar

**Código:**
```typescript
<motion.div
  whileHover={{ scale: 1.05 }}  // Crece 5% al hover
  whileTap={{ scale: 0.95 }}    // Se encoge al click
  transition={{ type: "spring" }} // Animación tipo resorte
>
```

**P19: ¿Cómo se implementa el modo oscuro y por qué es importante?**

**R:**

**Implementación:**
1. **ThemeContext** maneja estado global del tema
2. TailwindCSS con prefijo `dark:` para estilos oscuros
3. Clase `dark` en `<html>` activa los estilos
4. localStorage persiste la preferencia

**Código:**
```typescript
// Detecta preferencia del sistema
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Aplica tema
document.documentElement.classList.add('dark');
```

**Importancia:**
1. **Salud ocular**: Reduce fatiga en ambientes oscuros
2. **Batería**: Ahorra energía en pantallas OLED
3. **Accesibilidad**: Algunos usuarios lo necesitan médicamente
4. **Preferencia personal**: Flexibilidad = mejor UX
5. **Tendencia moderna**: Esperado en apps actuales

**P20: ¿Qué son los toasts y cómo mejoran la experiencia?**

**R:** Notificaciones temporales no intrusivas.

**Características:**
- Aparecen en esquina (no bloquean contenido)
- Desaparecen automáticamente (3 segundos)
- Apilables (múltiples simultáneos)
- Tipos: success (verde), error (rojo), loading (azul), info (gris)

**Usos en BookCode:**
- Confirmaciones: "Libro agregado a favoritos ✓"
- Errores: "Error al guardar cambios ✗"
- Progreso: "Guardando..." → "Guardado ✓"
- Confirmaciones interactivas: Botones dentro del toast

**Ventajas sobre alerts:**
- No bloquean interacción
- Más estéticas
- Permiten múltiples mensajes
- Posicionamiento consistente

---

## 📊 Diagrama de Flujo General

```
Usuario interactúa con UI
        ↓
Componente React (useState, useEffect)
        ↓
Servicio (libroService, authService, etc.)
        ↓
fetchWithRefresh (añade token, maneja renovación)
        ↓
Backend API (Express + MikroORM)
        ↓
Base de Datos MySQL
        ↓
Respuesta JSON
        ↓
Servicio procesa datos
        ↓
Componente actualiza estado
        ↓
React re-renderiza UI
        ↓
Usuario ve resultado
```

---

## 🔑 Conceptos Clave para Recordar

1. **JWT + Refresh Token**: Autenticación segura y conveniente
2. **fetchWithRefresh**: Renovación automática transparente
3. **Debouncing**: Optimización crítica para búsquedas
4. **Context API**: Estado global sin prop drilling
5. **TypeScript**: Seguridad de tipos en tiempo de desarrollo
6. **Framer Motion**: Animaciones que mejoran UX
7. **React Router**: SPA con navegación sin recargas
8. **Listas personales**: 4 tipos (read, to_read, pending, custom)
9. **Sistema de moderación**: IA + humano para calidad
10. **Google Books API**: Catálogo externo integrado

---

## 🎯 Resumen Ejecutivo

**BookCode Frontend** es una aplicación React moderna que combina:

- **Autenticación robusta** con JWT y renovación automática
- **Búsqueda inteligente** con debouncing y múltiples fuentes
- **Sistema social** con seguimientos, feed de actividades, perfiles
- **Gestión de contenido** con listas personalizables, favoritos, reseñas
- **Moderación inteligente** con IA para mantener calidad
- **UX excepcional** con animaciones, tema oscuro, skeletons
- **Performance optimizada** con code splitting, caché, paginación
- **Integraciones externas** con Google Books y Wikipedia
- **Arquitectura limpia** con separación de capas y TypeScript

Todo esto construido con **React 18**, **TypeScript**, **TailwindCSS**, **Framer Motion**, y siguiendo **best practices** modernas de desarrollo web.

