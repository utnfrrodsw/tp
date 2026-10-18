export class Client {
    constructor(
        public clientName: string,
        public clientEmail: string,
        public clientPhone: string,
        public cuit: string,
        public id_client_type?: string,
        public id_client?: string,
        public dateOfRegistration?: Date,
        public status?: boolean,
    ) { }
}