import type { $Enums } from "@/database/prisma.js";
 
export class StatusHistory {
    constructor(
        public id_order: string,
        public id_user: string,
        public status: $Enums.EnumOrderStatus,
        public id_status_history?: string,
        public dateOfChange?: Date,
        public comment?: string,
        // Solo viene poblado cuando el repository lo pide con include
        // (findByOrderId). Sin esto, el frontend siempre cae al fallback
        // "Usuario" / avatar genérico.
        public user?: { userName: string; urlPicture?: string },
    ) { }
}