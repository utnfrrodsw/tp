# Tienda Retro - Sistema de Compra y Venta de Camisetas de Fútbol

## Integrantes del Grupo
- Navos, Juan Ignacio - Legajo 53169
- Crocenzi, Mateo Santiago - Legajo 52238

## Descripción del Proyecto
Sistema web full stack para la compra y venta de camisetas de fútbol retro. Los usuarios pueden publicar sus camisetas para venta con precio fijo o mediante subasta, realizar compras aplicando descuentos automáticos acumulables y participar en subastas realizando ofertas. El sistema incluye un panel administrativo para gestión de usuarios, categorías, descuentos y visualización de estadísticas.

---

## Requisitos Previos
- Node.js versión 18 o superior
- MySQL versión 8 o superior
- npm o pnpm como gestor de paquetes

---

## Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/juaninavos/Navos_Crocenzi-COM-305.git
cd Navos_Crocenzi-COM-305
```

### 2. Configurar la Base de Datos

Abrir MySQL y crear la base de datos:

```bash
mysql -u root -p
```

Dentro de MySQL ejecutar:
```sql
CREATE DATABASE tienda_retro;
exit;
```

### 3. Configurar el Backend

```bash
# Ir a la carpeta backend
cd backend

# Instalar dependencias
npm install
```

Crear un archivo `.env` en la carpeta `backend` con el siguiente contenido:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=tienda_retro
JWT_SECRET=tu_secreto_jwt_seguro
JWT_EXPIRES_IN=7d
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
```

**Importante:** Reemplaza `tu_contraseña_mysql` con tu contraseña real de MySQL.

Inicializar y poblar la base de datos:

```bash
# Crear las tablas
npm run init-db

# Cargar datos de prueba (incluye usuarios)
npm run seed-db
```

### 4. Ejecutar el Backend

```bash
# Desde la carpeta backend
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3001
```

### 5. Configurar el Frontend

Abrir **una nueva terminal** (mantener la del backend corriendo) y ejecutar:

```bash
# Volver a la raíz del proyecto
cd ..

# Ir a la carpeta frontend
cd frontend

# Instalar dependencias
npm install
```

Crear un archivo `.env` en la carpeta `frontend` con el siguiente contenido:

```env
VITE_API_URL=http://localhost:3001
```

### 6. Ejecutar el Frontend

```bash
# Desde la carpeta frontend
npm run dev
```

Deberías ver:
```
➜  Local:   http://localhost:5173/
```

### 7. Acceder a la Aplicación

Abre tu navegador en: **http://localhost:5173**

---

## Usuarios de Prueba

Después de ejecutar `npm run seed-db`, el sistema crea automáticamente estos usuarios:

### Administrador
```
Email: admin@tiendaretro.com
Contraseña: admin123
```

**Permisos:**
- Acceso al panel de administración
- Gestionar usuarios del sistema
- Crear y administrar categorías
- Crear y gestionar descuentos
- Ver estadísticas y dashboard
- Publicar camisetas
- Todas las funciones de usuario normal

### Usuario 1 - María
```
Email: maria@email.com
Contraseña: user123
```

**Permisos:**
- Publicar camisetas para venta
- Comprar productos
- Participar en subastas
- Ver historial de compras y ofertas

### Usuario 2 - Carlos
```
Email: carlos@email.com
Contraseña: user456
```

**Permisos:**
- Publicar camisetas para venta
- Comprar productos
- Participar en subastas
- Ver historial de compras y ofertas

## Funcionalidades Principales

### Para Usuarios
- Registro e inicio de sesión con JWT
- Catálogo de productos con filtros avanzados
- Carrito de compras con descuentos automáticos
- Sistema de descuentos acumulables
- Publicación de camisetas (precio fijo o subasta)
- Participación en subastas con ofertas
- Historial de compras detallado
- Gestión de perfil personal

### Para Administradores
- Dashboard con estadísticas en tiempo real
- Gestión completa de usuarios (activar/desactivar)
- Gestión de categorías (crear/editar/activar)
- Sistema completo de descuentos:
  - Descuentos globales
  - Descuentos por categoría
  - Descuentos por producto específico
  - Acumulación automática de múltiples descuentos
- Visualización de todas las transacciones
- Estadísticas globales y personales

---

## Datos Pre-cargados

El script `npm run seed-db` crea automáticamente:

- **3 usuarios:** 1 administrador + 2 usuarios normales
- **4 categorías:** Clubes Argentinos, Selecciones, Clubes Europeos, Retro/Vintage
- **4 métodos de pago:** Efectivo, Transferencia, Tarjeta de Crédito, Mercado Pago
- **2 descuentos activos:** 
  - RETRO10: 10% en categoría Retro/Vintage
  - VINTAGE20: 20% en categoría Retro/Vintage
- **6 camisetas:** 
  - 4 con precio fijo (Argentina, Boca, Barcelona, River)
  - 2 en subasta activa (Brasil 1970, Italia 1982)

---

## Scripts Disponibles

### Backend
```bash
npm run dev          # Ejecutar en desarrollo
npm run build        # Compilar TypeScript
npm start            # Ejecutar en producción
npm run init-db      # Inicializar base de datos
npm run seed-db      # Cargar datos de prueba
```

### Frontend
```bash
npm run dev          # Ejecutar en desarrollo
npm run build        # Compilar para producción
```

---

## Tecnologías Utilizadas

### Backend
- Node.js + TypeScript
- Express.js - Framework web
- MikroORM - ORM para base de datos
- MySQL - Base de datos relacional
- JWT - Autenticación
- Multer - Carga de archivos
- Zod - Validación de datos
- Bcrypt - Hash de contraseñas

### Frontend
- React + TypeScript
- React Router DOM - Navegación
- Axios - Cliente HTTP
- Bootstrap 5 - Estilos y componentes
- React Toastify - Notificaciones
- Vite - Bundler y dev server
- Context API - Gestión de estado

---



