import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core'
import { Specialty } from '../specialty/specialty.entity.js'

@Entity()
export class Specialty_price {
  @Property({ nullable: false })
  vigDate!: Date

  @Property ({ nullable: false})
  cost!: number

  @ManyToOne(() => Specialty, {nullable: false})
  specialty!: Rel<Specialty>;
}