import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { Libro1Component } from './libro1/libro1.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Contacto', component: ContactComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Registro', component: RegistroComponent },
  { path: 'libro-ejemplar', component: Libro1Component },
];

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    HomeComponent,
    LoginComponent,
    RegistroComponent,
    Libro1Component,
  ],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
