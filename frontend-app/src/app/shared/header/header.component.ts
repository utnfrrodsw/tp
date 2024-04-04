import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit {
  accRol: string = '';
  username: string = 'Anonimo';
  private loginSuccessSubscription?: Subscription;
  constructor(private authService: AuthService, private router: Router) {
    this.getUsername();
    const rol = this.authService.getRolSession();
    if (rol) {
      this.accRol = rol;
    }
  }

  ngOnInit(): void {
    this.loginSuccessSubscription = this.authService
      .onLoginSuccess()
      .subscribe(() => {
        this.getUsername();
        const rol = this.authService.getRolSession();
        if (rol) {
          this.accRol = rol;
        }
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
    this.username = 'Anonimo';
  }

  getUsername() {
    const user = this.authService.getUsername();
    if (user) {
      this.username = user;
    }
  }

  ngOnDestroy() {
    this.loginSuccessSubscription?.unsubscribe();
  }

  navigateViewUsers() {
    this.router.navigate(['view-users']);
  }
}
