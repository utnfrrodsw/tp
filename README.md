Proyecto
Plataforma web que permite a refugios registrarse, publicar mascotas disponibles para adopción y gestionar los formularios recibidos de potenciales adoptantes. Los usuarios pueden explorar animales según distintas características y completar un formulario para iniciar el proceso de adopción. El objetivo es facilitar la conexión entre refugios y adoptantes de manera simple y organizada.

-Requisitos Previos

Git instalado

Node.js (versión: 18.x o superior).
Puedes verificar tu versión ejecutando: node -v

npm (Node Package Manager). Se instala automáticamente con Node.js.

-Instalación (BACK)
Clonar el repositorio. Comando:

git clone https://github.com/mariavictoriacontreras/backend_app.git
cd [proyecto_backend]

Instalar dependencias. Comando:

npm install
Configurar Variables de Entorno

npm run dev
# Inicia el servidor de desarrollo (en http://localhost:4000)

-Instalación (FRONT)
Clonar el repositorio. Comando:

git clone https://github.com/mariavictoriacontreras/frontend_app.git
cd [proyecto_frontend]

Instalar dependencias. Comando:

npm install
Configurar Variables de Entorno

Este proyecto usa MikroORM para manejar la base de datos.
Si es la primera vez que se inciia el backend, se deben aplicar las migraciones existentes:
npm run dev

# Inicia la aplicación React en modo desarrollo (http://localhost:5173)
