import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';
import { Address } from 'src/models/address';
import { User } from 'src/models/user';


@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.sass'],
})
export class CreateUsersComponent implements OnInit {
  accRol: string = '';
  createUsers = this.formBuilder.group({
    userName: [''],
    userLastName: [''],
    userEmail: ['', [Validators.required, Validators.email]],
    userPassword: ['', [Validators.required, Validators.minLength(4)]],
    anotherUserPassword: ['', [Validators.required, Validators.minLength(4)]],
    userAddress_Street: [''],
    userAddress_Number: [''],
    userAddress_City: [''],
  });
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {
    const rol = this.authService.getRolSession();
    if (rol) {
      this.accRol = rol;
    }
  }

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
  }

  ngOnInit(): void {}
  handlerCreate() {
    if (
      this.createUsers.valid &&
      this.createUsers.controls['userPassword'].value ===
        this.createUsers.controls['anotherUserPassword'].value
    ) {
      this.createUser(this.createUsers);
      this.userService.users(this.user!).subscribe((res) => {
        this.createUsers.reset();
        this._snackBar.open('Creado con exito!', 'OK', {
          duration: 4000,
        });
      });
    } else {
      this._snackBar.open('Error al crear usuario', 'CERRAR', {
        duration: 4000,
      });
    }
  }

  returnPage() {
    this.router.navigate(['login']);
  }
}
