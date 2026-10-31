# Contactos para coordinar la defensa:
Franco Collado: 341 252 2600
Franco Massagli: 341 371 5847
Tomas Agustin Aleart: 341 394 9024

# Link al deploy ( sin necesidad levantar local )
https://planit-8k5i.vercel.app/

# Links al modelo y video (demo del sistema)
https://drive.google.com/drive/folders/1pC8MOQ4j7PGTVeKOBd9cnFKYB3b6aRF_?usp=drive_link

# Credenciales del deploy
   CLIENTE
Usuario: cliente@gmail.com
Contraseña: 123

   EMPRESA
Usuario: empresa@gmail.com
Contraseña: 123

   ADMINISTRADOR
Usuario: administrador@gmail.com
Contraseña: 123

# PlanIt

Marketplace para organizar eventos: las empresas publican servicios y los clientes los guardan en un tablero.

## Qué necesitás antes

Instalá [Node.js](https://nodejs.org) 20 o más nuevo. Al instalarlo también queda `npm`, que es lo que usa el proyecto para bajar las librerías.

## Cómo levantarlo

1. Abrí una terminal en la carpeta del proyecto (la que tiene este archivo).
2. Instalá las dependencias, una sola vez:

   ```bash
   npm install
   ```

3. Creá estos dos archivos de configuración en las ubicaciones indicadas. Reemplazá los valores de ejemplo por los datos de tu base de datos, tu proyecto de Supabase y tu cuenta de Mercado Pago. 

   **`.env` — en la raíz del proyecto**, al mismo nivel que este `README.md`:

 (Si bien estas credenciales no se deberían de subir a efectos del trabajo se detallan a continuación:)
   ```dotenv
   # Base de datos local PostgreSQL
   DB_HOST=aws-0-us-west-2.pooler.supabase.com
   DB_PORT=6543
   DB_USER=postgres.ecsqswzerzgcjohokrnx
   DB_PASSWORD=cumbianinja123_
   DB_NAME=postgres
  

   # API
   PORT=4000
   NODE_ENV=development
   
   #JWT_SECRET: clave secreta para firmar los tokens de sesión.#
   JWT_SECRET=2f4d3ea5e443a39bdf9ad044927f49171d25f414d7ad895a5caac76f86d29349

   mp_apikey=APP_USR-8ca4ab93-6d79-4a6a-bdcf-6e485265c7d0
   MP_ACCESS_TOKEN=APP_USR-3365520313045830-102515-3c9b62869008456b17d338426386933e-3793278414

   **`apps/web/.env` — dentro de la carpeta `apps/web/`**:

   ```dotenv
   # Dejar vacío en desarrollo: Vite envía /api a http://localhost:4000
   VITE_API_URL=

   # URL y clave anon/public de tu proyecto Supabase
   VITE_SUPABASE_URL=https://ecsqswzerzgcjohokrnx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjc3Fzd3plcnpnY2pvaG9rcm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NjEzNTUsImV4cCI6MjEwNjUzNzM1NX0.DpbUJog2YSfItjb20a2s0QRA6Rl56_5v1UZHUwMGncM
   ```


4. Arrancá el proyecto:

   ```bash
   npm run dev
   ```

Eso prende la API y la página al mismo tiempo, y abre el navegador. La página queda en http://localhost:5173 y la API en http://localhost:4000.

Para frenarlo, volvé a esa terminal y apretá `Ctrl + C`.



# Link del (PR)
https://github.com/utnfrrodsw/tp/pull/271
