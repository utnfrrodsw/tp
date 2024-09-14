import { 
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  Cascade,
  Collection,
  Rel
} from "@mikro-orm/core";
import { BaseEntity } from "../zshare/db/baseEntity.entity.js";
import { Zone } from "../zone/zone.entity.js"

@Entity()
export class Shelter extends BaseEntity {
  @Property({nullable: false})
  name!: string

  @Property({nullable: false})
  address!: string

  @Property({nullable: false})
  max_capacity!: number
  
  @ManyToOne(() => Zone, {nullable: false})
  zone!: Rel<Zone>;
}
