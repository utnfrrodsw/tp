import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { RegistroService } from '../registro.service';



@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})

export class RegistroComponent {
  
  constructor (private service: RegistroService, private toastr: ToastrService, private router: Router){}

  objetos:any = Object;

  regUser(event: Event, nombre: string, apellido: string, contraseña: string, confimPass: string, fecha_nac: string, mail: string, tipos_par: string){
    event.preventDefault()
    const rol = 'participante'
    if(nombre == '' || apellido == '' || contraseña == '' || fecha_nac == '' || mail == '' || tipos_par == ''){
      this.toastr.error('Todos los campos son obligatorios', 'Error')
      return
    }

    if(contraseña !== confimPass){
      this.toastr.error('Las contraseñas no coinciden', 'Error')
      return
    }

    this.service.registro(nombre, apellido, contraseña, fecha_nac, mail, rol, parseInt(tipos_par)).subscribe(response => {this.objetos = response
    this.toastr.success('El usuario fue registrado con éxito', 'Usuario registrado')
    this.router.navigate(['/inicio'])},(error)=>{
      if(error.error.message){
      this.toastr.error(error.error.message, 'Error')
      }else{
        this.toastr.error('Upps ocurrió un error, comuniquese con el administrador', 'Error')
      }
    })
  }
}
