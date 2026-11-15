import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideSearch,
  LucideRefreshCw,
  LucideFolderTree,
  LucideArrowRight,
  LucideAlertTriangle,
  LucideLayers,
  LucideTag,
} from '@lucide/angular';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../interfaces/category.interface';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideSearch,
    LucideRefreshCw,
    LucideFolderTree,
    LucideArrowRight,
    LucideAlertTriangle,
    LucideLayers,
    LucideTag,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categories-page.component.html',
})
export class CategoriesPageComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  // Exponer señales del servicio
  readonly categories = this.categoriesService.categories;
  readonly isLoading = this.categoriesService.isLoading;
  readonly error = this.categoriesService.error;
  readonly activeCategories = this.categoriesService.activeCategories;
  readonly rootCategories = this.categoriesService.rootCategories;

  // Estado local para búsqueda en tiempo real
  readonly searchTerm = signal<string>('');

  // Selector computado reactivo: filtra por nombre, descripción o slug
  readonly filteredCategories = computed<Category[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.categories();

    if (!term) return list;

    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.slug.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term))
    );
  });

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.categoriesService.loadCategories().subscribe({
      error: () => {
        // Error ya capturado en this.categoriesService.error
      },
    });
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }
}
