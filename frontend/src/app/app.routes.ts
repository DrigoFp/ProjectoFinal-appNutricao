import { Routes } from '@angular/router';
import { authGuard } from './auth-guard'; // Garante que o nome do ficheiro está correto (auth-guard.ts)
import { Perfil } from './perfil/perfil';

export const routes: Routes = [
  // 1. Redirecionamento Inicial: Se abrir a raiz, vai para o login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Páginas Públicas (Sem proteção)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },

  // 3. Páginas Protegidas (Todas usam o canActivate: [authGuard])
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },

  { path: 'metas', component: Perfil, canActivate: [authGuard] },
  
  {
    path: 'metas',
    loadComponent: () => import('./perfil/perfil').then((m) => m.Perfil),
    canActivate: [authGuard],
  },

  {
    path: 'resumo',
    loadComponent: () => import('./pages/resumo/resumo').then((m) => m.Resumo),
    canActivate: [authGuard],
  },

  {
    path: 'goals', // Esta é a tua página de checklist de tarefas
    loadComponent: () => import('./pages/goals/goals').then((m) => m.Goals),
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: 'login' },
];
