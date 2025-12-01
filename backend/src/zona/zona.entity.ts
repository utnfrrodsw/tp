import { Entity, Property, ManyToMany, Collection } from '@mikro-orm/core';
import { Usuario } from '../usuario/usuario.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Zona extends BaseEntity {
  @Property({ nullable: false }) //no va nullable es para  testears
  descripcionZona!: string;

  //apunta a usuario? como hago apuntarla a prestatario?

  @ManyToMany(() => Usuario, (usuario) => usuario.zonas, { nullable: true })
  usuarios = new Collection<Usuario>(this);
}
