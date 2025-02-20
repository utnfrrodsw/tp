import { ObjectId } from 'mongodb';

export class Pedido {
    constructor(
        public fecha: String,
        public usuario: ObjectId,
        public libro: ObjectId[],
        public estado: string = "Pendiente",
        public _id?: ObjectId
    ) { }
}