export class Payment {
    constructor(
        public id_payment_type: string,
        public id_budget: string,
        public amount: number,
        public id_payment?: string,
        public dateOfPayment?: Date,
    ) { }
}
