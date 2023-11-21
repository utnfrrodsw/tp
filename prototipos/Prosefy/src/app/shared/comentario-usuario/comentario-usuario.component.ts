import { Component } from '@angular/core';
import { Comentario, ComentarioService } from 'src/app/services/comentario-service.service';


@Component({
  selector: 'app-comentario-usuario',
  templateUrl: './comentario-usuario.component.html',
  styleUrls: ['./comentario-usuario.component.css']
})
export class ComentarioUsuarioComponent {
  allComentarios: string[] = [];
  admin: boolean = false; //Esta variable debería de variar dependiendo de si el usuario es administrador o no


  constructor(private ComentarioService: ComentarioService) {
    this.allComentarios = this.ComentarioService.getComentarios();
    console.log(this.allComentarios);
  }

  eliminarComentario(index: number): void {
    this.ComentarioService.eliminarComentario(index);
    this.actualizarComentarios();
  }

  private actualizarComentarios(): void {
    this.allComentarios = this.ComentarioService.getComentarios();
  }

}
