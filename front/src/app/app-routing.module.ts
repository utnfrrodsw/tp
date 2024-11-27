import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PaginaInicioComponent } from './pagina-inicio/pagina-inicio.component'
import { LoginComponent } from './login/login.component'
import { PartidoComponent } from './partido/partido.component'
import { TorneoComponent } from './torneo/torneo.component'
import { RegistroComponent } from './registro/registro.component'
import { AdminComponent } from './admin/admin.component'
import { ParticipanteComponent } from './participante/participante.component'
import { authGuard } from './utils/auth.guard'



const routes: Routes = [
    { path: 'inicio', component: PaginaInicioComponent,canActivate: [authGuard]},
    { path: 'login', component: LoginComponent},
    { path: 'partidos', component: PartidoComponent,canActivate: [authGuard]},
    { path: 'torneos', component: TorneoComponent,canActivate: [authGuard]},
    { path: 'registro', component: RegistroComponent},
    { path: 'admin', component: AdminComponent, canActivate: [authGuard]},
    { path: 'participante', component: ParticipanteComponent,canActivate: [authGuard]},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo:'login', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
