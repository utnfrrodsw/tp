import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './inicio/inicio.component';
import { MostrarHabitacionesComponent } from './mostrar-habitaciones/mostrar-habitaciones.component';
import { AboutComponent } from './about/about.component';
import { MostrarServiciosComponent } from './mostrar-servicios/mostrar-servicios.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';

const routes: Routes = [

  {path: '', component: InicioComponent},
  { path: 'habitaciones', component: MostrarHabitacionesComponent },
  { path: 'about', component: AboutComponent },
  {path: 'services', component:MostrarServiciosComponent},
  {path: 'login', component:LoginComponent},
  {path:'registro',component:RegistroComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
