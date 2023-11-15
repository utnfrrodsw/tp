import { Component } from '@angular/core';
import { EditorialesService, Editorial } from '../../services/editoriales.service';

@Component({
  selector: 'app-todas-las-editoriales',
  templateUrl: './todas-las-editoriales.component.html',
  styleUrls: ['./todas-las-editoriales.component.css']
})
export class TodasLasEditorialesComponent {

  editorialesIds: string[] = [];
  editorialesData: { [key: string]: { descripcion: string | undefined, imagen: string | undefined } } = {};

  isHovered = false;

  public editoriales: Editorial[] = [];

  constructor(private editorialesService: EditorialesService) { }

  ngOnInit() {
    this.editorialesService.getEditorialesIds().subscribe((editorialesIds: string[]) => {
      this.editorialesIds = editorialesIds;
      this.editorialesIds.forEach((id) => {
        this.editorialesService.getDescripcion(id).subscribe((descripcion) => {
          this.editorialesData[id] = { descripcion: descripcion, imagen: '' };
        });
        this.editorialesService.getImagen(id).subscribe((imagen) => {
          this.editorialesData[id].imagen = imagen;
        });
      });
    });
  }

  /* async ngOnInit() {
    this.editoriales = this.editorialesService.getEditoriales();
  } */

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

}