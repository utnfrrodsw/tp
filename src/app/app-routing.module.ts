import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home/home.component';
import { BookDetailComponent } from './pages/book-detail/book-detail.component';

const routes: Routes = [{
  path: 'home',
  component: HomeComponent
},
{
  path: 'book',
  component: BookDetailComponent
},
{
  path: '', redirectTo: 'home', pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
