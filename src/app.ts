import express from "express";
import { router as PacientesRouter } from "./personas/pacientes/pacientes.routes.js";
import { router as MedicosRouter } from "./personas/medicos/medicos.routes.js";
import swaggerSpec from "../swagger/swagger.config.js";
import swaggerUi from "swagger-ui-express";

const app = express();
app.use(express.json());
app.use("/api-endpoints", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/pacientes", PacientesRouter);
app.use("/api/medicos", MedicosRouter);

app.use((_, res) => {
  return res
    .status(404)
    .json({ message: "Resource not found", error: true, data: null });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
  console.log(
    "Documentación de API disponible en http://localhost:3000/api-endpoints."
  );
});
