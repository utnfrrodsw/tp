import type { NextFunction, Request, Response } from "express";
import type { IdDto } from "@/shared/common.schema.js";
import type { RegisterAddedCostDto, ModifyAddedCostDto, AddedCostQueryDto } from "./addedcost.schema.js";
import type { AddedCostService } from "./addedcost.service.js";
import { emitEvent } from "@/websocket.js";

export class AddedCostController {
    constructor(private service: AddedCostService) { }

    public registerAddedCost = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.validated.body as RegisterAddedCostDto;

        try {
            const addedCost = await this.service.create(data);
            emitEvent("addedCost:changed", addedCost);
            return res.status(201).json(addedCost);
        } catch (error) {
            next(error);
        }
    };

    public getAllAddedCosts = async (req: Request, res: Response, next: NextFunction) => {
        const query = req.validated.query as AddedCostQueryDto;

        try {
            res.json(await this.service.findAll(query));
        } catch (error) {
            next(error);
        }
    };

    public getOneAddedCost = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const addedCost = await this.service.findById(id);

            if (!addedCost) {
                return res.status(404).json({ message: "Costo adicional no encontrado" });
            }

            return res.json(addedCost);
        } catch (error) {
            next(error);
        }
    };

    public getAddedCostsOfBudget = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const addedCosts = await this.service.findByBudgetId(id);
            return res.json(addedCosts);
        } catch (error) {
            next(error);
        }
    };

    public modifyAddedCost = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;
        const data = req.validated.body as ModifyAddedCostDto;

        try {
            const addedCost = await this.service.update(id, data);
            emitEvent("addedCost:changed", addedCost);
            return res.json(addedCost);
        } catch (error) {
            next(error);
        }
    };

    public deleteAddedCost = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const result = await this.service.delete(id);
            emitEvent("addedCost:deleted", { id });
            return res.json(result);
        } catch (error) {
            next(error);
        }
    };
    public getTotalByBudget = async (req: Request, res: Response) => {
        try {
            const { id_budget } = req.params;
            const total = await this.service.sumByBudgetId(String(id_budget));
            res.status(200).json({ total });
        } catch (error) {
            console.error("Error en getTotalByBudget:", error); // 👈 agregá esto
            res.status(500).json({ message: "Error al calcular el total de costos adicionales." });
        }
    };
}
