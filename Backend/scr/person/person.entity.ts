import { 
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Cascade,
  Collection
} from "@mikro-orm/core";
import { BaseEntity } from "../zshare/db/baseEntity.entity.js";
@Entity()
export class Person extends BaseEntity {
  @Property({nullable: false})
  name!: string

  @Property({nullable: false})
  surname!: string

  @Property({nullable: false})
  doc_type!: string

  @Property({nullable: false})
  doc_nro!: string

  @Property({nullable: true})
  email!: string

  @Property({nullable: true})
  phone!: string

  @Property({nullable: false})
  birthdate!: Date

  @Property({nullable: false})
  address!: string

  @Property({nullable: true})
  nroCuit!: number
}
