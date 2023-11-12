import { Component, OnInit } from '@angular/core';
import { UsuarioDetalladoService } from '../servicios/usuario-detallado.service';
import { Usuario, UsuarioService } from '../servicios/usuario.service';

declare var particlesJS: any; 

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  usuarioDetallado:(Usuario|undefined)=undefined;
  
  constructor(
    private usuarioDetalladoService:UsuarioDetalladoService,
    private usuarioService:UsuarioService
  ){}
  
  ngOnInit(): void {
    this.usuarioDetallado=this.usuarioDetalladoService.getUsuarioDetallado();
    
    if(this.usuarioDetallado==undefined){
      // this.volver()
      return;
    }

    particlesJS("particles", {
      "particles": {
        "number": {
          "value": this.usuarioDetallado?.tokens
          ,"density":{"enable":false}
        },"shape":{
          "type":"image"
          ,"image":{"src":"https://icongr.am/simple/jsonwebtokens.svg?size=18&color=FFD700"}
        },"size":{"value":10}
        ,"move":{"enable":true,"speed":6,"out_mode":"bounce"}
      }
      ,"interactivity":{
        "detect_on":"canvas"
        ,"events":{
          "onhover":{"enable":true,"mode":"repulse"}
          ,"onclick":{"enable":false}
        }
        ,"modes":{
          "repulse":{"distance":100,"duration":0.2}
        }
      }
    });
  }

  volver(){
    history.back();
  }

  cambiarHabilitado(){
    if(this.usuarioDetallado!=undefined){
      let valor=!this.usuarioDetallado?.habilitado;
      this.usuarioService
        .cambiarHabilitado(this.usuarioDetallado.ID,valor)
        .subscribe(()=>{
          // TODO if ok
          if(this.usuarioDetallado!=undefined)
            this.usuarioDetallado.habilitado=valor;
        });
    }
  }

}
