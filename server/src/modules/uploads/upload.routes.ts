import { Router } from "express";
import { UploadController } from "./upload.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";

const ctrl = new UploadController();

const router = Router();

router.post(
  "/",
  upload.single("file"),
  ctrl.upload
);

export default router;