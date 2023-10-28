import { ObjectId } from "mongodb";

export class Categoria{
    constructor(
        public id: string,
        public descripcion: string,
        public _id?: ObjectId
        ){}
}