import { ObjectId } from "mongodb";

export class estado_torneo {
    constructor(
        public id: string,
        public nombre_estado: string,
        public _id ?: ObjectId
    ) { }
}