// src/app/app.routes.ts

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'animais',
    loadComponent: () => import('./components/animal-lista/animal-lista').then(m => m.AnimalListaComponent)
  },
  {
    path: 'animais/:especie',
    loadComponent: () => import('./components/animal-lista/animal-lista').then(m => m.AnimalListaComponent)
  },
  {
    path: 'abrigos',
    loadComponent: () => import('./components/abrigos/abrigos').then(m => m.AbrigosComponent)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./components/perfil/perfil').then(m => m.PerfilComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];