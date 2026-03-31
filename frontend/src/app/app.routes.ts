import { Routes } from '@angular/router';
import { authGuard } from './auth-guard'; // Confirma se o nome do ficheiro está mesmo assim

export const routes: Routes = [
  // 1. Se o link estiver vazio, mandamos para o LOGIN
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Páginas Públicas (Qualquer um entra)
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(m => m.Login) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/register/register').then(m => m.Register) 
  },

  // 3. Páginas Protegidas (Só entra com login)
  { 
    path: 'goals', 
    loadComponent: () => import('./pages/goals/goals').then(m => m.Goals),
    canActivate: [authGuard] //  O segurança guarda esta porta
  },

  // 4. Rota "Catch-all": Se o utilizador escrever lixo no URL, vai para o login
  { path: '**', redirectTo: 'login' }
];