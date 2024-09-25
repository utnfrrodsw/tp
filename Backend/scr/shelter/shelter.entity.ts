import { 
  Entity,
  Property,
  Collection,
  ManyToMany,
  ManyToOne,
  Cascade,
  Rel
} from "@mikro-orm/core";
import { BaseEntity } from "../zshare/db/baseEntity.entity.js";
import { Rescue } from "../rescue/rescue.entity.js";
import { Zone } from "../zone/zone.entity.js";
import { Vet } from "../vet/vet.entity.js";
@Entity()
export class Shelter extends BaseEntity {
  [x: string]: any;
  @Property({nullable: false, unique: true})
  name!: string

  @Property()
  address!: string

  @Property()
  max_capacity!: number

  @ManyToOne(() => Zone, {nullable: false})
  zone!: Rel<Zone>;

  @ManyToMany(() => Rescue, (rescue) => rescue.shelters, {  owner: true, nullable: true,   cascade: [Cascade.ALL] }, )
  rescues = new Collection<Rescue>(this);

  @ManyToOne(() => Vet, {  nullable: true,   cascade: [Cascade.ALL] }, )
  vet?: Rel<Vet>; 
}
