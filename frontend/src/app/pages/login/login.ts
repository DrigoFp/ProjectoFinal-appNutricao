import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // 1. Injetamos as ferramentas
  private authService = inject(AuthService);
  private router = inject(Router);

  // 2. A função para o formulário
  carregando = false;

  async aoSubmeterLogin(email: string, pass: string) {
    // 1. Assim que entra na função, dizemos que começou a carregar
    this.carregando = true;

    try {
      await this.authService.login(email, pass);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Erro:', error);
      alert('Dados incorretos!');
    } finally {
      // 2. O 'finally' corre sempre, quer dê certo ou erro.
      // Aqui dizemos que já terminou de processar.
      this.carregando = false;
    }
  }
}
