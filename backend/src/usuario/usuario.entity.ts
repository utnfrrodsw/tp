import { Entity, Property, ManyToOne, Cascade } from '@mikro-orm/core';

export abstract class Usuario {
  
  //id 
  @Propery()  
  mail!: string;
  @Propery()
  contrasena!: string;
  @Propery()
  TipoDoc!: string;
  @Propery()
  NumeroDoc!: number;

}

@Emtity()
export class Cliente extends Usuario {
  @Propery()
  telefono?: number;
  @Propery()
  nombre?: string;
  @Propery()
  apellido?: string;
  @Propery()
  direccion?: string;
}

@Emtity()
export class Prestatario extends Usuario {
  @Propery()
  nombreFantasia?: string;
  @Propery()
  descripcion?: string;
  @Propery()
  foto?: string; // aca se pone la ruta de la foto
}
