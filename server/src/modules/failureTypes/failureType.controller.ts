import type { ModifyFailureTypeDto, FailureTypeQueryDto, NewFailureTypeDto } from './failureType.schema.js';
import type { Request, Response, NextFunction } from 'express';
import type { FailureTypeService } from './failureType.service.js';
import type { IdDto } from "@/shared/common.schema.js";
import { emitEvent } from "@/websocket.js";
import { EVENTS } from "@/shared/events.js";

export class FailureTypeController {
    constructor(private service: FailureTypeService) { }

    public getAllFailureType = async (req: Request, res: Response, next: NextFunction) => {
        const query = req.validated.query as FailureTypeQueryDto;

        try {
            res.json(await this.service.findAll(query));
        } catch (error) {
            next(error);
        }
    };

    public getOneFailureType = async (req: Request, res: Response, next: NextFunction) => {
        const params = req.validated.params as IdDto;

        try {
            res.json(await this.service.findById(params.id));
        } catch (error) {
            next(error);
        }
    };

    public newFailureType = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.validated.body as NewFailureTypeDto;

        try {
            const newTypeFailure = this.service.create(data);
            emitEvent(EVENTS.failureTypeChanged, newTypeFailure);
            return res.status(201).json(newTypeFailure);
        } catch (error) {
            next(error);
        }
    }

    public deleteFailureType = async (req: Request, res: Response, next: NextFunction) => {
        const params = req.validated.params as IdDto;

        try {
            await this.service.delete(params.id);
            emitEvent(EVENTS.failureTypeDeleted, { id: params.id });
            return res.status(200).json({ message: 'Type tailure deleted successfully' });
        } catch (error) {
            next(error)
        }
    }

    public modifyFailureType = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.validated.body as ModifyFailureTypeDto;
        const params = req.validated.params as IdDto

        try {
            const updatedFailureType = await this.service.update(params.id, data)
            emitEvent(EVENTS.failureTypeChanged, updatedFailureType);
            res.json(updatedFailureType);
        } catch (error) {
            next(error);
        }
    };
};