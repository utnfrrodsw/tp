# FastServices

FastServices representa una plataforma web de servicios, diseñada para brindar a los usuarios la facilidad de solicitar una variedad de servicios, incluyendo pero no limitándose a electricistas, fontaneros, y una amplia gama de opciones. Nuestra aplicación está diseñada para facilitar un proceso rápido y sencillo para que los clientes encuentren y soliciten los servicios que necesitan.

Además, FastServices ofrece la posibilidad de que profesionales se conviertan en proveedores de servicios registrados en nuestra plataforma. Como proveedor, tienes la capacidad de enviar presupuestos detallados, especificando fechas disponibles para llevar a cabo los servicios. Esto no solo permite una mayor visibilidad para tu negocio, sino que también simplifica el proceso de gestión y contratación de servicios para los usuarios. Nuestra plataforma se esfuerza por brindar una experiencia eficiente y efectiva tanto para los solicitantes de servicios como para los proveedores.


## Requisitos para la instalación

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
ACCESS_TOKEN_SECRET= secret
REFRESH_TOKEN_SECRET= secret2
API_URL=http://localhost:PORTBACK/api
```

### Cliente (frontend)

Crea un archivo `.env` en el directorio `client` con el siguiente contenido:

```env
API_URL=http://localhost:PORTBACK/api
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
npm run dev
```

El servidor estará disponible en [http://localhost:PORTBACK](http://localhost:PORTBACK).

### Cliente (frontend)

En el directorio `client`, ejecuta:

```bash
npm start
```

La aplicación de React estará disponible en [http://localhost:PORTFRONT](http://localhost:PORTFRONT).
