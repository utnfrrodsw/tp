import express, { NextFunction, Request, Response } from "express";
import { editorialRouter } from "./Editorial/Editorial.routes.js";
import { usuarioRouter } from "./Usuario/Usuario.routes.js";
import { autorRouter } from "./Autor/Autor.routes.js";
import { categoriaRouter } from "./Categoria/Categoria.routes.js";
import { libroRouter } from "./Libro/Libro.routes.js";
import { localidadRouter } from "./Localidad/Localidad.routes.js";
import { provinciaRouter } from "./Provincia/Provincia.routes.js";
import { formatoRouter } from "./formatoLibro/formatoLibro.routes.js";
import { comentarioRouter } from "./Comentario/Comentario.routes.js";
import cors from "cors";

const app = express();
//const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use("/api/libros", libroRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/editoriales", editorialRouter);
app.use("/api/autores", autorRouter);
app.use("/api/categorias", categoriaRouter);
app.use("/api/localidad", localidadRouter);
app.use("/api/provincia", provinciaRouter);
app.use("/api/formato", formatoRouter);
app.use("/api/comentario", comentarioRouter);

app.use((_, res) => {
	return res.status(404).send({ message: "Resource not found" });
});

app.listen(3000, () => {
	console.log("Server running on http://localhost:3000/");
});