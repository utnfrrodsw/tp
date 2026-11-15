import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Category, CreateCategoryDto } from '../interfaces/category.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}/categories`;

  // Estado interno manejado con Signals
  private readonly _categories = signal<Category[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Señales públicas de solo lectura (inmutabilidad externa)
  readonly categories = this._categories.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Selectores computados (reactivos ante cambios en _categories)
  readonly activeCategories = computed(() =>
    this._categories().filter((c) => c.isActive)
  );

  readonly rootCategories = computed(() =>
    this.activeCategories().filter((c) => !c.parent)
  );

  readonly totalCategories = computed(() => this._categories().length);

  loadCategories(): Observable<Category[]> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.get<Category[]>(this.baseUrl).pipe(
      tap({
        next: (data) => {
          this._categories.set(data);
          this._isLoading.set(false);
        },
        error: (err: unknown) => {
          this._error.set(this.formatErrorMessage(err));
          this._isLoading.set(false);
        },
      })
    );
  }

  getCategoryByTerm(term: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${term}`);
  }

  createCategory(dto: CreateCategoryDto): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, dto).pipe(
      tap((newCategory) => {
        this._categories.update((prev) => [...prev, newCategory]);
      })
    );
  }

  /**
   * Transforma errores técnicos de HTTP en mensajes legibles y amigables para el usuario
   */
  private formatErrorMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return 'No se pudo conectar con el servidor. Verificá tu conexión a internet o que el backend esté en ejecución.';
      }

      if (err.status === 400) {
        if (Array.isArray(err.error?.message)) {
          return err.error.message.join('. ');
        }
        return err.error?.message ?? 'Solicitud incorrecta o datos inválidos.';
      }

      if (err.status === 404) {
        return 'No se encontraron las categorías solicitadas.';
      }

      if (err.status === 500) {
        return 'Ocurrió un error interno en el servidor. Por favor, intentá nuevamente más tarde.';
      }

      if (err.error?.message && typeof err.error.message === 'string') {
        return err.error.message;
      }
    }

    return 'Ocurrió un error inesperado al procesar la solicitud.';
  }
}
