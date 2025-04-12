// src/entities/usuario.entity.ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Usuario {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  username!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Property()
  nombre!: string;
}
