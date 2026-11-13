import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    description: 'Category ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Herramientas',
    description: 'Category name',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  name: string;

  @ApiProperty({
    example: 'herramientas',
    description: 'Category SLUG - for SEO and filtering',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 'Martillos, destornilladores, llaves y más.',
    description: 'Category description',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: true,
    description: 'Whether the category is active',
    default: true,
  })
  @Column('bool', { default: true, name: 'is_active' })
  isActive: boolean;

  @ApiProperty({
    type: () => Category,
    nullable: true,
    description: 'Parent category for subcategories',
  })
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: Category | null;

  @ApiProperty({ type: () => [Category], description: 'Subcategories list' })
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  // Relación con Product: se vinculará al implementar ProductsModule

  private normalizeSlug(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.name;
    }
    this.slug = this.normalizeSlug(this.slug);
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (this.slug) {
      this.slug = this.normalizeSlug(this.slug);
    }
  }
}

