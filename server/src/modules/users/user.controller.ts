import type { NextFunction, Request, Response } from 'express';
import type { ModifyUserDto, UserQueryDto } from './user.schema.js';
import type { UserService } from './user.service.js';
import type { User } from './user.entity.js';
import type { IdDto } from '@/shared/common.schema.js';

export interface UserResponseDto {
    userName: string,
    email: string,
    rol: string,
    status?: boolean,
    validationStatus?: boolean,
    urlPicture?: string,
    id_user?: string,
}

export class UserController {
    constructor(private service: UserService) { }

    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        const query = req.validated.query as UserQueryDto;

        try {
            const users = await this.service.findAll(query);

            return res.json({
                ...users,
                data: users.data.map(this.toResponse),
            });
        } catch (error) {
            next(error);
        }
        };

    public async createUser(_req: Request, _res: Response) { }

    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.validated.params as IdDto;

        try {
            const user = await this.service.update(id, { status: false });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.json(this.toResponse(user));
        } catch (error) {
            next(error);
        }
    };

    public getOneUser =  async(req: Request, res: Response, next: NextFunction) => {
        const params = req.validated.params as IdDto;

        try {
            const user = await this.service.findById(params.id)

            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }

            res.json(this.toResponse(user));
        } catch (error) {
            next(error);
        }
    };

    public modifyUser =  async (req: Request, res: Response, next: NextFunction) => {
        const data = req.validated.body as ModifyUserDto;
        const params = req.validated.params as IdDto

        try {
            const user = await this.service.update(params.id, data)

            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            res.json(this.toResponse(user));
        } catch (error) {
            next(error);
        }
    };

    private toResponse(User: User): UserResponseDto {
        return {
            userName: User.userName,
            email: User.email,
            rol: User.rol,
            status: User.status,
            validationStatus: User.validationStatus,
            urlPicture: User.urlPicture,
            id_user: User.id_user,
        };
    }
}