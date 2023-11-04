import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.sass'],
})
export class ViewUsersComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit(): void {}

  users?: User[];

  viewUsers() {
    this.authService.getUsers().subscribe((data: any) => {
      this.users = data; // Asigna los usuarios obtenidos al arreglo 'users'
    });
  }

  deleteUser(user: any) {
    this.authService.deleteUser(user.id).subscribe(() => {
      // Elimina el usuario del arreglo 'users' local
      // this.users = this.users.filter((u) => u !== user);
    });
  }
}
