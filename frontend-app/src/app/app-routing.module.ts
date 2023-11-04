import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { CreateUsersComponent } from './post/create-users/create-users.component';
import { ViewUsersComponent } from './get/view-users/view-users.component';
import { InvestmentMainComponent } from './investment-main/investment-main.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'post', component: CreateUsersComponent },
  { path: 'get', component: ViewUsersComponent },
  {
    path: 'investment',
    canActivate: [authGuard],
    component: InvestmentMainComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'post',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'get',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
