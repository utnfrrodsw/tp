import { Component, OnInit} from '@angular/core';
import { UsuarioService,Usuario } from './servicios/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'proyecto';

  usuarios: Usuario[]=<any>[];

  constructor(private usuarioService: UsuarioService){}
  
  ngOnInit() {
    this.usuarioService
      .getAll()
      .subscribe((result: any)=>{
        this.usuarios=result;
      });
  }
}
