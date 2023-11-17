import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Comentario, ComentarioService } from 'src/app/services/comentario-service.service';

@Component({
  selector: 'app-nuevo-comentario',
  templateUrl: './nuevo-comentario.component.html',
  styleUrls: ['./nuevo-comentario.component.css']
})

export class NuevoComentarioComponent {
  comentarioForm = this.formBuilder.group({
    comentario: ['', [/*Validators.required*/]]
  });
  comentario!: string;
  allComentarios: string[] = [];

  constructor(private ComentarioService: ComentarioService, private formBuilder : FormBuilder,) {}

  getComentarios() {
    this.allComentarios = this.ComentarioService.getComentarios();
  }

  addComment(): void {

    console.log(this.comentario);
    if (this.comentarioForm.valid){
      this.ComentarioService.agregarComentario(this.comentario);
    }
  }

  get email (){
    return this.comentarioForm.controls.comentario;
  }
}
