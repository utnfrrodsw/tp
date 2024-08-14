import { ObjectId } from "mongodb";

export class estado_torneo {
    constructor(
        public nombre_estado: string,
        public id ?: Number
    ) { }
}
