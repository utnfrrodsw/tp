// src/entities/libro.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Categoria } from './categoria.entity';
import { Editorial } from './editorial.entity';
import { Autor } from './autor.entity';
import { Saga } from './saga.entity'; 

@Entity()
export class Libro {
  @PrimaryKey()
  id!: number;

  @Property()
  nombre!: string;

  @Property()
  sinopsis!: string;

  @ManyToOne(() => Autor)
  autor!: Autor;

  @ManyToOne(() => Categoria)
  categoria!: Categoria;  // Relación con Categoria

  @ManyToOne(() => Editorial)
  editorial!: Editorial;  // Relación con Editorial

  @ManyToOne(() => Saga, { nullable: true })  
  saga?: Saga;
}
