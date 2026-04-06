import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth';
import { HeaderComponent } from './header/header';
import { Footer } from './footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer, CommonModule], 
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');

  public authService = inject(AuthService);
  private router = inject(Router);

  // O user$ já está definido no teu AuthService como um Observable
  user$ = this.authService.user$;

  async sair() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}