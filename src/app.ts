import express from "express";

import { aRouter } from "./autor/autor.routes.js";

const app = express();

app.use(express.json());

app.use("/api/autores", aRouter);

app.use((_, res) => {
  return res.status(404).send({ message: "Recurso no encontrado" });
});

app.listen(3000, () => console.log("Running on port 3000"));
