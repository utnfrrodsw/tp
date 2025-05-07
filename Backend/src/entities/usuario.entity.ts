import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Usuario {
  @PrimaryKey()
  id!: number;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property()
  username!: string;  // Asegúrate de tener esta propiedad

  @Property({ nullable: true })  
  refreshToken?: string;

  // Método para validar la contraseña
  async validatePassword(password: string): Promise<boolean> {
    // Lógica de validación de la contraseña (puedes usar bcrypt)
    return this.password === password;  // Simplificado para ejemplo
  }

  // Método para encriptar la contraseña
  async hashPassword() {
    // Aquí va la lógica para hash de contraseñas (puedes usar bcrypt o cualquier librería)
  }
}
