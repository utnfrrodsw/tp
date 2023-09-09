import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioService } from '../servicios/usuario.service';
import { Permiso, } from '../servicios/permiso.service';
import {Router} from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  registrandose=false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {}

  intentarIngresar(e:SubmitEvent){
    e.preventDefault();

    let form:HTMLFormElement=e.target as HTMLFormElement;
    this.usuarioService
      .ingresar(form['usuario'].value,form['contrasenia'].value)
      .subscribe(
        {
          next:(u:any) =>{
            this.router.navigate(['/panel'])
          }
          ,error:(err: HttpErrorResponse) => {
            // TODO Toasty, del proyecto de Java
            console.error('An error occurred:', err.error);
          }
        }
      );
  }

  cerrarModal(t:EventTarget|null){
    this.registrandose=(t as HTMLElement).id!='modal';
  }

  registrarse(e:SubmitEvent){
    e.preventDefault();
    
    let u: Usuario=(((Object.fromEntries((new FormData(e.target as HTMLFormElement))))) as unknown) as Usuario;
    // u.permisos=[/* {ID:1} as Permiso */];

    // TODO que funcione bien
    this.usuarioService
      .create(u)
      .subscribe((result:any)=>{
        (document.getElementById('usuario') as HTMLInputElement).value = u.nombreUsuario;
        (document.getElementById('contrasenia') as HTMLInputElement).value = u.contrasenia||'';
        (document.getElementById('ingresar') as HTMLFormElement).submit();
      });
  }

}
