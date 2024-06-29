import express from "express";
import { router as PacientesRouter } from "./pacientes/pacientes.routes.js";
import { router as MedicosRouter } from "./medicos/medicos.routes.js";
import { router as EspecialidadesRouter } from "./especialidades/especialidades.routes.js";
import { orm } from "../shared/orm.js";
import { RequestContext } from "@mikro-orm/mongodb";
import swaggerSpec from "../swagger/swagger.config.js";
import swaggerUi from "swagger-ui-express";



const app = express();
app.use(express.json());


app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use("/api/pacientes", PacientesRouter);
app.use("/api/medicos", MedicosRouter);
app.use("/api/especialidades", EspecialidadesRouter);

app.use("/api-endpoints", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
