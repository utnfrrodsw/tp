import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './inicio/inicio.component';
import { MostrarHabitacionesComponent } from './mostrar-habitaciones/mostrar-habitaciones.component';
import { AboutComponent } from './about/about.component';
import { MostrarServiciosComponent } from './mostrar-servicios/mostrar-servicios.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { MostrarHabitacionesDisponiblesComponent } from './mostrar-habitaciones-disponibles/mostrar-habitaciones-disponibles.component';
import { ReservasClienteComponent } from './reservas-cliente/reservas-cliente.component';
import { PerfilClienteComponent } from './perfil-cliente/perfil-cliente.component';
import { LoginEmpleadoComponent } from './login-empleado/login-empleado.component';
import { RegistroEmpleadoComponent } from './registro-empleado/registro-empleado.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GestionarReservasComponent } from './gestionar-reservas/gestionar-reservas.component';
import { GestionarServiciosComponent } from './gestionar-servicios/gestionar-servicios.component';
import { GestionarClientesComponent } from './gestionar-clientes/gestionar-clientes.component';
import { authGuard } from './guards/auth.guard';
import { GestionarHabitacionesComponent } from './gestionar-habitaciones/gestionar-habitaciones.component';
import { ModificarHabitacionComponent } from './modificar-habitacion/modificar-habitacion.component';
import { NuevaHabitacionComponent } from './nueva-habitacion/nueva-habitacion.component';
import { ActualizarPerfilComponent } from './actualizar-perfil/actualizar-perfil.component';
const routes: Routes = [

  {path: '', component: InicioComponent, canActivate: [authGuard]},
  { path: 'habitaciones', component: MostrarHabitacionesComponent },
  { path: 'about', component: AboutComponent },
  {path: 'servicios', component:MostrarServiciosComponent},
  {path: 'login', component:LoginComponent},
  {path:'registro',component:RegistroComponent},
  {path:'habitaciones/disponibles',component:MostrarHabitacionesDisponiblesComponent},
  {path:'misreservas',component:ReservasClienteComponent},
  {path:'miperfil' , component:PerfilClienteComponent},
  {path:'login/empleados' , component:LoginEmpleadoComponent},
  {path:'registro/empleados' , component:RegistroEmpleadoComponent},
  {path:'dashboard/empleado',component:DashboardComponent},
  {path:'gestionar-reservas',component: GestionarReservasComponent},
  {path:'gestionar-servicios',component:GestionarServiciosComponent},
  {path:'gestionar-clientes',component:GestionarClientesComponent} ,
  {path:'gestionar-habitaciones',component:GestionarHabitacionesComponent} ,
  {path:'modificar-habitacion', component: ModificarHabitacionComponent},
  {path:'nueva-habitacion',component: NuevaHabitacionComponent},
  {path:'actualizar-perfil',component: ActualizarPerfilComponent},


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
