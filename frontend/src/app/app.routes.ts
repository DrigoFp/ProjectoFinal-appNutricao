import { Routes } from '@angular/router';
import { authGuard } from './auth-guard'; 
import { Dashboard } from './dashboard/dashboard'; // Importante: confirma se o caminho está correto

export const routes: Routes = [
  // 1. Redirecionamento Inicial
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Páginas Públicas
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(m => m.Login) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/register/register').then(m => m.Register) 
  },

  // 3. Páginas Protegidas
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [authGuard] 
  },
  { 
    path: 'goals', 
    loadComponent: () => import('./pages/goals/goals').then(m => m.Goals),
    canActivate: [authGuard] 
  },

  { 
  path: 'resumo', 
  loadComponent: () => import('./pages/resumo/resumo').then(m => m.Resumo),
  canActivate: [authGuard] 
},

  // 4. Rota "Catch-all" (SEMPRE POR ÚLTIMO)
  { path: '**', redirectTo: 'login' }
];