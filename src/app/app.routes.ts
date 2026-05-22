// src/app/app.routes.ts

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home').then((m) => m.HomeComponent),
  },

  // ── ANIMAIS ──────────────────────────────────────────────────────────────
  // ATENÇÃO: rotas estáticas ANTES das dinâmicas (:id)
  {
    path: 'animais',
    loadComponent: () =>
      import('./components/animal-lista/animal-lista').then((m) => m.AnimalListaComponent),
  },
  {
    path: 'animais/novo',   // deve vir ANTES de 'animais/:id'
    loadComponent: () =>
      import('./components/animal-form/animal-form').then((m) => m.AnimalFormComponent),
  },
  {
    path: 'animais/:id/editar',
    loadComponent: () =>
      import('./components/animal-form/animal-form').then((m) => m.AnimalFormComponent),
  },

  // ── ABRIGOS ───────────────────────────────────────────────────────────────
  {
    path: 'abrigos',
    loadComponent: () =>
      import('./components/abrigos/abrigos').then((m) => m.AbrigosComponent),
  },

  // ── PERFIL / CADASTRO ─────────────────────────────────────────────────────
  // Mantemos ambos os paths para não quebrar links existentes
  {
    path: 'perfil',
    loadComponent: () =>
      import('./components/perfil/perfil').then((m) => m.PerfilComponent),
  },
  {
    path: 'cadastro',
    redirectTo: 'perfil',
    pathMatch: 'full',
  },

  // ── FALLBACK ──────────────────────────────────────────────────────────────
  {
    path: '**',
    redirectTo: '',
  },
];