import "reflect-metadata";
import express from "express";
import { autorRouter } from "./autor/autor.routes.js";
import { orm, syncSchema } from "./shared/DB/orm.js";
import { RequestContext } from "@mikro-orm/core";
import { editorialRouter } from "./editorial/editorial.routes.js";
import { libroRouter } from "./libro/libro.routes.js";
import { politicaBibliotecaRouter } from "./politicaBiblioteca/politicaBiblioteca.routes.js";
import { politicaSancionRouter } from "./politicaSancion/politicaSancion.routes.js";
import { socioRouter } from "./socio/socio.routes.js";
import { prestamoRouter } from "./prestamo/prestamo.routes.js";
import { handleJsonSyntaxError } from "./middlewares/middleware.handleJsonSyntaxError.js";
import { handleInternalError } from "./middlewares/middleware.handleInternalError.js";
const app = express();

app.use(express.json());
app.use(handleJsonSyntaxError);

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use("/api/autores", autorRouter);
app.use("/api/editoriales", editorialRouter);
app.use("/api/libros", libroRouter);
app.use("/api/politicaBiblioteca", politicaBibliotecaRouter);
app.use("/api/politicasSancion", politicaSancionRouter);
app.use("/api/socios", socioRouter);
app.use("/api/prestamos", prestamoRouter);

app.use(handleInternalError);

app.use((_, res) => {
  return res.status(404).send({ message: "Recurso no encontrado" });
});

await syncSchema(); // Sacar en producción.

app.listen(3000, () => console.log("Running on port 3000"));
