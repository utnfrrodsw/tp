import { Entity, ManyToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';

@Entity()
export class Horario extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  diaSemana!: number; // 0-6 (domingo a sábado) o 1-7 (lunes a domingo)

  @Property({ type: 'time' })
  horaDesde!: string; // Formato 'HH:mm:ss'

  @Property({ type: 'time' })
  horaHasta!: string; // Formato 'HH:mm:ss'

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Rel<Usuario>; // Relación con Usuario
}
