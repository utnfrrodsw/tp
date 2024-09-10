import { Routes } from '@angular/router';
import {ConsultaVolqueteComponent} from './app-layout/body/volquetes-body/consulta-volquete/consulta-volquete.component.js';
import { VolquetesBodyComponent } from './app-layout/body/volquetes-body/volquetes-body.component.js';
import { TipoVolqueteComponent } from './app-layout/body/configuraciones-body/tipo-volquete/tipo-volquete.component.js';
import { UsuariosComponent } from './app-layout/body/configuraciones-body/usuarios/usuarios.component.js';


export const routes: Routes = [
  { path: 'volquetes', component: VolquetesBodyComponent },
  { path: 'app-consulta-volquete', component: ConsultaVolqueteComponent },
  { path: 'config/tiposVolquetes', component: TipoVolqueteComponent },
  { path: 'config/usuarios', component: UsuariosComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' }, // Ruta por defecto
];
