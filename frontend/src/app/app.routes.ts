import { Routes } from '@angular/router';
import { authGuard } from './auth-guard'; 

export const routes: Routes = [
  // Redirecionamento Inicial
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Páginas Públicas
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },

  // Páginas Protegidas
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
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
    path: 'goals',
    loadComponent: () => import('./pages/goals/goals').then((m) => m.Goals),
    canActivate: [authGuard],
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history').then(m => m.HistoryComponent),
    canActivate: [authGuard]
  },

  // Rota de Erro (Wildcard) - Manda para o login se o URL for inválido
  { path: '**', redirectTo: 'login' },
];