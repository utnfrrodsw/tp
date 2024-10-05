import { Routes } from '@angular/router';
import {ConsultaVolqueteComponent} from './app-layout/body/volquetes-body/consulta-volquete/consulta-volquete.component.js';
import { VolquetesBodyComponent } from './app-layout/body/volquetes-body/volquetes-body.component.js';
import { TipoVolqueteComponent } from './app-layout/body/configuraciones-body/tipo-volquete/tipo-volquete.component.js';
import { UsuariosComponent } from './app-layout/body/configuraciones-body/usuarios/usuarios.component.js';
import { RegisterComponent } from './register/register/register.component.js';
import { LoginComponent } from './login/login/login.component.js';


export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  
  { path: 'volquetes', component: ConsultaVolqueteComponent },
  //{ path: 'app-consulta-volquete', component: VolquetesBodyComponent },
  { path: 'config/tiposVolquetes', component: TipoVolqueteComponent },
  { path: 'config/usuarios', component: UsuariosComponent },


  { path: '**', redirectTo: '', pathMatch: 'full' }, // Ruta por defecto
];
