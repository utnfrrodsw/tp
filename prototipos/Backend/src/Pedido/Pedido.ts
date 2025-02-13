import { ObjectId } from 'mongodb';

export class Pedido {
    constructor(
        public libro: ObjectId[],
        public fecha: Date,
        public usuario: ObjectId,
        public _id?: ObjectId
    ) { }
}