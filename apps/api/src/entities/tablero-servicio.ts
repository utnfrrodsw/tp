import {
  Entity,
  ManyToOne,
  Property
} from '@mikro-orm/decorators/legacy';

import { Tablero } from './tablero.js';
import { Servicio } from './servicio.js';

@Entity({ tableName: 'tablero_servicio' })
export class TableroServicio {

  // Clave primaria compuesta: tablero_id + servicio_id, ambas también son FK
  @ManyToOne(() => Tablero, {
    primary: true,
    fieldName: 'tablero_id',
    deleteRule: 'cascade'
  })
  tablero!: Tablero;

  @ManyToOne(() => Servicio, {
    primary: true,
    fieldName: 'servicio_id',
    deleteRule: 'cascade'
  })
  servicio!: Servicio;

  @Property({
    type: 'Date',
    fieldName: 'guardado_en',
    nullable: true
  })
  guardadoEn?: Date;
}
