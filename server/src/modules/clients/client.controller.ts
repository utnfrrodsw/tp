import type { NextFunction, Request, Response } from "express";
import { emitEvent } from "@/websocket.js";
import { EVENTS } from "@/shared/events.js";
import type { IdDto } from "@/shared/common.schema.js";
import type { ModifyClientDto, CreateClientDto, ClientQueryDto } from "./client.schema.js";
import type { ClientService } from "./client.service.js";

export class ClientController {
    constructor(private service: ClientService) { }

    public createClient = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.validated.body as CreateClientDto;

        try {
            const newClient = await this.service.create(data);
            emitEvent(EVENTS.clientChanged, newClient);
            return res.status(201).json(newClient);
        } catch (error) {
            next(error);
        }
    };

    // Cubre listado, búsqueda por nombre/email/cuit y filtro por categoría
    // (lo que antes era getPartialClient) en un solo endpoint.
    public getAllClients = async (req: Request, res: Response, next: NextFunction) => {
        const query = req.validated.query as ClientQueryDto;

        try {
            res.json(await this.service.findAll(query));
        } catch (error) {
            next(error);
        }
    };

    public getOneClient = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const client = await this.service.findById(id);

            if (!client) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }

            return res.json(client);
        } catch (error) {
            next(error);
        }
    };

    public modifyClient = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;
        const data = req.validated.body as ModifyClientDto;

        try {
            const modifiedClient = await this.service.update(id, data);
            emitEvent(EVENTS.clientChanged, modifiedClient);
            return res.json(modifiedClient);
        } catch (error) {
            next(error);
        }
    };

    public deleteClient = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const client = await this.service.update(id, { status: false });

            if (!client) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }

            emitEvent(EVENTS.clientChanged, client);
            return res.json(client);
        } catch (error) {
            next(error);
        }
    };
}