import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Enum } from '@mikro-orm/core';
import { Usuario } from './Usuario';  
import { Categoria } from './Categoria';  
import { Subasta } from './Subasta'; 
import { CompraItem } from './CompraItem'; 

export enum Talle {
  XS = 'XS',
  S = 'S', 
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL'
}

export enum CondicionCamiseta {
  NUEVA = 'Nueva',
  USADA = 'Usada',
  VINTAGE = 'Vintage'
}

export enum EstadoCamiseta {
  DISPONIBLE = 'disponible',
  VENDIDA = 'vendida',
  EN_SUBASTA = 'en_subasta',
  INACTIVA = 'inactiva'
}

@Entity()
export class Camiseta {
  @PrimaryKey()
  id!: number;

  @Property()
  titulo!: string;

  @Property({ type: 'text', nullable: true })
  descripcion?: string;

  @Property()
  equipo!: string;

  @Property()
  temporada!: string;

  @Enum(() => Talle)
  talle!: Talle;

  @Enum(() => CondicionCamiseta)
  condicion!: CondicionCamiseta;

  @Property({ nullable: true })
  imagen?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  precioInicial!: number;

  @Property({ default: false })
  esSubasta: boolean = false;

  @Property({ default: 1 })
  stock: number = 1;

  @Enum(() => EstadoCamiseta)
  estado: EstadoCamiseta = EstadoCamiseta.DISPONIBLE;

  @Property()
  fechaCreacion: Date = new Date();  // ✅ AGREGAR: Para ordenamiento en AdminController

  @Property()
  fechaPublicacion: Date = new Date();

  // Relaciones
  @ManyToOne('Usuario')
  vendedor!: Usuario;

  @ManyToOne('Categoria', { nullable: true })
  categoria?: Categoria;

  @OneToMany('Subasta', 'camiseta')
  subastas = new Collection<Subasta>(this);

  @OneToMany(() => CompraItem, item => item.camiseta)
  compraItems = new Collection<CompraItem>(this);

  constructor(
    titulo: string,
    descripcion: string,
    equipo: string,
    temporada: string,
    talle: Talle,
    condicion: CondicionCamiseta,
    imagen: string,
    precioInicial: number,
    vendedor: Usuario
  ) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.equipo = equipo;
    this.temporada = temporada;
    this.talle = talle;
    this.condicion = condicion;
    this.imagen = imagen;
    this.precioInicial = precioInicial;
    this.vendedor = vendedor;
  }
}

