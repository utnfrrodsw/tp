import type { EnumOrderStatus, Status_History as StatusHistory_P } from "@/generated/prisma/client.js";
import type { PaginatedResult } from "@/shared/base.repository.js";
import type { StatusQueryDto } from "./status.schema.js";
import { BaseRepository } from "@/shared/base.repository.js";
import { v7 as uuidv7 } from "uuid";
import { StatusHistory } from "./status.entity.js";
import type { PrismaClient, Prisma } from "@/generated/prisma/client.js";

type Db = PrismaClient | Prisma.TransactionClient;


export class StatusHistoryRepository extends BaseRepository<StatusHistory, StatusQueryDto> {

    public async findAll(query?: StatusQueryDto): Promise<PaginatedResult<StatusHistory>> {
        const { page, limit, skip } = this.getPagination(
            query?.page,
            query?.limit,
        );

        const [data, total] = await Promise.all([
            this.prisma.status_History.findMany({
                skip,
                take: limit,
                where: {
                    comment: {
                        contains: query?.search,
                    },
                },
                orderBy: (query?.sortBy && query?.sortOrder)
                    ? {
                        [query.sortBy]: query.sortOrder,
                    }
                    : undefined,
            }),

            this.prisma.status_History.count({
                where: {
                    comment: {
                        contains: query?.search,
                    },
                },
            }),
        ]);

        return {
            data: data.map((entry) => this.toDomain(entry)),
            metadata: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    public async findById(id: string): Promise<StatusHistory | undefined> {
        const entry = await this.prisma.status_History.findUnique({
            where: {
                id_status_history: id,
            },
        });

        return entry
            ? this.toDomain(entry)
            : undefined;
    }

    // Historial completo de una orden, ordenado del más viejo al más nuevo.
    // Incluye el usuario que hizo el cambio (nombre + foto) para que el
    // frontend no caiga siempre al fallback "Usuario".
    public async findByOrderId(id_order: string): Promise<StatusHistory[]> {
        const entries = await this.prisma.status_History.findMany({
            where: { id_order },
            orderBy: { dateOfChange: 'asc' },
            include: {
                user: {
                    select: {
                        userName: true,
                        urlPicture: true,
                    },
                },
            },
        });

        return entries.map((entry) => this.toDomain(entry));
    }

    public async create(item: StatusHistory, db: Db = this.prisma): Promise<StatusHistory> {
        const entry = await db.status_History.create({
            data: {
                id_status_history: uuidv7(),
                id_order: item.id_order,
                id_user: item.id_user,
                status: item.status,
                comment: item.comment,
            },
        });

        return this.toDomain(entry);
    }

    public async update(id: string, item: Partial<StatusHistory>, db: Db = this.prisma): Promise<StatusHistory | undefined> {
        const entry = await db.status_History.update({
            where: {
                id_status_history: id,
            },
            data: {
                id_order: item.id_order,
                id_user: item.id_user,
                status: item.status,
                dateOfChange: item.dateOfChange,
                comment: item.comment,
            },
        });

        return this.toDomain(entry);
    }

    public async delete(id: string): Promise<{ id: string } | undefined> {
        const entry = await this.prisma.status_History.delete({
            where: {
                id_status_history: id,
            },
        });

        return {
            id: entry.id_status_history,
        };
    };
    public async findLastByOrderIdAndStatus(id_order: string, status: EnumOrderStatus): Promise<StatusHistory | null> {
        const lastStatus = await this.prisma.status_History.findFirst({
            where: {
                id_order,
                status,
            },
            orderBy: {
              dateOfChange  : 'desc', 
            },
        });
        if (!lastStatus) return null;
        return this.toDomain(lastStatus);
    }

    private toDomain(entry: StatusHistory_P & { user?: { userName: string; urlPicture: string | null } }): StatusHistory {
        return new StatusHistory(
            entry.id_order,
            entry.id_user,
            entry.status,
            entry.id_status_history,
            entry.dateOfChange,
            entry.comment ?? undefined,
            entry.user
                ? { userName: entry.user.userName, urlPicture: entry.user.urlPicture ?? undefined }
                : undefined,
        );
    }
}