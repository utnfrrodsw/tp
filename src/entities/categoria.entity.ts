// src/entities/categoria.entity.ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Categoria {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;
}
