import { Component, OnInit } from '@angular/core';
import { UsuarioActualService } from '../servicios/usuario-actual.service';
import { Usuario, UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

	LARGO_MINIMO_CONTRASENIA=8;
	LARGO_MINIMO_NOMBRE_USUARIO=2;
	LARGO_MINIMO_NOMBRE_COMPLETO=5;
	CANTIDAD_MAXIMA_TOKENS_GENERADOS=100000;

  usuarioActual:Usuario={} as Usuario;
  amigos:Usuario[]=[];
  
  console=console;

  /* 
	usuarioActual=Usuario logueado
  */

  constructor(
    private usuarioActualService:UsuarioActualService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuarioActual=this.usuarioActualService.getUsuarioActual() as Usuario;
    this.console.log(this.usuarioActual);
  }

}
