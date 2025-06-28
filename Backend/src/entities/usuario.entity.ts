import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

export enum RolUsuario {
  USUARIO = 'usuario',
  ADMIN = 'admin',
}

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

  @Property({ columnType: 'varchar(20)' })
  rol: RolUsuario = RolUsuario.USUARIO;

  @Property({ nullable: true })
  refreshToken?: string;

  async validatePassword(password: string): Promise<boolean> {
    return this.password === password;
  }

  async hashPassword() {
    // Aquí deberías usar bcrypt.hash
  }
}
