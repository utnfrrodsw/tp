import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { forkJoin } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  readonly baseUrl = 'http://localhost:3000/api/'

  participante_1:any = ''
  participante_2:any = ''
  participante_3:any = ''
  participante_4:any = ''
  participante_5:any = ''
  id_equip:string = ''
  url:string = this.baseUrl + 'equipos/' + this.id_equip
  i:number = 0
  bandera:boolean = false
  participantesArray:any[] = []

  constructor(private http: HttpClient) { }

  getEquipos() {
    const url = this.baseUrl + 'equipos'
    return this.http.get<any>(url)
  }

  getOneEquipo(id:string){
    const url = this.baseUrl + 'equipos/' + id
    return this.http.get<any>(url)
  }

  addEquiposTorneo(id_torneo: number, E_formato_torneo: any){
    const cant_equipos = E_formato_torneo.data.cant_equipos
    const requests = []
    for (let i=0; i < cant_equipos; i++){
      const url = this.baseUrl + 'equipos'
      const data = { torneo: id_torneo }
      requests.push(this.http.post<any>(url, data))
    }
    return forkJoin(requests)
  }

  agregarParticipante(participante: any, arrayEquipos: any){
    this.i = 0
    while(this.i < arrayEquipos.length && this.bandera == false){
      this.participantesArray = []
      this.participante_1 = null
      this.participante_2 = null
      this.participante_3 = null
      this.participante_4 = null
      this.participante_5 = null
      for(let j = 0; j < arrayEquipos[this.i].participantes.length; j++){
        if(arrayEquipos[this.i].participantes[j].tipos_par == 1 && this.participante_1 == null ){
          this.participante_1 = arrayEquipos[this.i].participantes[j].id
        }else if(arrayEquipos[this.i].participantes[j].tipos_par == 1 && this.participante_2 == null){
          this.participante_2 = arrayEquipos[this.i].participantes[j].id}
        if(arrayEquipos[this.i].participantes[j].tipos_par == 2 && this.participante_3 == null){
          this.participante_3 = arrayEquipos[this.i].participantes[j].id
        }else if(arrayEquipos[this.i].participantes[j].tipos_par == 2 && this.participante_4 == null){
          this.participante_4 = arrayEquipos[this.i].participantes[j].id}
        if(arrayEquipos[this.i].participantes[j].tipos_par == 3 && this.participante_5 == null){
          this.participante_5 = arrayEquipos[this.i].participantes[j].id}
        this.participantesArray.push(arrayEquipos[this.i].participantes[j].id)
      }
      if(participante.tipos_par.id == 1 && this.participante_1 == null){
          this.participante_1 = participante.id
          this.id_equip = arrayEquipos[this.i].id
          this.url = this.baseUrl + 'equipos/' + this.id_equip
          this.participantesArray.push(this.participante_1)
          this.bandera = true
        }else if(participante.tipos_par.id == 1 && this.participante_2 == null){
          this.participante_2 = participante.id
          this.id_equip = arrayEquipos[this.i].id
          this.url = this.baseUrl + 'equipos/' + this.id_equip
          this.participantesArray.push(this.participante_2)
          this.bandera = true}
      if(participante.tipos_par.id == 2 && this.participante_3 == null){
          this.participante_3 = participante.id
          this.id_equip = arrayEquipos[this.i].id
          this.url = this.baseUrl + 'equipos/' + this.id_equip
          this.participantesArray.push(this.participante_3)
          this.bandera = true
      }else if(participante.tipos_par.id == 2 && this.participante_4 == null){
          this.participante_4 = participante.id
          this.id_equip = arrayEquipos[this.i].id
          this.url = this.baseUrl + 'equipos/' + this.id_equip
          this.participantesArray.push(this.participante_4)
          this.bandera = true}
      if(participante.tipos_par.id == 3 && this.participante_5 == null){
          this.participante_5 = participante.id
          this.id_equip = arrayEquipos[this.i].id
          this.url = this.baseUrl + 'equipos/' + this.id_equip
          this.participantesArray.push(this.participante_5)
          this.bandera = true}
      this.i = this.i + 1
    }
    const data = { participantes: this.participantesArray }
    return this.http.patch<any>(this.url, data)
  }
}
/*remove(id:string){
    const url = this.baseUrl + 'equipos/' + id
    return this.http.delete<any>(url)
  }

  add(jugador1: string, jugador2: string, jugador3: string, jugador4: string, jugador5: string, torneo: string, id: number) {
    const url = this.baseUrl + 'equipos'
    const data = { jugador1, jugador2, jugador3, jugador4, jugador5, torneo, id }
    return this.http.post<any>(url, data)
  }*/

  /*modEquipo(jugador1: string, jugador2: string, jugador3: string, jugador4: string, jugador5: string, torneo: string, id: number){
    const url = this.baseUrl + 'equipos/' + id
    const data = { jugador1, jugador2, jugador3, jugador4, jugador5, torneo, id }
    return this.http.put<any>(url, data)
  }*/