import type { ModifyClientTypeDto, NewClientTypeDto, ClientTypeQueryDto } from "./clientType.schema.js";
import type { Request, Response, NextFunction } from "express";
import type { ClientTypeService } from "./clientType.service.js"
import type { IdDto } from "@/shared/common.schema.js";
import { emitEvent } from "@/websocket.js";
import { EVENTS } from "@/shared/events.js";

export class ClientTypeController {
    constructor(private service: ClientTypeService) { }

    public getAllClientTypes = async (req: Request, res: Response, next: NextFunction) => {
        const query = req.validated.query as ClientTypeQueryDto;
        
        try {
            res.json(await this.service.findAll(query));
        } catch (error) {
            next(error);
        }
    };

    public getOneClientTypes = async (req: Request, res: Response, next: NextFunction) => {
        const params = req.validated.params as IdDto;

        try {
            res.json(await this.service.findById(params.id));
        } catch (error) {
            next(error);
        }
    };

    public deleteClientType = async (req: Request, res: Response, next: NextFunction) => {
        const params = req.validated.params as IdDto;

        try {
            await this.service.delete(params.id);
            emitEvent(EVENTS.clientCategoryDeleted, params.id );
            res.status(200).json({ message: "Client deleted successfully" });
        } catch (error) {
            next(error);
        }
    };

    public newClientType = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.validated.body as NewClientTypeDto;

        try {
            const newClientType = await this.service.create(data);
            emitEvent(EVENTS.clientCategoryChanged, newClientType);
            return res.status(201).json(newClientType);
        } catch (error) {
            next(error);
        }
    }

    public modifyClientType = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.validated.body as ModifyClientTypeDto;
        const params = req.validated.params as IdDto

        try {
            const updatedClientType = await this.service.update(params.id, data)
            emitEvent(EVENTS.clientCategoryChanged, updatedClientType);
            res.json(updatedClientType);
        } catch (error) {
            next(error);
        }
    };
}