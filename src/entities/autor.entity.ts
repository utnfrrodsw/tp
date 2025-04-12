// src/entities/autor.entity.ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Autor {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @Property()
  apellido!: string;
}
