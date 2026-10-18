import type { $Enums } from "@/database/prisma.js";

export class Equipment {
    constructor(
        public tipo_equipment: $Enums.EnumEquipmentType,
        public brand: string,
        public model: string,
        public id_client: string,
        public id_equipment?: string,
        public observations?: string,
    ) { }
}
 