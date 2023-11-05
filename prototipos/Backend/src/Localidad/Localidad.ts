import { ObjectId } from "mongodb";

export class Localidad {
    constructor(
        public cod_postal: string,
        public descripcion: string,
        public provincia: ObjectId,
        public _id?: ObjectId,
    ) { }
}
