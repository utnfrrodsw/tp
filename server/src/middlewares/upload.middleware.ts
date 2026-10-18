import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../cloudinary.config.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "taller-mecanico",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }),
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});