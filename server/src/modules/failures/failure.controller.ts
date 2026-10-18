import type { NextFunction, Request, Response } from "express";
import type { IdDto } from "@/shared/common.schema.js";
import type { CreateFailuresDto, ModifyFailuresDto } from "./failure.schema.js";
import type { FailureService } from "./failure.service.js";
import { emitEvent } from "@/websocket.js";
import { EVENTS } from "@/shared/events.js";

export class FailureController {
  constructor(private service: FailureService) { }

  public createFailures = async (req: Request, res: Response, next: NextFunction) => {
    const failures = req.validated.body as CreateFailuresDto;

    try {
      const created = await this.service.createMany(failures);
      emitEvent(EVENTS.failureChanged, created);
      return res.status(201).json({
        message: "Fallas registradas con éxito",
        failures: created,
      });
    } catch (error) {
      next(error);
    }
  };

  // Antes era getFailureOfEquipment; ahora la falla cuelga de la orden.
  public getFailuresOfOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated.params as IdDto;

    try {
      const failures = await this.service.findByOrderId(id);
      return res.status(200).json(failures);
    } catch (error) {
      next(error);
    }
  };

  public modifyFailure = async (req:Request, res:Response, next:NextFunction) => {
    const { id } = req.validated.params as IdDto;
    const updateFail = req.validated.body as ModifyFailuresDto;
    try{
      const updatedFailure = await this.service.update(id , updateFail)
      emitEvent(EVENTS.failureChanged, updatedFailure);
      return res.status(200).json({
        message: "Falla actualizada con exito",
        failure: updatedFailure,
      });
    }catch(e){
      next(e);
    }
  }
  public deleteFailure = async (req:Request, res:Response, next: NextFunction) => {
    const { id } = req.validated.params as IdDto;
    try{
      const deletedFailure = await this.service.delete(id);
      emitEvent(EVENTS.failureDeleted, deletedFailure);
      return res.status(200).json({
        message: 'Falla eliminada correctamente',
        res: deletedFailure
      })
    }catch(e){
      next(e);
    }
  }
  public getTotalByOrder = async (req: Request, res: Response) => {
      try {
          const { id_order } = req.params;
          const total = await this.service.sumFailureCosts(String(id_order));
          res.status(200).json({ total });
      } catch (error) {
          res.status(500).json({ message: "Error al calcular el total de fallas estimadas." });
      }
  };
}
