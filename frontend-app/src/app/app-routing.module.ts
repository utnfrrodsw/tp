import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { InvestmentMainComponent } from './investment-main/investment-main.component';
import { authGuard } from './auth.guard';
import { MoneyMainComponent } from './money-main/money-main.component';

const routes: Routes = [
  {path: 'login',
   component: LoginFormComponent
  },
  {path: 'investment',
   canActivate: [authGuard],
   component: InvestmentMainComponent
  },
  {path: 'money',
   canActivate: [authGuard],
   component: MoneyMainComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
