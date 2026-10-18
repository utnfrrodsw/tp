import type { PrismaClient } from '@/database/prisma.js';
import type { QuerySchemaDto } from "./common.schema.js"

export interface Query extends QuerySchemaDto {
    search?: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
}

export interface PaginatedResult<T> {
    data: T[];
    metadata: {
        page: number;
        limit: number,
        total: number;
        totalPages: number;
    }
}

export interface Repository<T, Q extends Query = Query> {
    findAll(query?: Q): Promise<PaginatedResult<T>>,
    findById(id: string): Promise<T | undefined>,
    create(item: T): Promise<T>,
    update(id: string, item: Partial<T>): Promise<T | undefined>,
    delete(id: string): Promise<{ id: string } | undefined>
}

export abstract class BaseRepository<T, Q extends Query = Query>
    implements Repository<T, Q> {

    protected pagination = {
        defaultPage: 1,
        defaultLimit: 50,
        maxLimit: 200
    };

    constructor(
        protected readonly prisma: PrismaClient
    ) { }

    abstract findAll(query?: Q): Promise<PaginatedResult<T>>;
    abstract findById(id: string): Promise<T | undefined>;
    abstract create(item: T): Promise<T>;
    abstract update(id: string, item: Partial<T>): Promise<T | undefined>;
    abstract delete(id: string): Promise<{ id: string } | undefined>;

    protected getPagination(page?: number, limit?: number) {

        const currentPage =
            page ?? this.pagination.defaultPage;

        const currentLimit = Math.min(
            limit ?? this.pagination.defaultLimit,
            this.pagination.maxLimit
        );

        const skip =
            (currentPage - 1) * currentLimit;

        return {
            page: currentPage,
            limit: currentLimit,
            skip
        };
    }
}