# FastServices

FastServices es una aplicación web que permite a los usuarios solicitar servicios, como electricistas y fontaneros, de manera rápida y sencilla. Además, brinda la posibilidad a profesionales de registrarse como proveedores de servicios y enviar presupuestos con fechas disponibles para realizar los servicios.

## Requisitos

Asegúrate de tener instalada la versión 18 de Node.js.

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/FacuTaborra/FastServices.git
```

El repositorio está dividido en dos partes: el servidor (backend) y el cliente (frontend). Abre una terminal en cada directorio y ejecuta:

```bash
# Instalar dependencias del servidor
cd server
npm install

# Instalar dependencias del cliente
cd ../client
npm install
```

## Configuración de .env

### Servidor (backend)

Crea un archivo `.env` en el directorio `server` con el siguiente contenido:

```env
PORT=5000
ACCESS_TOKEN_SECRET=84c4a2c5-c807-4edc-b76e-1bc25bdc4db4
REFRESH_TOKEN_SECRET=dcfb7493-718c-495a-adc7-3dc3e792c122
API_URL=http://localhost:5000/api
```

### Cliente (frontend)

Crea un archivo `.env` en el directorio `client` con el siguiente contenido:

```env
API_URL=http://localhost:5000/api
```

## Configuración de la Base de Datos

1. Ve a la carpeta `db` en el directorio de la base de datos. Encuentra la estructura de la base de datos y cópiala.
2. Pégalala en tu servidor MySQL.

## Creación de Usuario para la Base de Datos

Crea un usuario para utilizar en la base de datos:

```bash
# Accede a MySQL con un usuario que tenga privilegios para crear usuarios
mysql -u root -p

# Ejecuta los siguientes comandos SQL dentro de MySQL
CREATE USER 'userRemote'@'localhost' IDENTIFIED BY 'remote321';
GRANT ALL PRIVILEGES ON *.* TO 'userRemote'@'localhost';
FLUSH PRIVILEGES;
```

## Ejecución

### Servidor (backend)

En el directorio `server`, ejecuta:

```bash
npm start
```

El servidor estará disponible en [http://localhost:5000](http://localhost:5000).

### Cliente (frontend)

En el directorio `client`, ejecuta:

```bash
npm start
```

La aplicación de React estará disponible en [http://localhost:3000](http://localhost:3000).
