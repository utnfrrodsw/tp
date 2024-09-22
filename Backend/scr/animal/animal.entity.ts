import { Entity, ManyToOne, PrimaryKey, Property, Cascade, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../zshare/db/baseEntity.entity.js";
import { Breed } from "../breed/breed.entity.js";
import { Rescue } from "../rescue/rescue.entity.js";
@Entity()
export class Animal extends BaseEntity {
  [x: string]: any;

  @Property({nullable: false, unique: true})
  name!: string

  @Property()
  rescue_date!: Date

  @Property()
  birth_date!: Date

  @ManyToOne(() => Breed, {nullable: false})
  breed!: Rel<Breed>;

  @ManyToOne(() => Rescue, {nullable: false})
  rescueClass!: Rel<Rescue>

}
