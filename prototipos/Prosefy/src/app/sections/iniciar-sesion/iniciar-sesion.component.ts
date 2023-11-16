import { Component, OnInit } from '@angular/core';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { forkJoin, map, switchMap } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/services/Auth/LoginRequest.js';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit{
  usuarios: Usuario[] = [];
  loginError: string= "";
  loginGroup = this.formBuilder.group({
    email: ['bla@gmail.com', [Validators.required, Validators.email]],
    password: ['',[Validators.required]]
  });
  inputUsuario: string = '';
  inputContrasena: string = '';
  usuariosIds: string[] = [];

  usuariosData: {
    [key: string]: {
      email: string | undefined,
      password: string | undefined,
    }
  } = {};

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder : FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.usuarioService.getUsuariosIds().subscribe((usuariosIds: string[]) => {
      console.log("Usuarioss Ids: ", usuariosIds);
      this.usuariosIds = usuariosIds;

      const requests = usuariosIds.map(id =>
        forkJoin({
          email: this.usuarioService.getEmail(id),
          password: this.usuarioService.getContraseña(id)
        }).pipe(map(({ email, password }) => ({ id, email, password })))
      );

      forkJoin(requests).subscribe((usuarios) => {
        console.log("Usuarios Data: ", usuarios); 
        usuarios.forEach(usuario => {
          this.usuariosData[usuario.id] = { email: usuario.email, password: usuario.password };
        });
      });
    });

  
  }

  login(){
    if (this.loginGroup.valid){
      this.usuarioService.login(this.loginGroup.value as LoginRequest).subscribe({
        
        next: (userData) =>{
          console.log(userData);
          
        },

        error: (errorData) =>{ 
          this.loginError = errorData;
        },
        
        complete: () =>{
          //if (this.buscarUsuario() && this.buscarPassword()){
            this.router.navigateByUrl('/perfil');
            this.loginGroup.reset();
          //}
        },
      });
    }
    else{
      this.loginGroup.markAllAsTouched();
      alert("Datos incorrectos");
    }
    
  }

  buscarUsuario() {
    const emailEncontrado = this.usuarios.some(usuario => usuario.email === this.inputUsuario);

    return emailEncontrado;
  }  

  buscarPassword() {
    const passEncontrado = this.usuarios.some(usuario => usuario.avatar === this.inputContrasena);

    return passEncontrado;
  }  

  get email (){
    return this.loginGroup.controls.email;
  }

  get password (){
    return this.loginGroup.controls.password;
  }

}
