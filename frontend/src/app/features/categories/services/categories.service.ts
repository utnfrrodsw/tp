import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../interfaces/category.interface';
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
        error: (err: Error) => {
          // El mensaje ya viene formateado amigablemente por el errorInterceptor centralizado
          this._error.set(err.message);
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

  updateCategory(id: string, dto: UpdateCategoryDto): Observable<Category> {
    return this.http.patch<Category>(`${this.baseUrl}/${id}`, dto).pipe(
      tap((updatedCategory) => {
        this._categories.update((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...updatedCategory } : c))
        );
      })
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this._categories.update((prev) => prev.filter((c) => c.id !== id));
      })
    );
  }
}
