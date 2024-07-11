const app = require('./app');

app.listen(app.get('port'),() => {
    console.log("Servidor abierto en el puerto", app.get("port"));
});

