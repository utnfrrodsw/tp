import type { $Enums } from "@/database/prisma.js";
import type { Failure_Type } from "@/generated/prisma/client.js";

export class Failure {
    constructor(
        public id_failure_type: string,
        public id_order: string,
        public description: string,
        public id_failure?: string,
        public dateOfFailure?: Date,
        public status?: $Enums.EnumFailureStatus,
        // Relación opcional: solo viene poblada cuando el repository la
        // pide con `include` (update, y cualquier find que se agregue
        // a futuro). En create/delete queda undefined.
        public failureType?: Failure_Type,
    ) { }
}