import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.sass']
})
export class LoginFormComponent implements OnInit{
    formLogin = this.formBuilder.group({
    userName : ['', [Validators.required, Validators.minLength(3)]],
    password : ['', [Validators.required, Validators.minLength(6)]] 
  })
  constructor(private formBuilder : FormBuilder){

  }

  ngOnInit(): void {
      
  }

  
}
