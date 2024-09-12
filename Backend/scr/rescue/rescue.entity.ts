import { Entity, OneToMany, Property, Collection, Cascade, ManyToMany } from "@mikro-orm/core";
import { BaseEntity } from "../zshare/db/baseEntity.entity.js";
import { Animal } from "../animal/animal.entity.js";
import { Shelter } from "../shelter/shelter.entity.js";

@Entity()
export class Rescue extends BaseEntity {
  @Property({ nullable: false, unique: true })
  recue_date!: Date;

  @Property()
  description!: string;

  @Property()
  comments!: string;

  @OneToMany(() => Animal, animal => animal.rescueClass, { cascade: [Cascade.ALL] })
  animals = new Collection<Animal>(this);

  @ManyToMany(() => Shelter, (shelter) => shelter.rescues, {
  cascade: [Cascade.ALL],
  owner: true,
  })
  shelters!: Shelter[]
}
