import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule, Router } from '@angular/router'; 
import { AuthService } from '../services/auth'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  // Criamos a referência para o utilizador que vem do serviço
  user$ = this.authService.user$; 

async sair() {
    try {
      await this.authService.logout(); // Espera o logout terminar
      await this.router.navigate(['/login']); // Redireciona para o login
    } catch (error) {
      console.error('Erro ao sair:', error);
      // Forçamos a navegação mesmo que o logout falhe
      this.router.navigate(['/login']);
    }
  }
}