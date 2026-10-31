import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne
} from '@mikro-orm/decorators/legacy';

import { Categoria } from './categoria.js';
import { User } from './usuario.js';

@Entity({ tableName: 'servicios' })
export class Servicio {

  @PrimaryKey({ type: 'number' })
  id!: number;

  @ManyToOne(() => Categoria, {
    fieldName: 'categoria_id',
    deleteRule: 'cascade'
  })
  categoria!: Categoria;

  @ManyToOne(() => User, {
    fieldName: 'usuario_id',
    deleteRule: 'cascade'
  })
  usuario!: User;

  @Property({ type: 'string', length: 100 })
  nombre!: string;

  @Property({
    type: 'string',
    columnType: 'text',
    nullable: true
  })
  descripcion?: string;

  @Property({
    type: 'string',
    length: 255,
    nullable: true
  })
  imagen?: string;

  @Property({
    type: 'Date',
    fieldName: 'creado_en'
  })
  creadoEn!: Date;

  // Estado de la publicación del servicio:
  // 'borrador'  -> la empresa todavia lo esta armando, no lo mando a revisar
  // 'revision'  -> la empresa lo mando y esta esperando que el administrador lo revise
  // 'publicado' -> el administrador lo aprobo y ya se ve en las busquedas
  @Property({
    type: 'string',
    length: 20,
    default: 'borrador'
  })
  estado: 'borrador' | 'revision' | 'publicado' = 'borrador';
}