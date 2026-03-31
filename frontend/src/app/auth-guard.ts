import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth';
import { map } from 'rxjs';

export const authGuard = () => {
  const authService = inject(AuthService); 
  const router = inject(Router);

  // Escuta o (userState)
  return authService.currentUser.pipe(
    map(user => {
      if (user) {
        return true; // Ve se existe useres, se sim podem logar
      } else {
        // Se não, manda-o para a página de login
        router.navigate(['/login']); 
        // 2. Bloqueia a entrada
        return false; 
      }
    })
  );
};