import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.sass'],
})
export class ViewUsersComponent {
  isOpen: boolean;
  viewDataUsers = this.formBuilder.group({
    userUpdatedEmail: ['', [Validators.required, Validators.email]],
  });
  deletionMessage: string = '';
  succesMessage: string = '';
  @Input() accRol: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.isOpen = false;
  }

  users?: User[];

  isOpenViewUsers() {
    this.viewUsers();
  }

  viewUsers() {
    this.userService.getUsers().subscribe((data: any) => {
      this.users = data;
      data.forEach(
        (user: { Editing: boolean; UpdatedEmail: any; Email: any }) => {
          user.Editing = false;
        }
      );
    });
    this.isOpen = !this.isOpen;
  }

  updateUser(user: User) {
    user.Editing = !user.Editing;
  }

  handlerUpdate(viewDataUsers: FormGroup, user: any) {
    if (this.viewDataUsers.valid) {
      user.UpdatedEmail = viewDataUsers.controls['userUpdatedEmail'].value;
      this.userService
        .updateEmailUser(user.UserId, user.UpdatedEmail)
        .subscribe(
          () => {
            this._snackBar.open(`Email actualizado con exito!`, 'X', {
              duration: 4000,
            });
          },
          (error) => {
            this._snackBar.open(`Error al actualizar el usuario`, 'X', {
              duration: 4000,
            });
            this.deletionMessage = 'Error al actualizar el usuario';
            this.succesMessage = '';
            console.error(error);
          }
        );
    }
  }

  deleteUser(users: any) {
    this.userService.deleteUser(users.UserId).subscribe(
      {
        next:(user: User) => {
          this.users = this.users?.filter((u) => u.UserId !== user.UserId);
          this._snackBar.open(
            `Usuario ${user.FirstName} ${user.LastName} ha sido borrado`,
            'CERRAR',
            {
              duration: 4000,
            }
          );
          this.viewUsers();
        },
        error:(error) => {
          this.deletionMessage = 'Error al borrar el usuario';
          this.succesMessage = '';
          console.error(error);
        }
      }
    );
  }

  returnMoney() {
    this.router.navigate(['money']);
  }
}
