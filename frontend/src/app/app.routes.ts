import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'categories',
    pathMatch: 'full',
  },
  {
    path: 'categories',
    loadComponent: () =>
      import(
        './features/categories/pages/categories-page/categories-page.component'
      ).then((m) => m.CategoriesPageComponent),
  },
  {
    path: '**',
    redirectTo: 'categories',
  },
];
