import { Component, OnInit } from '@angular/core'
import {  Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from './auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'front'
  rol: string | null = null
  
  constructor(private router: Router, private toastr: ToastrService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.rol$.subscribe(rol => {
      this.rol = rol
    })
  }

  logOut(){
    this.authService.logOut()
    this.toastr.success('La sesión se cerró correctamente', 'Sesión Cerrada')
    this.router.navigate(['/login'])
  }
}
