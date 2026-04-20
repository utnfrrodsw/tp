// src/entities/usuario.entity.ts
import { Entity, PrimaryKey, Property, BeforeCreate, BeforeUpdate, Unique, Index } from '@mikro-orm/core';
import bcrypt from 'bcrypt';

export enum RolUsuario {
  USUARIO = 'usuario',
  ADMIN = 'admin',
}

@Entity()
@Unique({ properties: ['email'] }) // evita emails duplicados
@Unique({ properties: ['username'] }) // evita usernames duplicados
export class Usuario {

  @PrimaryKey()
  id!: number;

  @Property()
  @Index() // para búsquedas rápidas por email
  email!: string;

  @Property()
  password!: string;

  @Property()
  @Index()
  username!: string;

  @Property({ columnType: 'varchar(20)' })
  rol: RolUsuario = RolUsuario.USUARIO;

  @Property({ nullable: true })
  refreshToken?: string;

  // Campos de perfil adicionales
  @Property({ nullable: true })
  nombre?: string;

  @Property({ nullable: true })
  biografia?: string;

  @Property({ nullable: true })
  ubicacion?: string;

  @Property({ columnType: 'varchar(20)', nullable: true })
  genero?: 'masculino' | 'femenino' | 'otro';

  @Property({ nullable: true })
  avatar?: string;

  // Auditoría
  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @BeforeCreate()
  @BeforeUpdate()
  async hashPasswordHook(): Promise<void> {
    // Solo hashea si la password cambió y no está ya hasheada
    if (this.password && !this.password.startsWith('$2b$')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }
}
