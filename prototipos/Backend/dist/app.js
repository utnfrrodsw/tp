import express from "express";
import { editorialRouter } from "./Editorial/Editorial.routes.js";
import { usuarioRouter } from "./Usuario/Usuario.routes.js";
import { autorRouter } from "./Autor/Autor.routes.js";
import { categoriaRouter } from "./Categoria/Categoria.routes.js";
const app = express();
app.use(express.json());
app.use("/api/usuarios", usuarioRouter);
app.use("/api/editoriales", editorialRouter);
app.use("/api/autores", autorRouter);
app.use("/api/categorias", categoriaRouter);
app.use((_, res) => {
    return res.status(404).send({ message: "Resource not found" });
});
app.listen(3000, () => {
    console.log("Server runnning on http://localhost:3000/");
});
//# sourceMappingURL=app.js.map