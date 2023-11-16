import { ObjectId } from 'mongodb';

export class Provincia {
    constructor(
        public descripcion: string,
        public _id?: ObjectId,
    ) { }
}