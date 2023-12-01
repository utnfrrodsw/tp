import { Component } from '@angular/core';
import { Editorial, EditorialesService } from '../../services/editoriales.service';

@Component({
  selector: 'app-eliminar-editorial',
  templateUrl: './eliminar-editorial.component.html',
  styleUrls: ['./eliminar-editorial.component.css']
})
export class EliminarEditorialComponent {
  editorialesIds: string[] = [];
  editorialesData: { [key: string]: { descripcion: string | undefined, imagen: string | undefined, direccion: string | undefined } } = {};

  public editoriales: Editorial[] = [];

  constructor(private editorialesService: EditorialesService) { }

  ngOnInit() {
    this.editorialesService.getEditorialesIds().subscribe((editorialesIds: string[]) => {
      this.editorialesIds = editorialesIds;
      this.editorialesIds.forEach((id) => {
        this.editorialesService.getDescripcion(id).subscribe((descripcion) => {
          this.editorialesData[id] = { descripcion: descripcion, imagen: '', direccion: '' };
        });
        this.editorialesService.getImagen(id).subscribe((imagen) => {
          this.editorialesData[id].imagen = imagen;
        });
        this.editorialesService.getDireccion(id).subscribe((direccion) => {
          this.editorialesData[id].direccion = direccion;
        });
      });
    });
  }

  eliminarEditorial(id: string) {
    this.editorialesService.eliminarEditorial(id).subscribe(
      () => {
        console.log('Editorial eliminada con éxito.');
      },
      (error: any) => {
        console.error('Error al eliminar la editorial:', error);
      }
    )
  }
}
