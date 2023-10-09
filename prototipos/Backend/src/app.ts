import express, { NextFunction, Request, Response } from "express";
import { editorialRouter } from "./Editorial/Editorial.routes.js";
import { usuarioRouter } from "./Usuario/Usuario.routes.js";

const app = express();
app.use(express.json());

app.use("/api/usuarios", usuarioRouter);
app.use("/api/editoriales", editorialRouter);

app.use((_, res) => {
	return res.status(404).send({ message: "Resource not found" });
});

app.listen(3000, () => {
	console.log("Server runnning on http://localhost:3000/");
});
