import { ObjectId } from 'mongodb';

export class Pedido {
    constructor(
        public fecha: String,
        public usuario: ObjectId,
        public libro: ObjectId[],
        public _id?: ObjectId
    ) { }
}