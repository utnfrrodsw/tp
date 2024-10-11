import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { MostrarHabitacionesComponent } from './mostrar-habitaciones/mostrar-habitaciones.component';
import { AboutComponent } from './about/about.component';
import { MostrarServiciosComponent } from './mostrar-servicios/mostrar-servicios.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MostrarHabitacionesDisponiblesComponent } from './mostrar-habitaciones-disponibles/mostrar-habitaciones-disponibles.component';
import { ReservasClienteComponent } from './reservas-cliente/reservas-cliente.component';
import { PerfilClienteComponent } from './perfil-cliente/perfil-cliente.component';
import { LoginEmpleadoComponent } from './login-empleado/login-empleado.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { AlertaComponent } from './alerta/alerta.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RegistroEmpleadoComponent } from './registro-empleado/registro-empleado.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GestionarReservasComponent } from './gestionar-reservas/gestionar-reservas.component';
import { GestionarServiciosComponent } from './gestionar-servicios/gestionar-servicios.component';
import { GestionarClientesComponent } from './gestionar-clientes/gestionar-clientes.component';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    MostrarHabitacionesComponent,
    AboutComponent,
    MostrarServiciosComponent,
    LoginComponent,
    RegistroComponent,
    HeaderComponent,
    MostrarHabitacionesDisponiblesComponent,
    ReservasClienteComponent,
    PerfilClienteComponent,
    LoginEmpleadoComponent,
    SuccessDialogComponent,
    AlertaComponent,
    RegistroEmpleadoComponent,
    DashboardComponent,
    GestionarReservasComponent,
    GestionarServiciosComponent,
    GestionarClientesComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule ,
    BrowserAnimationsModule,
    ConfirmDialogModule,
    ToastModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule

  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync() ,
    ConfirmationService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
