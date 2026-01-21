import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Camiseta } from './Camiseta';  

@Entity()
export class Categoria {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @Property({ nullable: true })
  descripcion?: string;

  @Property()
  activa: boolean = true;

  // Relaciones
  @OneToMany('Camiseta', 'categoria')
  camisetas = new Collection<Camiseta>(this);

  constructor(nombre: string, descripcion?: string) {
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}
