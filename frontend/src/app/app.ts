import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');

  authService = inject(AuthService);
  private router = inject(Router);

  // Criamos um atalho para o rádio do utilizador
  user$ = this.authService.currentUser;

  async sair() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
