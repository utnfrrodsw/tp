import { Component, OnInit } from '@angular/core';
import { Permiso } from '../servicios/permiso.service';
import { UsuarioActualService } from '../servicios/usuario-actual.service';
import {Router} from "@angular/router";
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

  puedeGenerarTokens:boolean = false;
  
  console=console;

  busquedaID=0;
  usuariosEncontrados:Usuario[] = [];

  constructor(
    private usuarioActualService:UsuarioActualService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioActualService.getUsuarioActual().subscribe((usuario:any) => {
      this.usuarioActual= usuario;
      
      this.puedeGenerarTokens=this.usuarioActual.permisos?.some((per:Permiso)=>per.ID==1) || false;
    });

    this.console.log(this.usuarioActual);
  }

  busqueda(e:Event){
    let busquedaID=++this.busquedaID;

    let consulta=(e.target as HTMLInputElement).value.trim();

    if(consulta.length>3)
      this.usuarioService
        .buscarDifusamentePorNombre(consulta)
        .subscribe((result: any)=>{
          if(this.busquedaID==busquedaID)
            this.usuariosEncontrados=result;
        });
    else this.usuariosEncontrados=[];
  }
}
