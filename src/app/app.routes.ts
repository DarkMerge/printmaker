import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shop/shop').then((m) => m.Shop),
  },
];
