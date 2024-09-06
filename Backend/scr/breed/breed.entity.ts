import { 
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Cascade,
  Collection
} from "@mikro-orm/core";
import { BaseEntity } from "../zshare/db/baseEntity.entity.js";
import { Animal } from "../animal/animal.entity.js";
@Entity()
export class Breed extends BaseEntity {
  @Property({nullable: false, unique: true})
  name!: string

  @Property()
  description!: Date

  @OneToMany (() => Animal, (animal) => animal.breed, {cascade: [Cascade.ALL]})
  animals = new Collection<Animal>(this)
}