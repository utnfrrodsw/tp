import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioService } from '../servicios/usuario.service';
import { Permiso, } from '../servicios/permiso.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  registrandose=false;
  console=console;

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
  }

  intentarIngresar(e:SubmitEvent){
    e.preventDefault();

    let form:HTMLFormElement=e.target as HTMLFormElement;
    this.usuarioService
      .ingresar(form['usuario'].value,form['contrasenia'].value)
      .subscribe((response:any) =>{
        console.log('Logueado!');
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
