import { Component } from '@angular/core';
import { PartidoService } from '../partido.service';
import { TorneoService } from '../torneo.service';


@Component({
  selector: 'app-partido',
  templateUrl: './partido.component.html',
  styleUrl: './partido.component.scss'
})
export class PartidoComponent {
  constructor (private service: PartidoService, private torneoService: TorneoService) {
  }
  
  torneos:any[] = []
  partidos:any[] = []

  ngOnInit(): void{
    this.torneoService.getTorneos().subscribe(response => this.torneos = response.data)
  }

  mostrarPartidos(id_torneo: string){
    this.partidos = []
    this.torneoService.getOneTorneo(id_torneo).subscribe(torneo_e => {
      const cont = torneo_e.data.partidos.length
      for(let i=0;i<cont;i++){
        const id_partido = torneo_e.data.partidos[i].id
        this.service.getOnePartido(id_partido).subscribe(response => {
          this.partidos.push(response.data)
        })
      }
    })
  }

}
/*loadPartidos(){
  return this.service.getPartidos().subscribe(response => this.list = response);
}

loadOne(id:string){
  return this.service.getOnePartido(id).subscribe(response => this.partido = response);
}

removePartido(id:string){
  return this.service.remove(id).subscribe(response => this.partido = response);
}

addPartido(fecha: string, torneo: string, equipo1: string, equipo2: string, id: string){
  return this.service.add(fecha, torneo, equipo1, equipo2, parseInt(id)).subscribe(response => this.partido = response);
}

putPartido(fecha: string, torneo: string, equipo1: string, equipo2: string, id: string){
  return this.service.modPartido(fecha, torneo, equipo1, equipo2, parseInt(id)).subscribe(response => this.partido = response);
}*/