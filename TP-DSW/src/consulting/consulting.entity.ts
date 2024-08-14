import { Entity, Property,  Collection, ManyToMany, Rel} from "@mikro-orm/core";
import { BaseEntity } from "../shared/baseEntity.entity.js";
import { User } from "../user/user.entity.js";

@Entity()
export class Consulting extends BaseEntity{ 
        //public id: number
        @Property({nullable: false})
        street!: string
        
        @Property({nullable : false})
        alt_street!: number

        /*@ManyToMany (() => User, {nullable: false}) 
        user!: Rel<>*/

}