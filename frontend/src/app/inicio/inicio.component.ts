import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioService } from '../servicios/usuario.service';
import { Permiso, } from '../servicios/permiso.service';
import { UsuarioActualService } from '../servicios/usuario-actual.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  registrandose=false;

  constructor(
    private usuarioActualService:UsuarioActualService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  intentarIngresar(e:SubmitEvent){
    e.preventDefault();

    let form:HTMLFormElement=e.target as HTMLFormElement;
    this.usuarioService
      .ingresar(form['usuario'].value,form['contrasenia'].value)
      .subscribe((u:any) =>{
        this.usuarioActualService.setUsuarioActual(u as Usuario);
        this.router.navigate(['/panel'])
      })
  }

  cerrarModal(t:EventTarget|null){
    this.registrandose=(t as HTMLElement).id!='modal';
  }

  registrarse(e:SubmitEvent){
    e.preventDefault();
    
    let u: Usuario=(((Object.fromEntries((new FormData(e.target as HTMLFormElement))))) as unknown) as Usuario;
    u.permisos=[{ID:1} as Permiso];

    this.usuarioService
      .create(u)
      .subscribe((result:any)=>{
        (document.getElementById('usuario') as HTMLInputElement).value = u.nombreUsuario;
        (document.getElementById('contrasenia') as HTMLInputElement).value = u.contrasenia||'';
        (document.getElementById('ingresar') as HTMLFormElement).submit();
      })
  }

}
