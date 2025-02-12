import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvinciasService } from '../../services/provincias.service';

@Component({
  selector: 'app-crud-provincias',
  templateUrl: './crud-provincias.component.html',
  styleUrls: ['./crud-provincias.component.css'],
})

export class CrudProvinciasComponent implements OnInit {
  provinciasIds: string[] = [];
  provinciasData: { [key: string]: { descripcion: string | undefined } } = {};
  ProvinciaForm: FormGroup;
  EditProvinciaForm: FormGroup;
  showErrorMessages: boolean = false;
  isPopupOpen: boolean = false;
  isEditPopupOpen: boolean = false;
  modalMessage: string = '';
  showRedirectButton: boolean = false;
  errorMessage: string = '';
  editingProvinciaId: string | null = null;

  constructor(private provinciasService: ProvinciasService, private formBuilder: FormBuilder) {
    this.ProvinciaForm = this.formBuilder.group({
      descripcion: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s,']+$/)]],
    });

    this.EditProvinciaForm = this.formBuilder.group({
      editDescripcion: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s,']+$/)]],
    });
  }

  ngOnInit(): void {
    this.provinciasService.getProvincias().subscribe((provincias: any[]) => {
      provincias.forEach((provincia) => {
        const id = provincia._id;
        const descripcion = provincia.descripcion;
        this.provinciasData[id] = { descripcion };
      });
      this.provinciasIds = Object.keys(this.provinciasData);
    }, (error) => {
      console.error('Error al cargar provincias:', error);
    });
  }

  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }

  openEditPopup(provinciaId: string): void {
    this.editingProvinciaId = provinciaId;
    this.isEditPopupOpen = true;
    const provincia = this.provinciasData[provinciaId];
    if (provincia) {
      this.EditProvinciaForm.patchValue({ editDescripcion: provincia.descripcion });
    }
  }

  closeEditPopup(): void {
    this.isEditPopupOpen = false;
  }

  registrarProvincia(): void {
    if (this.ProvinciaForm.valid) {
      const nuevaProvincia = { descripcion: this.ProvinciaForm.value.descripcion };

      // Validar si la provincia ya existe
      this.provinciasService.getProvinciaByDescripcion(nuevaProvincia.descripcion).subscribe({
        next: (response) => {
          if (response.data) {
            // Si la provincia ya existe, mostrar un mensaje de error
            this.errorMessage = 'Ya existe una provincia con esta descripción.';
          } else {
            // Si no existe, proceder a registrar la nueva provincia
            this.provinciasService.registrarProvincia(nuevaProvincia).subscribe(() => {
              location.reload();
            });
          }
        },
        error: (error) => {
          console.error('Error al validar la provincia:', error);
          this.errorMessage = 'Error al validar la provincia.';
        }
      });
    }
  }

  actualizarProvincia(): void {
    if (this.EditProvinciaForm.valid && this.editingProvinciaId) {
      const nuevaDescripcion = this.EditProvinciaForm.value.editDescripcion;
      this.provinciasService.actualizarProvincia(this.editingProvinciaId, { descripcion: nuevaDescripcion }).subscribe(() => {
        location.reload();
      });
    }
  }

  eliminarProvincia(provinciaId: string): void {
    if (confirm('¿Está seguro/a de que desea eliminar esta categoría?')) {
      this.provinciasService.eliminarProvincia(provinciaId).subscribe(() => {
        location.reload();
      });
    }
  }

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.ProvinciaForm.get(fieldName);
    return !!control?.hasError(errorType) && !!control?.touched;
  }
}
