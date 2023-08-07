import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/services/auth/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = ''
  password: string = ''

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    console.log(this.email, this.password)
    if(this.email != '' && this.password != '') {
      this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          this.router.navigate(['/home'])
        },
        error: (error) => {
          this.password = ''
        },
        complete: () => {
          console.log('Completado')
        }
      })
    } else {
      console.log('Credenciales incorrectas')
    }
  }
}
