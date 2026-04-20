import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';

@Entity()
export class PasswordResetToken {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;

  @Property()
  token!: string;

  @Property()
  fechaCreacion: Date = new Date();

  @Property()
  fechaExpiracion: Date;

  @Property({ default: false })
  usado: boolean = false;

  constructor(usuario: Usuario, token: string) {
    this.usuario = usuario;
    this.token = token;
    // Expira en 1 hora
    this.fechaExpiracion = new Date(Date.now() + 60 * 60 * 1000);
  }
}
