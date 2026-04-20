import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Newsletter {
  @PrimaryKey()
  id!: number;

  @Property()
  email!: string;

  @Property({ nullable: true })
  nombre?: string;

  @Property()
  fechaSuscripcion: Date = new Date();

  @Property({ default: true })
  activo: boolean = true;

  @Property({ nullable: true })
  fechaBaja?: Date;

  constructor(email: string, nombre?: string) {
    this.email = email;
    this.nombre = nombre;
  }
}
