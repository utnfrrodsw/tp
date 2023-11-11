import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';
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
  deletionMessage: string = ''; 
  succesMessage: string = '';
  @Input() accRol: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    ) {}
  ngOnInit(): void {}

  users?: User[];

  viewUsers() {
    this.userService.getUsers().subscribe((data: any) => {
      this.users = data; 
      data.forEach(
        (user: { Editing: boolean; UpdatedEmail: any; Email: any }) => {
          user.Editing = false; 
        }
      );
    });
  }

  updateUser(user: User) {
    user.Editing = !user.Editing;
  }

  handlerUpdate(viewDataUsers: FormGroup, user: any) {
    if (this.viewDataUsers.valid) {
      user.UpdatedEmail = viewDataUsers.controls['userUpdatedEmail'].value;
      console.log(user);
      this.userService
        .updateEmailUser(user.UserId, user.UpdatedEmail)
        .subscribe(() => {
          this.succesMessage = `Usuario ${user.FirstName} ${user.LastName} ha sido actualizado`;
          this.deletionMessage = "";
        });
    }
  }

  deleteUser(users: any) {
    this.userService.deleteUser(users.UserId).subscribe(
      (user: User) => {
        this.users = this.users?.filter((u) => u.UserId !== user.UserId);
        this.deletionMessage = `Usuario ${user.FirstName} ${user.LastName} ha sido borrado`;
        this.viewUsers();
      },
      (error) => {
        this.deletionMessage = 'Error al borrar el usuario';
        this.succesMessage = "";
        console.error(error);
      }
    );
  }
}
