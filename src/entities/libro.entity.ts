import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Libro {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property()
  author!: string;

  @Property()
  publicationYear!: number;

  @Property({ nullable: true })
  genre?: string;

  // Agrega más propiedades según lo que necesites para tu modelo de Libro
}

export { Libro as Book };  // Aquí exportamos Libro como Book
