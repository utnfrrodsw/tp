import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Address } from 'src/models/address';
import { User } from 'src/models/user';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.sass'],
})
export class CreateUsersComponent implements OnInit {
  createUsers = this.formBuilder.group({
    userName: [''],
    userLastName: [''],
    userEmail: ['', [Validators.required, Validators.email]],
    userPassword: ['', [Validators.required, Validators.minLength(4)]],
    userAddress_Street: [''],
    userAddress_Number: [''],
    userAddress_City: [''],
  });
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  user?: User;

  createUser(createUsers: FormGroup) {
    this.user = new User(
      createUsers.controls['userName'].value ?? '',
      createUsers.controls['userLastName'].value ?? '',
      createUsers.controls['userEmail'].value ?? '',
      createUsers.controls['userPassword'].value ?? '',
      new Address(
        createUsers.controls['userAddress_Street'].value ?? '',
        createUsers.controls['userAddress_Number'].value ?? '',
        createUsers.controls['userAddress_City'].value ?? ''
      )
    );
    {
    }
  }

  ngOnInit(): void {}
  handlerCreate() {
    if (this.createUsers.valid) {
      this.createUser(this.createUsers);
      this.authService.users(this.user!).subscribe(() => {});
    }
  }
}
