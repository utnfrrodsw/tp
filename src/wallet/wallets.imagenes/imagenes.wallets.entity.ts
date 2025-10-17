import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';
import { Wallet } from '../wallet.entity.js';
import { Beneficio } from '../../beneficios/beneficios.entity.js';      
@Entity()
export class imagenesURL extends BaseEntity {
  @Property({ nullable: false, length: 2048 })
  url!: string;

  @Property({ nullable: false, default: false })
  esPrincipal: boolean = false;

@ManyToOne(() => Wallet ,{ nullable: true })
  wallet?: Rel<Wallet>;


  @ManyToOne(() => Beneficio, { nullable: true })
  beneficio?: Rel<Beneficio>;
}