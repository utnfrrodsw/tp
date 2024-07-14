import "reflect-metadata";
import express from "express";
import { aRouter } from "./autor/autor.routes.js";
import { orm, syncSchema } from "./shared/DB/orm.js";
import { RequestContext } from "@mikro-orm/core";
import { editorialRouter } from "./editorial/editorial.routes.js";
import { libroRouter } from "./libro/libro.routes.js";

const app = express();

app.use(express.json());

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});
//antes de las rutas y middlewares de negocio

app.use("/api/autores", aRouter);
app.use("/api/editoriales", editorialRouter);
app.use("/api/libros", libroRouter);

app.use((_, res) => {
  return res.status(404).send({ message: "Recurso no encontrado" });
});

await syncSchema(); // Sacar en producción.

app.listen(3000, () => console.log("Running on port 3000"));
