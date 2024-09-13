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
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http'; // Importa HttpClientModule y withFetch
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MostrarHabitacionesDisponiblesComponent } from './mostrar-habitaciones-disponibles/mostrar-habitaciones-disponibles.component';
import { ReservasClienteComponent } from './reservas-cliente/reservas-cliente.component';
import { PerfilClienteComponent } from './perfil-cliente/perfil-cliente.component';


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
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  
    HttpClientModule ,
    // Agrega HttpClientModule al imports
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()) // Proporciona HttpClient con fetch habilitado
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
