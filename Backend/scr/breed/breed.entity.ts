/*export class Breed {
    constructor(
        public name: string,
        public description: string,
        public id?: number,
    ){}
}*/

import { Entity, OneToMany, PrimaryKey, Property, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../zshare/db/baseEntity.entity.js";
import { Animal} from "../animal/animal.entity.js";
@Entity()
export class BreedClass extends BaseEntity {
    
  @Property({nullable: false, unique: true})
  name!: string

  @Property()
  description!: Date

  @OneToMany (() => Animal, (animal) => animal.breedClass, {cascade: [Cascade.ALL]})
  animals = new Collection<Animal>(this)

}