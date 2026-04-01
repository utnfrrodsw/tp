PASOS PARA INICIALIZAR EL PROGRAMA (uso bash)
- luego de clonar, instalar las dependencias (que estan ignoradas en github) con npm install 
- crear una BD en mysql para los destinos 
- crear un archivo .env en la raiz del proyecto y copiar los datos de .env.example, luego completar cada campo con los datos de tu BD creada y de usuario de mysql. (esto es para que el programa funcione con tu BD)

instalar:
- npm install express sequelize mysql
- npm install --save-dem nodemon
- npm intall dotenv

npm run dev PARA EJECUTAR PROYECTO
- la api restful para destinos esta funcionando en http://localhost:3001/api/destinos
- se pueden probar los endpoints con POSTMAN (uso ese)
- ahi hago los get, post, delete , put
