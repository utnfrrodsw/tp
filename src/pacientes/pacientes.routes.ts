import express from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./pacientes.controller.js";
import sanitizePacientesInput from "./pacientes.middleware.js";

export const router = express.Router();

router
  .get("/", findAll)
  .get("/:id", findOne)
  .post("/", sanitizePacientesInput, add)
  .put("/:id", sanitizePacientesInput, update)
  .patch("/:id", sanitizePacientesInput, update)
  .delete("/:id", remove);
