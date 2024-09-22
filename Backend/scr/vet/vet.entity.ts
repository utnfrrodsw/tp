import { Entity, OneToMany, Property, Collection, Cascade, ManyToMany } from "@mikro-orm/core";
import { BaseEntity } from "../zshare/db/baseEntity.entity.js";
import { Shelter } from "../shelter/shelter.entity.js";

@Entity()
export class Vet extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  address!: string;

  @OneToMany(() => Shelter, shelter => shelter.vet, { cascade: [Cascade.ALL] })
  shelters = new Collection<Shelter>(this);

}
