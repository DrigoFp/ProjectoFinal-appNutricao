import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
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
  
  // Criamos a referência para o utilizador que vem do serviço
  user$ = this.authService.user$; 

  sair() {
    this.authService.logout();
  }
}