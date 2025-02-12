import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-crud-categorias',
  templateUrl: './crud-categorias.component.html',
  styleUrls: ['./crud-categorias.component.css'],
})
export class CrudCategoriasComponent implements OnInit {
  categoriasIds: string[] = [];
  categoriasData: { [key: string]: { descripcion: string | undefined } } = {};
  CategoriaForm: FormGroup;
  EditCategoriaForm: FormGroup;
  showErrorMessages: boolean = false;
  isPopupOpen: boolean = false;
  isEditPopupOpen: boolean = false;
  modalMessage: string = '';
  showRedirectButton: boolean = false;
  errorMessage: string = '';
  editingCategoriaId: string | null = null;

  constructor(private categoriasService: CategoriasService, private formBuilder: FormBuilder) {
    this.CategoriaForm = this.formBuilder.group({
      descripcion: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s,']+$/)]],
    });

    this.EditCategoriaForm = this.formBuilder.group({
      editDescripcion: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s,']+$/)]],
    });
  }

  ngOnInit(): void {
    this.categoriasService.getCategorias().subscribe((response: any) => {
      this.categoriasIds = response.data.map((categoria: any) => categoria._id);
      this.categoriasIds.forEach((id) => {
        this.categoriasService.getDescripcion(id).subscribe((descripcion: any) => {
          this.categoriasData[id] = { descripcion: descripcion.data };
        });
      });
    });
  }

  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }

  openEditPopup(categoriaId: string): void {
    this.editingCategoriaId = categoriaId;
    this.isEditPopupOpen = true;
    const categoria = this.categoriasData[categoriaId];
    if (categoria) {
      this.EditCategoriaForm.patchValue({ editDescripcion: categoria.descripcion });
    }
  }

  closeEditPopup(): void {
    this.isEditPopupOpen = false;
  }

  registrarCategoria(): void {
    if (this.CategoriaForm.valid) {
      const nuevaCategoria = { descripcion: this.CategoriaForm.value.descripcion };
      this.categoriasService.registrarCategoria(nuevaCategoria).subscribe(() => {
        location.reload();
      });
    }
  }

  actualizarCategoria(): void {
    if (this.EditCategoriaForm.valid && this.editingCategoriaId) {
      const nuevaDescripcion = this.EditCategoriaForm.value.editDescripcion;
      this.categoriasService.actualizarCategoria(this.editingCategoriaId, { descripcion: nuevaDescripcion }).subscribe(() => {
        location.reload();
      });
    }
  }

  eliminarCategoria(categoriaId: string): void {
    if (confirm('¿Está seguro/a de que desea eliminar esta categoría?')) {
      this.categoriasService.eliminarCategoria(categoriaId).subscribe(() => {
        location.reload();
      });
    }
  }

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.CategoriaForm.get(fieldName);
    return !!control?.hasError(errorType) && !!control?.touched;
  }
}