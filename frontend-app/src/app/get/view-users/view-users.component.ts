import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.sass'],
})
export class ViewUsersComponent implements OnInit {
  viewDataUsers = this.formBuilder.group({
    userUpdatedEmail: ['', [Validators.required, Validators.email]],
  });
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}
  ngOnInit(): void {}

  users?: User[];

  viewUsers() {
    this.authService.getUsers().subscribe((data: any) => {
      this.users = data; // Asigna los usuarios obtenidos al arreglo 'users'
      data.forEach(
        (user: { Editing: boolean; UpdatedEmail: any; Email: any }) => {
          user.Editing = false; // Agrega una bandera de edición a cada usuario
          // user.UpdatedEmail = user.Email; // Crea una propiedad para almacenar el email actualizado
        }
      );
    });
  }

  updateUser(user: any) {
    // this.authService.updateUsers(users.Email).subscribe(())
    user.Editing = !user.Editing;
    console.log(user);
  }

  handlerUpdate() {
    
  }

  deleteUser(users: any) {
    this.authService.deleteUser(users.UserId).subscribe((user: User) => {
      // Elimina el usuario del arreglo 'users' local
      this.users = this.users?.filter((u) => u.UserId !== user.UserId);
    });
  }
}
