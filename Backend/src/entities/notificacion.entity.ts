import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { Usuario } from './usuario.entity';

export enum TipoNotificacion {
  NUEVA_RESENA = 'NUEVA_RESENA',           // Alguien reseñó un libro que te gusta
  NUEVA_REACCION = 'NUEVA_REACCION',       // Alguien reaccionó a tu reseña
  NUEVO_SEGUIDOR = 'NUEVO_SEGUIDOR',       // Alguien te empezó a seguir
  ACTIVIDAD_SEGUIDO = 'ACTIVIDAD_SEGUIDO', // Un usuario que sigues hizo algo
  RESPUESTA_RESENA = 'RESPUESTA_RESENA',   // Alguien respondió a tu reseña
  LIBRO_FAVORITO = 'LIBRO_FAVORITO',       // Actividad en libro de tus favoritos
  RESENA_RECHAZADA = 'RESENA_RECHAZADA'    // Tu reseña fue rechazada por moderación
}

@Entity()
export class Notificacion {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Usuario)
  usuario!: Usuario;

  @Enum(() => TipoNotificacion)
  tipo!: TipoNotificacion;

  @Property()
  mensaje!: string;

  @Property()
  leida: boolean = false;

  @Property({ type: 'json', nullable: true })
  data?: any; // Datos adicionales (ID del libro, usuario, reseña, etc.)

  @Property()
  createdAt: Date = new Date();

  @Property({ nullable: true })
  url?: string; // URL a la que redirigir al hacer click
}
