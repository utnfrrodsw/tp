import { Component, OnInit } from '@angular/core';
import { Permiso } from '../servicios/permiso.service';
import { UsuarioActualService } from '../servicios/usuario-actual.service';
import {Router} from "@angular/router";
import { Usuario, UsuarioService,Amistad } from '../servicios/usuario.service';
import { TokensService } from '../servicios/tokens.service';

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
  
  // TODO DRY
  // TODO sort
  get amigosEntrantes() {
    return (this.usuarioActual?.amigos??[]).filter(ami=> ami.amistades.estado=='esperando' && ami.amistades.amigoID==this.usuarioActual.ID);
  }
  get amigosSalientes() {
    return (this.usuarioActual?.amigos??[]).filter(ami=> ami.amistades.estado=='esperando' && ami.amistades.amigoID!=this.usuarioActual.ID);
  }
  get amigosReales() {
    return (this.usuarioActual?.amigos??[]).filter(ami=> ami.amistades.estado!='esperando');
  }

  puedeGenerarTokens:boolean = false;
  tokensCirculando:number = 0;
  
  console=console;

  busquedaID=0;
  usuariosEncontrados:Usuario[] = [];

  constructor(
    private usuarioActualService:UsuarioActualService,
    private usuarioService: UsuarioService,
    private tokensService: TokensService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioActualService.getUsuarioActual()
      .subscribe({
        next:(usuario:any) => {
          this.usuarioActual= usuario;

          /* * Cada Usuario.amigos tiene un .amistad con los detalles de la invitación; estado y quien la mando */

          /* TODO Que solo se puedan enviar tokens a amigos */

          this.puedeGenerarTokens=this.usuarioActual.permisos?.some((per:Permiso)=>per.ID==1) || false;
          if(this.puedeGenerarTokens)
            this.tokensService
              .obtenerCantidadCirculando()
              .subscribe((result: any)=>{
                this.tokensCirculando=result;
              });
        }
        ,error:error=>{
          this.console.log(error);
          this.router.navigate(['/'])
        }
      });
  }

  busqueda(e:Event):void{
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

  invitar(e:Event):void {
    e.preventDefault();

    let usuarioID=(e.target as any)['usuarioID'].value;

    (document.getElementById('resultados') as HTMLFieldSetElement).disabled=true;
    this.usuarioService
      .invitar(usuarioID)
      .subscribe({
        next:(result: any)=>{
          /* TODO Guardar la invitación... en el usuario? que de ahí se tome directamente para el frontend, new Amistad(result)?? */

          let nuevoAmigo:Usuario=this.usuariosEncontrados.find(usu=>usu.ID==usuarioID) as Usuario;
          nuevoAmigo.amistades=({estado:'esperando',amigoID:usuarioID}) as Amistad;
          this.usuarioActual.amigos?.push(nuevoAmigo as Usuario);
        }
        ,error:error=>{
          this.console.log(error);
        }
        ,complete:()=>{
          (document.getElementById('resultados') as HTMLFieldSetElement).disabled=false;
        }
      })

  }

  eliminar(e:Event):void{
    console.log(e);
  }

  generar(e:Event):void{
    
  }
}
