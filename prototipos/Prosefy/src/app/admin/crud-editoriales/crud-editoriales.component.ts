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
  editorialesData: { [key: string]: { descripcion: string | undefined, direccion: string | undefined, imagen: string | undefined } } = {};
  EditorialForm: FormGroup;
  EditEditorialForm: FormGroup;
  showErrorMessages: boolean = false;
  isPopupOpen: boolean = false;
  isEditPopupOpen: boolean = false;
  modalMessage: string = '';
  showRedirectButton: boolean = false;
  errorMessage: string = '';
  editingEditorialId: string | null = null;

  constructor(private editorialesService: EditorialesService, private formBuilder: FormBuilder) {

    // Inicializa el formulario de creación
    this.EditorialForm = this.formBuilder.group({
      descripcion: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s,']+$/),
        ],
      ],
      direccion: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s,']+$/),
        ],
      ],
      imagen: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[^\s]+$/),
        ],
      ],
    });

    // Inicializa el formulario de edición
    this.EditEditorialForm = this.formBuilder.group({
      editDescripcion: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s,']+$/),
        ],
      ],
      editDireccion: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s,']+$/),
        ],
      ],
      editImagen: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[^\s]+$/),
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

  openEditPopup(editorialId: string): void {
    this.editingEditorialId = editorialId;
    this.isEditPopupOpen = true;

    // Llena el formulario de edición con los datos actuales de la editorial
    const editorial = this.editorialesData[editorialId];
    if (editorial) {
      this.EditEditorialForm.patchValue({
        editDescripcion: editorial.descripcion,
        editDireccion: editorial.direccion,
        editImagen: editorial.imagen
      });
    }
  }

  closeEditPopup(): void {
    this.isEditPopupOpen = false;
  }

  ngOnInit(): void {
    this.editorialesService.getEditorialesIds().subscribe(
      (editorialesIds: string[]) => {
        this.editorialesIds = editorialesIds;

        Promise.all(this.editorialesIds.map(id =>
          new Promise<void>((resolve) => {
            this.editorialesService.getDescripcion(id).subscribe(
              (descripcion) => {
                this.editorialesData[id] = { descripcion: descripcion, direccion: '', imagen: '' };

                this.editorialesService.getDireccion(id).subscribe(
                  (direccion) => {
                    if (this.editorialesData[id]) {
                      this.editorialesData[id].direccion = direccion;
                    }
                    resolve();
                  },
                  (error) => {
                    console.error(`Error al obtener la dirección de la editorial ${id}`, error);
                    resolve();
                  }
                );
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
      this.editorialesService.validarEditorialExistente(descripcion).subscribe({
        next: (editorialExistente) => {
          if (editorialExistente !== null) {
            descripcionControl.setErrors({ editorialExistente: true });
            descripcionControl.setValue(descripcion);
            this.errorMessage = 'El nombre de la editorial ya está en uso. Por favor, intente con otro.';
          } else {
            this.errorMessage = ''; // Limpiar el mensaje de error si no hay error específico
            this.realizarRegistro();
          }
        },
        error: (error) => {
          console.error('Error al validar la editorial', error);

          if (error && error.error && error.error.mensaje) {
            this.errorMessage = error.error.mensaje;
          } else {
            this.errorMessage = 'Error desconocido en el registro';
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
    if (confirm('¿Está seguro/a de que desea eliminar esta editorial?')) {
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

  actualizarEditorial(): void {
    if (this.EditEditorialForm.valid && this.editingEditorialId) {
      const editDescripcionControl = this.EditEditorialForm.get('editDescripcion');
      const editDireccionControl = this.EditEditorialForm.get('editDireccion');
      const editImagenControl = this.EditEditorialForm.get('editImagen');

      if (!editDescripcionControl || !editDireccionControl || !editImagenControl) {
        return;
      }

      const nuevaDescripcion = editDescripcionControl.value;
      const nuevaDireccion = editDireccionControl.value;
      const nuevaImagen = editImagenControl.value;

      this.editorialesService.updateEditorial(this.editingEditorialId, {
        descripcion: nuevaDescripcion,
        direccion: nuevaDireccion,
        imagen: nuevaImagen
      }).subscribe({
        next: (response) => {
          console.log('Actualización exitosa', response);
          this.closeEditPopup();
          location.reload();
        },
        error: (error) => {
          console.error('Error al actualizar la editorial', error);

          if (error && error.mensaje) {
            console.error('Detalles del error:', error.mensaje);
          } else {
            console.error('Error desconocido en la actualización');
          }
        }
      });
    }
  }

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.EditorialForm.get(fieldName);
    return !!control?.hasError(errorType) && !!control?.touched;
  }
}