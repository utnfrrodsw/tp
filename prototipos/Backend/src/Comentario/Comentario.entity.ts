import { ObjectId } from 'mongodb';

export class Comentario {
    constructor(
        public comentario: string,
        public usuario: ObjectId,
        public _id?: ObjectId
    ) { }
}