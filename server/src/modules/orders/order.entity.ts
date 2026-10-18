import type { $Enums } from "@/database/prisma.js";
import type { Equipment, Client, Status_History, Failure } from "@/generated/prisma/client.js";
import type { Budget } from "@/modules/budgets/budget.entity.js"; // ajustá el path real si no es este

export class Order {
    constructor(
        public id_equipment: string,
        public id_order?: string,
        public nroOrder?: number,
        public id_user?: string,
        public status?: $Enums.EnumOrderStatus,
        public observations?: string,
        public equipmentPhotoUrl?: string,
        public dateOfEntry?: Date,
        public estimatedDate?: Date,
        public deliveryDate?: Date,
        public totalCharged?: number,
        //Relaciones para los Include
        public equipment?: Equipment & { client?: Client | null },
        public statusHistory?: Status_History[],
        public failures?: Failure[],
        public budget?: Budget, 
    ) { }
}