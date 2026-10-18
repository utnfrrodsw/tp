import type { Request, Response, NextFunction } from "express";

export class UploadController {
  public upload = async (req: Request, res: Response, next: NextFunction) =>{
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No se recibió ningún archivo",
        });
      }

      return res.status(201).json({
        id: req.file.filename,
        url: req.file.path,
      });
    } catch (error) {
      next(error);
    }
  }
}

