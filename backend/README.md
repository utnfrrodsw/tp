# Tienda Ferretería - Backend API

Backend desarrollado con **NestJS**, **TypeScript**, **PostgreSQL** y **TypeORM** para la materia Desarrollo de Software (DSW).

## Requisitos previos

* Node.js >= 20.x
* Docker y Docker Compose

## Configuración del entorno

1. Clonar el archivo de variables de entorno:
   ```bash
   cp .env.template .env
   ```
2. Iniciar la base de datos PostgreSQL mediante Docker:
   ```bash
   docker compose up -d
   ```
3. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

## Ejecución

* Modo desarrollo:
  ```bash
  npm run start:dev
  ```
* Documentación Swagger interactiva:
  Una vez iniciada la aplicación, ingresar en el navegador a: `http://localhost:3000/api`

