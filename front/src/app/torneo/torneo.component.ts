import { Component } from '@angular/core';
import { TorneoService } from '../torneo.service';
import { ParticipanteService } from '../participante.service';
import { EquipoService } from '../equipo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-torneo',
  templateUrl: './torneo.component.html',
  styleUrl: './torneo.component.scss'
})
export class TorneoComponent {
  constructor (private service: TorneoService, private participanteService: ParticipanteService, private equipoService: EquipoService, private toastr: ToastrService) {
  }
  
  torneos: any[] = []
  token = localStorage.getItem('token')
  mail:string = ''
  objeto:any = Object
  objetos:any = Object
  equipos:any[] = []
  
  ngOnInit(): void{

      this.service.getTorneos().subscribe(response => {this.torneos = response.data})
    }

  inscripcionTorneo(torneo_id:number){
    if(this.token != null){
      const arrayToken = this.token.split('.')
      const tokenPlayload = JSON.parse(atob(arrayToken[1]))
      this.mail = tokenPlayload.mail
    }
    this.participanteService.getParticipantes().subscribe(E_part => {
    for(let i=0;i<E_part.data.length;i++){
      if(E_part.data[i].mail == this.mail){
        this.objeto = E_part.data[i]
      }
    }
    this.equipoService.getEquipos().subscribe(arrayEquipos => {
      this.equipos = []
      for(let i=0;i<arrayEquipos.data.length;i++){
        if(arrayEquipos.data[i].torneo.id == torneo_id){
          this.equipos.push(arrayEquipos.data[i])
        }
      }
      for(let i=0;i<this.equipos.length;i++){
        for(let j=0;this.equipos[i].participantes.length;j++)
          if(this.equipos[i].participantes[j].id == this.objeto.id){
            this.toastr.error('No te podes inscribir en el mismo torneo 2 veces', 'Error')
            return
          }
      }
      this.equipoService.agregarParticipante(this.objeto, this.equipos).subscribe(response => {
        this.objetos = response
        this.toastr.success('Participante Registrado Al Torneo','Registrado')
      })
    })
    })
  }
}


  /*loadTorneos(){
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
  }*/