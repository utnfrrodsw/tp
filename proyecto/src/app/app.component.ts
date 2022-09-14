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
  usuarioModal:(Usuario|undefined)=undefined; // Puaj
  filtrados:(number|undefined)[]=<any>[];

  constructor(private usuarioService: UsuarioService){}
  
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
}
