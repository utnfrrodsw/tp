import { Component, OnInit } from '@angular/core';
import { UsuarioDetalladoService } from '../servicios/usuario-detallado.service';
import { Usuario,UsuarioService as UsuariosService } from '../servicios/usuario.service';
import { UsuarioActualService } from '../servicios/usuario-actual.service';
import { ToastrService } from 'ngx-toastr';

declare var particlesJS: any; 

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  usuarioDetallado:(Usuario)=this.usuarioDetalladoService.getUsuarioDetallado()||({} as any);
  
  constructor(
    private usuarioActualService:UsuarioActualService,
    private usuarioDetalladoService:UsuarioDetalladoService,
    private usuariosService: UsuariosService,
    private toastr: ToastrService
  ){}
  
  ngOnInit(): void {
    // TODO Refactor: definit en el init, declarar existencia más arriba. De alguna forma. ¿En vez de undefined tirar error?
    // this.usuarioDetallado=this.usuarioDetalladoService.getUsuarioDetallado();
    
    if(this.usuarioDetallado.ID==undefined){
      this.volver()
      return;
    }
    
    this.usuarioActualService.getUsuarioActual()
      .subscribe({
        error:()=>{
          this.volver();
        }
      });

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

  
  enviarActualizacionDeDatosAjenos(e:Event){
    e.preventDefault();
    
    let form=<HTMLFormElement>e.target;
    let fd=new FormData(form);
    let dato:string=[...fd.keys()][0];
    let valor=<string>fd.get(dato);
    form.dataset['enviando']='1';
    this.usuariosService.actualizarDatos(
      this.usuarioDetallado.ID||0
      ,dato
      ,valor
    )
      .subscribe((result: any)=>{
        let datoMensaje;

        switch(dato){
        case 'nombreCompleto':
          this.usuarioDetallado.nombreCompleto=valor;
          datoMensaje='Nombre completo';
          break;
        case 'DNI':
          this.usuarioDetallado.DNI=valor;
          datoMensaje='DNI';
          break;
        case 'nombreUsuario':
          this.usuarioDetallado.nombreUsuario=valor;
          datoMensaje='Nombre de usuario';
          break;
        case 'correo':
          this.usuarioDetallado.correo=valor;
          datoMensaje='Correo';
          break;
        case 'habilitado':
          this.usuarioDetallado.habilitado = valor=='1';
          datoMensaje='Estado del usuario';
          break;
        }

        form.dataset['sucio']='0';
        form.dataset['enviando']='0';

        this.toastr.success(`${datoMensaje} actualizado.`);
      });
      ;
  }  

}
