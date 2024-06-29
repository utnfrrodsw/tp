import express from "express";
import { add, findAll, findOne,update, remove  } from "./medicos.controller.js";
import sanitizeMedicosInput from "./medicos.middleware.js";

export const router = express.Router();

router
  .get("/", findAll)
  .get("/:id", findOne)
  .post("/", sanitizeMedicosInput, add)
  .put("/:id", sanitizeMedicosInput, update)
  .patch("/:id", sanitizeMedicosInput, update)
  .delete("/:id", remove);


  