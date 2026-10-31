import {
  Entity,
  PrimaryKey,
  Property
} from '@mikro-orm/decorators/legacy';


@Entity({ tableName: 'eventos' })

export class Evento {

  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'string', length: 100 })
  nombre!: string;

  @Property({ type: 'string', columnType: 'text', nullable: true })
  descripcion?: string;

  @Property({
    type: 'Date',
    fieldName: 'creado_en',
    nullable: true
  })
  creadoEn?: Date;

  @Property({ type: 'string', length: 255, nullable: true })
  imagen?: string;

  // Indica si el evento todavía es un borrador (no visible/publicado) o ya está confirmado
  @Property({ type: 'boolean', default: true })
  draft: boolean = true;
}