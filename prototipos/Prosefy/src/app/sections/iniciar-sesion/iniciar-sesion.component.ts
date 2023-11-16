import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/services/Auth/LoginRequest';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit{
  loginError: string= "";
  loginGroup = this.formBuilder.group({
    email: ['bla@gmail.com', [Validators.required, Validators.email]],
    password: ['',[Validators.required]]
  });
  inputUsuario: string = '';
  inputContrasena: string = '';



  constructor(
    private usuarioService: UsuarioService,
    private formBuilder : FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(){
    console.log(this.loginGroup.value);
    if (this.loginGroup.valid){
      this.usuarioService.login(this.loginGroup.value as LoginRequest).subscribe({

          //this.router.navigateByUrl('/perfil')
          //this.loginGroup.reset()
      });
    }
    else{
      this.loginGroup.markAllAsTouched();
      alert("Datos incorrectos");
    }
    
  }
  
  get email (){
    return this.loginGroup.controls.email;
  }

  get password (){
    return this.loginGroup.controls.password;
  }

}
