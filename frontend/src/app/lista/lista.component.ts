import { Component, OnInit} from '@angular/core';
import { UsuarioService,Usuario } from '../servicios/usuario.service';
import { UsuarioDetalladoService} from '../servicios/usuario-detallado.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {
  title = 'proyecto';

  usuarios: Usuario[]=<any>[];
  usuarioModal:(Usuario|undefined)=undefined; // Puaj
  filtrados:(number|undefined)[]=<any>[];

  constructor(
    private usuarioService: UsuarioService
    ,private usuarioDetalladoService:UsuarioDetalladoService
    ){}
  
  ngOnInit() {
    this.usuarioService
      .getAll()
      .subscribe((result: any)=>{
        this.usuarios=result;
      });
  }

  filtrar(e:EventTarget|null){
    this.filtrados=this.usuarios
      .filter((u:Usuario)=>!new RegExp(`${(e as HTMLInputElement).value}`,'gi').test(u.nombreCompleto))
      .map((u:Usuario)=>u.ID);
  }

  usuariosOrdenados(){
    return this.usuarios.sort((a:Usuario,b:Usuario)=>a.nombreCompleto.localeCompare(b.nombreCompleto));
  }

  abrirModal(ID:number|undefined){
    if(ID==undefined)
      return;

    this.usuarioModal=this.usuarios.find((u:Usuario)=>u.ID==ID);
  }

  cerrarModal(target:EventTarget|null){
    if((target as HTMLElement).id=='modal')
      this.usuarioModal=undefined;
  }

  establecerUsuarioADetallar(){
    if(this.usuarioModal!=undefined)
      this.usuarioDetalladoService.setUsuarioDetallado(this.usuarioModal);
  }
}
