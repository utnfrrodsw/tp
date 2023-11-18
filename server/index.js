const app = require('./src/app');

const { PORT } = require('./src/config');

app.set("port", PORT || 5000); //seteamos el puerto que nos da el servidor o el 5000


app.listen(app.get("port"), () => {
    console.log(`Server corriendo en el puerto ${app.get("port") || 5000}`);
});