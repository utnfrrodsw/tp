import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Comentario {
  comentario: string;
}

@Injectable({
  providedIn: 'root'
})

export class ComentarioService {

  private comentarios: string[] = [
    'Excelente Libro',
    'El mejor libro que he leido',
    /*{
      comentario: '!Excelente Libro!'
    },
    {
      comentario: '!El mejor libro que he leido!'
    },*/

  ];

  getComentarios(): string[] {
    console.log(this.comentarios);
    return this.comentarios;
  }

  agregarComentario( comentario: string): void {
    this.comentarios.push(comentario);
  }

  eliminarComentario(index: number): void {
    this.comentarios.splice(index, 1);
  }

  constructor() { }
}
