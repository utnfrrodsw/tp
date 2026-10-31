import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne
} from '@mikro-orm/decorators/legacy';

import { Evento } from './evento.js';

@Entity({ tableName: 'categorias' })
export class Categoria {

  @PrimaryKey({ type: 'number' })
  id!: number;

  @ManyToOne(() => Evento, { 
    fieldName: 'evento_id',
    deleteRule: 'cascade'
  })
  evento!: Evento; 

  @Property({ type: 'string', length: 100 })
  nombre!: string;

  @Property({ type: 'string', columnType: 'text', nullable: true })
  descripcion?: string;

  @Property({
    type: 'Date',
    fieldName: 'creado_en'
  })
  creadoEn!: Date;
}