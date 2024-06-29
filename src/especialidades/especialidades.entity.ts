
import { Property, Entity, ManyToOne, Rel} from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.entity.js";
import { Medicos } from "../medicos/medicos.entity.js";


@Entity()

export class Especialidades extends BaseEntity {
    @Property({nullable: false})
    id!: string;

    @Property({nullable: false})
    descEsp!: string;
    
    

}