import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front';

  constructor(private router: Router, private toastr: ToastrService) {}

  logOut(){
    localStorage.removeItem('token')
    this.toastr.success('La sesión se cerró correctamente', 'Sesión Cerrada')
    this.router.navigate(['/inicio'])
  }
}
