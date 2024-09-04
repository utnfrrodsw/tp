import { Db, ObjectId } from 'mongodb';
import crypto from 'node:crypto';


export class Torneo{
    constructor(
        public nombre_torneo: string,
        public fecha_inico_insc: string,
        public fecha_fin_insc: string,
        public fecha_inicio_torneo: string,
        public fecha_fin_torneo: string,
        public estado_tor: string,
        public ganador: string,
        public formato: string,
        public sucursal: string,
        public nro_adm: string, 
        public id ?: Number
    ) {}
}