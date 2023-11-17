import { Component } from '@angular/core';
import { Comentario, ComentarioService } from 'src/app/services/comentario-service.service';


@Component({
  selector: 'app-comentario-usuario',
  templateUrl: './comentario-usuario.component.html',
  styleUrls: ['./comentario-usuario.component.css']
})
export class ComentarioUsuarioComponent {
  allComentarios: string[] = [];


  constructor(private ComentarioService: ComentarioService) {
    this.allComentarios = this.ComentarioService.getComentarios();
    console.log(this.allComentarios);
  }

}
