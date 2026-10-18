import type { Prisma, User as User_P } from "@/generated/prisma/client.js";
import type { PaginatedResult } from "@/shared/base.repository.js"
import type { UserQueryDto } from "./user.schema.js"
import { BaseRepository } from "@/shared/base.repository.js";
import { v7 as uuidv7 } from "uuid";
import { User } from "./user.entity.js";

export class UserRepository extends BaseRepository<User, UserQueryDto> {

    public findAll = async (query?: UserQueryDto): Promise<PaginatedResult<User>> => {
        const { page, limit, skip } = this.getPagination(
            query?.page,
            query?.limit
        );
        console.log("UserRepository.findAll query:", query?.ofValidationStatus);
        const where: Prisma.UserWhereInput = {
            ...(query?.search
                ? {
                    OR: [
                        {
                            email: {
                                contains: query.search,

                            },
                        },
                        {
                            userName: {
                                contains: query.search,

                            },
                        },
                    ],
                }
                : {}),
            ...(query?.ofRol
                ? {
                    rol: query.ofRol,
                }
                : {}),
            ...(query?.ofValidationStatus
                ? {
                    validationStatus: query.ofValidationStatus,
                }
                : {}),
        };


        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                where,
                orderBy: (query?.sortBy && query?.sortOrder) ? {
                    [query.sortBy]: query.sortOrder,
                } : undefined,
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: data.map((user) => this.toDomain(user)),
            metadata: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = await this.prisma.user.findUnique({
            where: {
                id_user: id,
            },
        });

        return user
            ? this.toDomain(user)
            : undefined;
    }

    public async create(item: User): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                ...item,
                id_user: uuidv7(),
            },
        });

        return this.toDomain(user);
    }

    public async update(id: string, item: Partial<User>): Promise<User | undefined> {
        const user = await this.prisma.user.update({
            where: {
                id_user: id,
            },
            data: {
                ...item,
            },
        });

        return this.toDomain(user);
    }

    public async delete(id: string): Promise<{ id: string } | undefined> {
        const user = await this.prisma.user.delete({
            where: {
                id_user: id,
            },
        });

        return {
            id: user.id_user,
        };
    }
    public async findByUsername(userName: string): Promise<User | undefined> {
        const user = await this.prisma.user.findFirst({
            where: { userName },
        });
        return user ? this.toDomain(user) : undefined;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        return user ? this.toDomain(user) : undefined;
    }

    public async updatePassword(id_user: string, password_hash: string): Promise<User | undefined> {
        const user = await this.prisma.user.update({
            where: { id_user },
            data: { password_hash },
        });
        return this.toDomain(user);
    }
    private toDomain(user: User_P): User {
        return new User(
            user.userName,
            user.email,
            user.password_hash,
            user.rol,
            user.status,
            user.validationStatus,
            user.urlPicture,
            user.id_user,
        );
    }
}