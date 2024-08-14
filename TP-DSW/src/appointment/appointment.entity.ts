import { Entity, Property, Collection} from "@mikro-orm/core";
import { BaseEntity } from "../shared/baseEntity.entity.js";


@Entity()
export class Appointment extends BaseEntity{
        
        //appoNumber !: number
        @Property({nullable: false, unique: false})
        appoDate !: Date
        @Property({nullable: true, unique: false})
        assisted !: boolean
}