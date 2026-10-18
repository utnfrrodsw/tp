import type { BaseRepository, PaginatedResult } from "@/shared/base.repository.js";
import type { UserQueryDto } from "./user.schema.js"
import type { User } from "./user.entity.js";

export class UserService {
    constructor(private repo: BaseRepository<User>) { }

    findAll(query?: UserQueryDto): Promise<PaginatedResult<User>> {
        return this.repo.findAll(query);
    }

    findById(id: string): Promise<User | undefined> {
        return this.repo.findById(id);
    }
    
    create(input: Omit<User, "id">): Promise<User | undefined> {
        return this.repo.create(input);
    }

    update(id: string, input: Partial<User>): Promise<User | undefined> {
        return this.repo.update(id, input);
    }

    delete(id: string): Promise<{ id: string } | undefined> {
        return this.repo.delete(id);
    }
}
