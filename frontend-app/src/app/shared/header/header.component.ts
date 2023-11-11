import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-header',
  template: `
  <div class="shared-container fix-header">
    <div>Recomendador de inversiones</div>
    <span class="user">{{username}}
      <button
      *ngIf="username != 'anonimo'"  
      mat-icon-button 
      color="warn"
      (click)="logout()">
        <mat-icon class="icon-align">close</mat-icon>
      </button>
    </span>
  </div>
  `,
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit{
  username: string = 'anonimo';
  private loginSuccessSubscription?: Subscription;
  constructor(private authService: AuthService) {
    this.getUsername();
  }
  ngOnInit(): void {
    this.loginSuccessSubscription = this.authService.onLoginSuccess().subscribe(() => {
      this.getUsername();
    });
  }
  
  logout() {
    this.authService.logout();
    this.username = 'anonimo';
  }

  getUsername() {
    const user = this.authService.getUsername();
    if(user) {
      this.username = user;
    }
  }

  ngOnDestroy() {
    this.loginSuccessSubscription?.unsubscribe();
  }
}
