import type { $Enums } from "@/database/prisma.js";

export class User {
    constructor(
        public userName: string,
        public email: string,
        public password_hash: string,
        public rol: $Enums.EnumRol,
        public status?: boolean,
        public validationStatus?: boolean,
        public urlPicture?: string,
        public id_user?: string,
    ) { }
}
 