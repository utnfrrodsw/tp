import { ObjectId } from 'mongodb';

export class Reseña {
    constructor(
        public comentario: string,
        public calificacion: number,
        public usuario: ObjectId,
        public libro: ObjectId,
        public _id?: ObjectId
    ) { }
}