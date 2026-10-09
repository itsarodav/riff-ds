import { Routes } from '@angular/router';

import { PAGES } from './pages';

export const routes: Routes = [
  ...PAGES.map((page) => ({
    path: page.path,
    pathMatch: 'full' as const,
    title: page.path ? `${page.title} · riff-ds` : 'riff-ds · Playground',
    loadComponent: page.loadComponent,
  })),
  { path: '**', redirectTo: '' },
];
