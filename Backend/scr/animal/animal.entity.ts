/*export class Animal{
  constructor(
    public name: string, 
    public rescue_date: string,
    public birth_date: string,
    public id: string
  ){}
}*/

import { Entity, OneToMany, PrimaryKey, Property, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../zshare/db/baseEntity.entity";
@Entity()
export class Animal extends BaseEntity {

  @PrimaryKey()
  id?: number

  @Property()
  name!: string

  @Property()
  rescue_date!: Date

  @Property()
  birth_date!: Date

}