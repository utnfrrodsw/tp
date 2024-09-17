import { Component } from '@angular/core';
import { TorneoService } from '../torneo.service';

@Component({
  selector: 'app-torneo',
  templateUrl: './torneo.component.html',
  styleUrl: './torneo.component.scss'
})
export class TorneoComponent {
  constructor (private service: TorneoService) {
  }
  
  list:any = [];
  torneo:any = Object;

  ngOnInit(): void{

  }

  loadTorneos(){
    return this.service.getTorneos().subscribe(response => this.list = response);
  }

  loadOne(id:string){
    return this.service.getOneTorneo(id).subscribe(response => this.torneo = response);
  }

  removeTorneo(id:string){
    return this.service.remove(id).subscribe(response => this.torneo = response);
  }

  addTorneo(nombre_torneo: string,
    fecha_inico_insc: string,
    fecha_fin_insc: string,
    fecha_inicio_torneo: string,
    fecha_fin_torneo: string,
    estado_tor: string,
    ganador: string,
    formato: string,
    sucursal: string,
    nro_adm: string,
    id: string){
    return this.service.add(nombre_torneo,
      fecha_inico_insc,
      fecha_fin_insc,
      fecha_inicio_torneo,
      fecha_fin_torneo,
      estado_tor,
      ganador,
      formato,
      sucursal,
      nro_adm,
      parseInt(id)).subscribe(response => this.torneo = response);
  }

  putTorneo(nombre_torneo: string,
    fecha_inico_insc: string,
    fecha_fin_insc: string,
    fecha_inicio_torneo: string,
    fecha_fin_torneo: string,
    estado_tor: string,
    ganador: string,
    formato: string,
    sucursal: string,
    nro_adm: string,
    id: string){
    return this.service.modTorneo(nombre_torneo,
      fecha_inico_insc,
      fecha_fin_insc,
      fecha_inicio_torneo,
      fecha_fin_torneo,
      estado_tor,
      ganador,
      formato,
      sucursal,
      nro_adm,
      parseInt(id)).subscribe(response => this.torneo = response);
  }
}