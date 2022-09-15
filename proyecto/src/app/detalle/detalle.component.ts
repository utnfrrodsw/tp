import { Component, OnInit } from '@angular/core';
import { UsuarioDetalladoService } from '../servicios/usuario-detallado.service';
import { Usuario } from '../servicios/usuario.service';

declare var particlesJS: any; 

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  usuarioActual:(Usuario|undefined)=undefined;
  
  constructor(
    private usuarioDetalladoService:UsuarioDetalladoService
  ){}
  
  ngOnInit(): void {
    this.usuarioActual=this.usuarioDetalladoService.getUsuarioDetallado();

    particlesJS("particles", {
      "particles": {
        "number": {
          "value": this.usuarioActual?.tokens
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

}
