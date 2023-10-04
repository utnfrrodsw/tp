const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const libroRoutes = require("./routes/libro.routes");
//const categoriaRoutes = require('./routes/categoria.routes');
const usuarioRoutes = require("./routes/usuario.routes");
//const provinciaRoutes = require('./routes/provincia.routes');
//const localidadRoutes = require('./routes/localidad.routes');
const editorialRoutes = require("./routes/editorial.routes");

app.use("/api/libros", libroRoutes);
//app.use('/api/categorias', categoriaRoutes)
app.use("/api/usuarios", usuarioRoutes);
//app.use('/api/provincias', provinciaRoutes)
//app.use('/api/localidades', localidadRoutes)
//app.use('/api/editoriales', editorialRoutes)

app.listen(PORT, () => {
	console.log(`Servidor listo en puerto ${PORT}`);
});
