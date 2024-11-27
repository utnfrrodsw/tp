import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../login.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  constructor (private service: LoginService, private toastr: ToastrService, private router: Router, private authService: AuthService){}
  
  objetos:any = Object;

  logUser(event: Event, mail: string, contraseña: string){
    event.preventDefault()
    if(mail == '' || contraseña == ''){
      this.toastr.error('Todos los campos son obligatorios', 'Error')
      return
    }
    
    this.service.login(mail, contraseña).subscribe(response => {this.objetos = response
      localStorage.setItem('token',this.objetos.data.token)
      const rol = this.objetos.data.rol
      console.log(rol)
      this.authService.setRol(rol) 
      this.router.navigate(['/inicio'])
      
      this.toastr.success('Has iniciado sesión correctamente', 'Logueado')},(error)=>{
      if(error.error.message){
        this.toastr.error(error.error.message, 'Error')
      }else{
        this.toastr.error('Upps ocurrió un error, comuniquese con el administrador', 'Error')
      }
    })
  }
}
