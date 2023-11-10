# FastServices

FastServices representa una plataforma web de servicios, diseñada para brindar a los usuarios la facilidad de solicitar una variedad de servicios, incluyendo pero no limitándose a electricistas, fontaneros, y una amplia gama de opciones. Nuestra aplicación está diseñada para facilitar un proceso rápido y sencillo para que los clientes encuentren y soliciten los servicios que necesitan.

Además, FastServices ofrece la posibilidad de que profesionales se conviertan en proveedores de servicios registrados en nuestra plataforma. Como proveedor, tienes la capacidad de enviar presupuestos detallados, especificando fechas disponibles para llevar a cabo los servicios. Esto no solo permite una mayor visibilidad para tu negocio, sino que también simplifica el proceso de gestión y contratación de servicios para los usuarios. Nuestra plataforma se esfuerza por brindar una experiencia eficiente y efectiva tanto para los solicitantes de servicios como para los proveedores.

## Requisitos para su instalación

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
PORT="PuertoDeEjecucionDeLaApi"
ACCESS_TOKEN_SECRET= "agregar un codigo secreto"
REFRESH_TOKEN_SECRET= "agregar un codigo secreto"
API_URL= http://localhost:"PuertoDeEjecucionDeLaApi"/api
```

### Cliente (frontend)

Crea un archivo `.env` en el directorio `client` con el siguiente contenido:

```env
API_URL=http://localhost:"PuertoDeEjecucionDeLaApi"/api
```

## Ejecución

### Servidor (backend)

En el directorio `server`, ejecuta:

```bash
npm start
```

El servidor estará disponible en [http://localhost:"PuertoDeEjecucionDeLaApi"](http://localhost:"PuertoDeEjecucionDeLaApi").

### Cliente (frontend)

En el directorio `client`, ejecuta:

```bash
npm start
```

La aplicación de React estará disponible en [http://localhost:PuertoFront](http://localhost:PuertoFront).
```
