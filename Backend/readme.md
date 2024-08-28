comandos iniciar proyecto 
-npm init -y
-npm i express  
-npm i typescript -D
-npx tsc --init      

activar propiedades de typescript
-"rootDir": "./src",  
-"outDir": "./dist", 
-npx tsc

instalar modulo para auto compilar! simil nodemon
-npm i ts-node-dev -D
-"dev": "ts-node-dev --respawn src/index.ts" (crear script)

-------------------------------TypeORM-------------------------------
Install the npm package:

npm install typeorm --save

You need to install reflect-metadata shim:

npm install reflect-metadata --save

and import it somewhere in the global place of your app (for example in app.ts):

import "reflect-metadata"

You may need to install node typings:

npm install @types/node --save-dev

Install a database driver:

for MySQL or MariaDB

npm install mysql --save (you can install mysql2 instead as well)

for PostgreSQL or CockroachDB

npm install pg --save

for SQLite

npm install sqlite3 --save

for Microsoft SQL Server

npm install mssql --save

for sql.js

npm install sql.js --save

for Oracle

npm install oracledb --save

