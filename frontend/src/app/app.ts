import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router,} from '@angular/router';
import { AuthService } from './services/auth';
import { HeaderComponent } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');

  authService = inject(AuthService);
  private router = inject(Router);

  // Criamos um atalho para o rádio do utilizador
  user$ = this.authService.user$;

  async sair() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
