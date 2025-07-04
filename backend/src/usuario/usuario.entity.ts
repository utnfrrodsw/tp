import { Entity, Property, OneToOne , Cascade,Rel, ManyToMany, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { Turno } from '../turno/turno.entity.js';
import { TipoServicio } from '../tipoServicio/tipoServ.entity.js';
import { Horario } from '../horario/horario.entity.js';
import { Zona } from '../zona/zona.entity.js';
@Entity()
export class Usuario extends BaseEntity {
  //id
  @Property({ nullable: false, unique: true })
  mail!: string;
  @Property({ nullable: false })
  contrasena!: string;
  @Property({ nullable: false })
  tipoDoc!: string;
  @Property({ nullable: false,unique: true })
  numeroDoc!: string;
  // Este es un campo opcional de cliente
  @Property({ nullable: true,unique: true })
  telefono?: string;
  @Property({ nullable: true })
  nombre?: string;
  @Property({ nullable: true })
  apellido?: string;
  @Property({ nullable: true })
  direccion?: string;
  // Este es un campo opcional de prestatario
  @Property({ nullable: true })
  nombreFantasia?: string;
  @Property({ nullable: true })
  descripcion?: string;
  @Property({ nullable: true })
  foto?: string; // aca se pone la ruta de la foto

  // Relación con Servicio
  @ManyToMany(() => Servicio, (servicio) => servicio.usuarios, {
    cascade: [Cascade.ALL],
    owner: true,
    nullable: true,
  })
  servicios = new Collection<Servicio>(this);
  //Relación con Turno
  @OneToMany(() => Turno, (turno) => turno.usuario, {
    cascade: [Cascade.ALL],
    nullable: true,
  })
  turnos = new Collection<Turno>(this);
  //Relación con TipoServicio
  @ManyToMany(() => TipoServicio, (tipoServ) => tipoServ.users, {
    cascade: [Cascade.ALL],
    owner: true,
    nullable: true,
  })
  tiposDeServicio = new Collection<TipoServicio>(this);

  @OneToMany(() => Horario, (horario) => horario.usuario, {
    cascade: [Cascade.ALL],
    nullable: true,
  })
  horarios = new Collection<Horario>(this);
  @ManyToMany(() => Zona, (zona) => zona.usuarios, {
    cascade: [Cascade.ALL],
    nullable: false,
    owner: true,
  })
  zonas = new Collection<Zona>(this);
}
