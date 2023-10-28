import { ObjectId } from "mongodb";


export class Categoria{
    constructor(
        public id: number,
        public descripcion: string,
        public _id ?: ObjectId,
        ){}
}