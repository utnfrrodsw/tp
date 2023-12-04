import { Component, OnInit } from '@angular/core';
import { EditorialesService } from 'src/app/services/editoriales.service';

@Component({
  selector: 'app-crud-editoriales',
  templateUrl: './crud-editoriales.component.html',
  styleUrls: ['./crud-editoriales.component.css']
})
export class CrudEditorialesComponent implements OnInit {
  editorialesIds: string[] = [];
  editorialesData: { [key: string]: { descripcion: string | undefined, imagen: string | undefined } } = {};

  constructor(private editorialesService: EditorialesService) { }

  ngOnInit(): void {
    this.editorialesService.getEditorialesIds().subscribe(
      (editorialesIds: string[]) => {
        this.editorialesIds = editorialesIds;

        Promise.all(this.editorialesIds.map(id =>
          new Promise<void>((resolve) => {
            this.editorialesService.getDescripcion(id).subscribe(
              (descripcion) => {
                this.editorialesData[id] = { descripcion: descripcion, imagen: '' };
                resolve();
              },
              (error) => {
                console.error(`Error al obtener la descripción de la editorial ${id}`, error);
                resolve();
              }
            );
          })
        )).then(() => {
          Promise.all(this.editorialesIds.map(id =>
            new Promise<void>((resolve) => {
              this.editorialesService.getImagen(id).subscribe(
                (imagen) => {
                  if (this.editorialesData[id]) {
                    this.editorialesData[id].imagen = imagen;
                  }
                  resolve();
                },
                (error) => {
                  console.error(`Error al obtener la imagen de la editorial ${id}`, error);
                  resolve();
                }
              );
            })
          ));
        });
      },
      (error) => {
        console.error('Error al obtener IDs editoriales', error);
      }
    );
  }
}