import express, { NextFunction, Request, Response } from "express";
import { editorialRouter } from "./Editorial/Editorial.routes.js";
import { usuarioRouter } from "./Usuario/Usuario.routes.js";
import { autorRouter } from "./Autor/Autor.routes.js";
import { categoriaRouter } from "./Categoria/Categoria.routes.js";
import { libroRouter } from "./Libro/Libro.routes.js";
import { localidadRouter } from "./Localidad/Localidad.routes.js";
import { provinciaRouter } from "./Provincia/Provincia.routes.js";
import cors from "cors";
const app = express();
//const cors = require('cors');



app.use((cors, res, next) => {
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

app.use(cors({
	origin: ['*']
}));
  

app.use(express.json());



app.use("/api/editoriales/:id/libros", libroRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/editoriales", editorialRouter);
app.use("/api/autores", autorRouter);
app.use("/api/categorias", categoriaRouter);
app.use("/api/localidad", localidadRouter);
app.use("/api/provincia", provinciaRouter);


app.use((_, res) => {
	return res.status(404).send({ message: "Resource not found" });
});

app.listen(3000, () => {
	console.log("Server runnning on http://localhost:3000/");
});
