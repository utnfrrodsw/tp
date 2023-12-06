import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Editorial, EditorialesService, editorialResponse } from 'src/app/services/editoriales.service';

@Component({
  selector: 'app-crud-editoriales',
  templateUrl: './crud-editoriales.component.html',
  styleUrls: ['./crud-editoriales.component.css']
})
export class CrudEditorialesComponent implements OnInit {

  editorialesIds: string[] = [];
  editorialesData: { [key: string]: { descripcion: string | undefined, imagen: string | undefined } } = {};
  EditorialForm: FormGroup;
  showErrorMessages: boolean = false;
  isPopupOpen: boolean = false;
  modalMessage: string = '';
  showRedirectButton: boolean = false;

  constructor(private editorialesService: EditorialesService, private formBuilder: FormBuilder) {
    this.EditorialForm = this.formBuilder.group({
      descripcion: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9\s]+$/), // Solo letras, números y espacios permitidos
        ],
      ],
      direccion: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9\s]+$/), // Solo letras, números y espacios permitidos
        ],
      ],
      imagen: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[^\s]+$/), // Cualquier caracter excepto espacios permitidos
        ],
      ],
    });
  }

  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

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

  registrarEditorial(): void {
    this.showErrorMessages = true;

    if (this.EditorialForm.valid) {

      const descripcionControl = this.EditorialForm.get('descripcion');
      const direccionControl = this.EditorialForm.get('direccion');
      const imagenControl = this.EditorialForm.get('imagen');

      if (!descripcionControl || !direccionControl || !imagenControl) {
        return;
      }

      const descripcion = descripcionControl.value;
      const direccion = direccionControl.value;
      const imagen = imagenControl.value;

      // Validar si la editorial ya existe antes de realizar el registro
      // TODO: No funciona correctamente
      this.editorialesService.validarEditorialExistente(descripcion).subscribe({
        next: (editorialExistente) => {
          if (editorialExistente !== null) {
            descripcionControl.setErrors({ editorialExistente: true });
            descripcionControl.setValue(descripcion);
            console.error('El nombre de la editorial ya está en uso. Por favor, intente con otro.');
          }
          this.realizarRegistro();
        },
        error: (error) => {
          console.error('Error al validar la editorial', error);
          console.error('Detalles del error:', error);

          if (error && error.error && error.error.mensaje) {
          } else {
            const errorMessage = 'Error desconocido en el registro';
          }
        }
      });
    }
  }

  private realizarRegistro(): void {
    const editorial: Editorial = {
      descripcion: this.EditorialForm.value.descripcion,
      direccion: this.EditorialForm.value.direccion,
      imagen: this.EditorialForm.value.imagen,
    };

    this.editorialesService.registrarEditorial(editorial).subscribe(
      (response: editorialResponse) => {
        console.log('Registro exitoso', response);
        this.closePopup();
        location.reload();
      },
      (error) => {
        console.error('Error al registrar la editorial', error);

        if (error && error.error && error.error.mensaje) {
          console.error('Detalles del error:', error.error.mensaje);
        } else {
          console.error('Error desconocido en el registro');
          const errorMessage = 'Error desconocido en el registro';
        }
      }
    );
  }

  eliminarEditorial(editorialId: string): void {
    if (confirm('¿Está seguro de que desea eliminar esta editorial?')) {
      this.editorialesService.eliminarEditorial(editorialId).subscribe(
        () => {
          console.log('Editorial eliminada con éxito');
          location.reload();
        },
        (error) => {
          console.error('Error al eliminar la editorial', error);
        }
      );
    }
  }
}