// src/entities/usuario.entity.ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

export type RolUsuario = 'usuario' | 'admin';

@Entity()
export class Usuario {

  @PrimaryKey()
  id!: number;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property()
  username!: string;

  // 👇 Nuevo campo de rol, con valor por defecto “usuario”
  @Property({ columnType: 'varchar(20)' })
  rol: RolUsuario = 'usuario';

  @Property({ nullable: true })
  refreshToken?: string;

  /* ---------- Métodos utilitarios ---------- */
  async validatePassword(password: string): Promise<boolean> {
    // Aquí deberías usar bcrypt.compare
    return this.password === password;
  }

  async hashPassword() {
    // Aquí deberías usar bcrypt.hash
  }
}
