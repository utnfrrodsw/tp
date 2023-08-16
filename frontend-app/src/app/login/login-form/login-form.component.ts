import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.sass']
})
export class LoginFormComponent implements OnInit{
    formLogin = this.formBuilder.group({
    userName : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12),Validators.pattern('^[a-zA-Z]+$')]],
    password : ['', [Validators.required, Validators.minLength(6)]] 
  })
  constructor(
    private formBuilder : FormBuilder,
    private authService: AuthService,
    private router: Router){

  }

  ngOnInit(): void {
      
  }
  handlerLogin(){
    if(this.formLogin.valid){
      this.authService.login(
        this.formLogin.controls['userName'].value ?? '',
        this.formLogin.controls['password'].value ?? '')
        .subscribe(response => {
          console.log('login ok :', response);
          this.router.navigate(['investment']);
        })
    }
  }

  
}
