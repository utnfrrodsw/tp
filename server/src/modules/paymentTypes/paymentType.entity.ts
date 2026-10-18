import type { $Enums } from "@/database/prisma.js";

export class PaymentType {
    constructor(
        public paymentTypeName: string,
        public paymentMethod: $Enums.EnumPaymentMethod,
        public type_of_payment: $Enums.EnumPaymentType,
        public id_payment_type?: string,
        public percentage?: number,
    ) { }
}
 