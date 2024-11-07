import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaInicioComponent } from './pagina-inicio/pagina-inicio.component';
import { LoginComponent } from './login/login.component';
import { PartidoComponent } from './partido/partido.component';
import { TorneoComponent } from './torneo/torneo.component';



const routes: Routes = [
    { path: 'inicio', component: PaginaInicioComponent },
    { path: 'login', component: LoginComponent },
    { path: 'partidos', component: PartidoComponent},
    { path: 'torneos', component: TorneoComponent},
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
